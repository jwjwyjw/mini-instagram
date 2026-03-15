import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-pulse bg-gray-200 rounded', className)}
      aria-hidden="true"
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-8 h-5" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
