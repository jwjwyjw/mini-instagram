import type { Post, PaginatedPosts, CommentsResponse, ApiError } from '../types';
import { API_CONFIG } from '../config/constants';

const API_BASE_URL = API_CONFIG.BASE_URL;
const API_KEY = API_CONFIG.API_KEY;
const DEFAULT_TIMEOUT = API_CONFIG.TIMEOUT;

export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

/**
 * API Client for Mini Instagram
 * Provides typed methods for all API endpoints with error handling,
 * timeout management, request cancellation support, and interceptors.
 */
class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  /**
   * Add a request interceptor
   * @param interceptor - Function to modify request config before sending
   * @returns Function to remove the interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      this.requestInterceptors = this.requestInterceptors.filter(
        (fn) => fn !== interceptor
      );
    };
  }

  /**
   * Add a response interceptor
   * @param interceptor - Function to process response before returning
   * @returns Function to remove the interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      this.responseInterceptors = this.responseInterceptors.filter(
        (fn) => fn !== interceptor
      );
    };
  }

  /**
   * Apply all request interceptors
   */
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  /**
   * Apply all response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  /**
   * Creates an AbortController with timeout
   * @param timeoutMs - Timeout in milliseconds
   * @returns AbortController and cleanup function
   */
  private createTimeoutController(timeoutMs: number = DEFAULT_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const cleanup = () => clearTimeout(timeoutId);
    return { controller, cleanup };
  }

  /**
   * Generic request handler with timeout and error handling
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @param timeoutMs - Request timeout in milliseconds
   * @returns Parsed response data
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = DEFAULT_TIMEOUT
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { controller, cleanup } = this.createTimeoutController(timeoutMs);
    
    try {
      const requestConfig = await this.applyRequestInterceptors({
        ...options,
        headers: {
          'x-api-key': API_KEY,
          ...options.headers,
        },
        signal: controller.signal,
      });

      let response = await fetch(url, requestConfig);
      response = await this.applyResponseInterceptors(response);

      if (!response.ok) {
        throw await this.parseErrorResponse(response);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError('Request timed out. Please check your connection and try again.', 'TIMEOUT', 408);
      }
      throw error;
    } finally {
      cleanup();
    }
  }

  private async parseErrorResponse(response: Response): Promise<ApiClientError> {
    const errorData: ApiError = await response.json();
    return new ApiClientError(errorData.error.message, errorData.error.code, response.status);
  }

  /**
   * Fetch paginated posts
   * @param cursor - Pagination cursor for next page
   * @param limit - Number of posts per page (default: 10)
   * @returns Paginated posts response
   */
  async getPosts(cursor?: string, limit: number = 10): Promise<PaginatedPosts> {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);
    params.set('limit', limit.toString());
    
    const queryString = params.toString();
    return this.request<PaginatedPosts>(`/posts${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Fetch a single post by ID
   * @param id - Post ID
   * @returns Post data
   */
  async getPost(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  /**
   * Fetch comments for a post
   * @param postId - Post ID
   * @returns Comments response
   */
  async getComments(postId: string): Promise<CommentsResponse> {
    return this.request<CommentsResponse>(`/comments/${postId}`);
  }

  /**
   * Create a new post with optional image
   * @param data - Post data including image, caption, and author
   * @returns Created post
   */
  async createPost(data: { image?: File; caption: string; author: string }): Promise<Post> {
    const formData = new FormData();
    
    if (data.image) {
      formData.append('image', data.image);
    }
    formData.append('caption', data.caption);
    formData.append('author', data.author);

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new ApiClientError(errorData.error.message, errorData.error.code, response.status);
    }

    return response.json();
  }
}

export class ApiClientError extends Error {
  code: string;
  status: number;
  
  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

export const apiClient = new ApiClient();
