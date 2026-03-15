export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  author: string;
  likes: number;
  createdAt: string;
}

export interface PaginatedPosts {
  items: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CommentsResponse {
  postId: string;
  items: Comment[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface CreatePostData {
  image?: File;
  caption: string;
  author: string;
}
