import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar } from 'lucide-react';
import { usePostWithComments } from '../hooks/usePosts';
import { CommentList } from '../components/post/CommentList';
import { Spinner, ErrorMessage } from '../components/ui';
import { formatDateTime } from '../utils/date';
import { ApiClientError } from '../api/client';
import type { Post } from '../types';
import { ERROR_MESSAGES } from '../config/constants';

function BackToFeedLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      <span>Back to feed</span>
    </Link>
  );
}

function PostImage({ imageUrl, caption, author }: { imageUrl: string; caption?: string; author: string }) {
  return (
    <div className="aspect-square relative overflow-hidden bg-gray-100">
      <img
        src={imageUrl}
        alt={caption || `Post by ${author}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function PostHeader({ author, likes }: { author: string; likes: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
          <span className="text-white font-medium">
            {author.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-semibold text-gray-900">{author}</span>
      </div>
      
      <button 
        className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
        aria-label={`${likes} likes`}
      >
        <Heart className="w-6 h-6" aria-hidden="true" />
        <span className="font-medium">{likes.toLocaleString()}</span>
      </button>
    </div>
  );
}

function PostMetadata({ createdAt }: { createdAt: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Calendar className="w-4 h-4" aria-hidden="true" />
      <time dateTime={createdAt}>{formatDateTime(createdAt)}</time>
    </div>
  );
}

function PostContent({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <PostImage imageUrl={post.imageUrl} caption={post.caption} author={post.author} />

      <div className="p-6">
        <PostHeader author={post.author} likes={post.likes} />

        {post.caption && (
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.caption}</p>
        )}

        <PostMetadata createdAt={post.createdAt} />
      </div>
    </div>
  );
}

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  
  const {
    post,
    comments,
    isLoading,
    isError,
    error,
    refetch,
  } = usePostWithComments(id!);

  if (isLoading && !post) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (isError || !post) {
    const isUnauthorized = error instanceof ApiClientError && error.status === 401;
    const errorTitle = isUnauthorized ? "Unauthorized" : "Post not found";
    const errorMessage = isUnauthorized 
      ? ERROR_MESSAGES.UNAUTHORIZED_VIEW
      : ERROR_MESSAGES.POST_NOT_FOUND;
    
    return (
      <div className="max-w-2xl mx-auto">
        <BackToFeedLink />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ErrorMessage
            title={errorTitle}
            message={errorMessage}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackToFeedLink />

      <PostContent post={post} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="border-t border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Comments</h2>
          <CommentList
            comments={comments?.items ?? []}
            isLoading={isLoading}
            error={isError ? error : null}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    </div>
  );
}
