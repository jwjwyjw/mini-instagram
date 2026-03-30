import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { CreatePostData } from '../types';
import { CACHE_TIME, PAGINATION } from '../config/constants';

export function usePosts(limit: number = PAGINATION.DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => apiClient.getPosts(pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    staleTime: CACHE_TIME.POSTS,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => apiClient.getPost(id),
    staleTime: CACHE_TIME.POST_DETAIL,
    enabled: !!id,
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => apiClient.getComments(postId),
    staleTime: CACHE_TIME.COMMENTS,
    enabled: !!postId,
  });
}

export function usePostWithComments(id: string) {
  const post = usePost(id);
  const comments = useComments(id);
  
  return {
    post: post.data,
    comments: comments.data,
    isLoading: post.isLoading || comments.isLoading,
    isError: post.isError || comments.isError,
    error: post.error || comments.error,
    refetch: () => {
      post.refetch();
      comments.refetch();
    },
  };
}

/**
 * Hook for creating a new post with optimistic updates
 * Immediately updates the UI before server confirmation for better UX
 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostData) => apiClient.createPost(data),
    onMutate: async (newPostData) => {
      // Save previous data for rollback
      const previousData = queryClient.getQueryData(['posts']);

      // Create optimistic post
      const optimisticPost = {
        id: 'temp-' + Date.now(),
        author: newPostData.author,
        caption: newPostData.caption,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      
      // Update cache immediately
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            // Add to first page
            if (index === 0) {
              return {
                ...page,
                items: [optimisticPost, ...page.items],
              };
            }
            return page;
          }),
        };
      });
      
      // Return previous data for rollback
      return { previousData };
    },
    
    onSuccess: () => {
      // Update with real data when server responds
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },

    onError: (error, _variables, context) => {
      console.log('Error occurred, rolling back:', error.message);
      
      // Restore previous data (remove optimistic post)
      if (context?.previousData) {
        queryClient.setQueryData(['posts'], context.previousData);
      }
    },
  });
}
