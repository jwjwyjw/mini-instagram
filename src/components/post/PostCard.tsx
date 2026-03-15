import { memo, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { formatRelativeTime } from '../../utils/date';
// import { apiClient } from '../../api/client';
// import { CACHE_TIME } from '../../config/constants';
// import { useQueryClient } from '@tanstack/react-query';

interface PostCardProps {
  post: Post;
}

/**
 * PostCard component - Memoized for performance
 * Displays a post card with image, author, caption, and engagement metrics
 */
export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  // const queryClient = useQueryClient();
  // const prefetchPost = useCallback(() => {
  //   queryClient.prefetchQuery({
  //     queryKey: ['post', post.id],
  //     queryFn: () => apiClient.getPost(post.id),
  //     staleTime: CACHE_TIME.POST_DETAIL,
  //   });
  //   queryClient.prefetchQuery({
  //     queryKey: ['comments', post.id],
  //     queryFn: () => apiClient.getComments(post.id),
  //     staleTime: CACHE_TIME.COMMENTS,
  //   });
  // }, [queryClient, post.id]);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* <Link to={`/post/${post.id}`} className="block" onMouseEnter={prefetchPost}> */}
      <Link to={`/post/${post.id}`} className="block">  
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
          <img
            src={post.imageUrl}
            alt={post.caption || `Post by ${post.author}`}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <div 
            className="flex items-center gap-1.5 text-gray-600"
            aria-label={`${post.likes} likes`}
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
          </div>
          <Link 
            to={`/post/${post.id}`}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
            aria-label="View comments"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm">
            <Link 
              to={`/post/${post.id}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {post.author}
            </Link>
            {post.caption && (
              <span className="text-gray-700 line-clamp-2">{post.caption}</span>
            )}
          </p>
          <time 
            dateTime={post.createdAt}
            className="text-xs text-gray-400 block"
          >
            {formatRelativeTime(post.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
});
