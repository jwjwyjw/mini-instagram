import { memo } from 'react';
import type { Comment } from '../../types';
import { formatRelativeTime } from '../../utils/date';
import { Spinner } from '../ui/Spinner';
import { ErrorMessage } from '../ui/ErrorMessage';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

/**
 * CommentList component - Memoized for performance
 * Displays a list of comments with loading and error states
 */
export const CommentList = memo(function CommentList({ comments, isLoading, error, onRetry }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Couldn't load comments"
        message={error.message}
        onRetry={onRetry}
      />
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <ul className="space-y-4" aria-label="Comments">
      {comments.map((comment) => (
        <li key={comment.id} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">
              {comment.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-semibold text-gray-900">{comment.author}</span>
              <span className="text-gray-700 ml-2">{comment.text}</span>
            </p>
            <time 
              dateTime={comment.createdAt}
              className="text-xs text-gray-400"
            >
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
});
