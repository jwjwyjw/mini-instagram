import { useEffect, useRef, useCallback, useMemo } from 'react';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/post/PostCard';
import { Spinner, ErrorMessage, FeedSkeleton } from '../components/ui';
import { ERROR_MESSAGES, PAGINATION, UI } from '../config/constants';

export function FeedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = usePosts(PAGINATION.FEED_PAGE_SIZE);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: UI.INFINITE_SCROLL_ROOT_MARGIN,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Couldn't load posts"
        message={ERROR_MESSAGES.UNAUTHORIZED_VIEW}
        onRetry={() => refetch()}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">No posts yet</p>
        <p className="text-gray-400">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="sr-only">Feed</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && <Spinner size="md" />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-gray-400 text-sm">You've reached the end</p>
        )}
      </div>
    </div>
  );
}
