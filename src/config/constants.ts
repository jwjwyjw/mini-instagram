/**
 * Application-wide constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://mini-instagram-api.mistcloud.workers.dev/api',
  API_KEY: import.meta.env.VITE_API_KEY || 'ivapikey123',
  TIMEOUT: 30000, // 30 seconds
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  FEED_PAGE_SIZE: 12,
} as const;

// Cache/Stale Times (in milliseconds)
export const CACHE_TIME = {
  POSTS: 1000 * 60 * 2, // 2 minutes
  POST_DETAIL: 1000 * 60 * 5, // 5 minutes
  COMMENTS: 1000 * 60 * 2, // 2 minutes
  QUERY_CLIENT_STALE: 1000 * 60 * 5, // 5 minutes
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 1_000_000, // 1 MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  COMPRESSION_QUALITY: 0.85,
  MAX_DIMENSION: 1920,
  COMPRESSION_TARGET_SIZE: 0.95, // 95% of max size
} as const;

// Form Validation
export const VALIDATION = {
  AUTHOR_MIN_LENGTH: 2,
  AUTHOR_MAX_LENGTH: 40,
  CAPTION_MAX_LENGTH: 2200,
} as const;

// UI
export const UI = {
  INFINITE_SCROLL_ROOT_MARGIN: '100px',
  RETRY_COUNT: 1,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  TIMEOUT: 'Request timed out. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to publish this content.',
  UNAUTHORIZED_VIEW: 'You are not authorized to view this content.',
  POST_NOT_FOUND: 'This post may have been deleted',
  PAYLOAD_TOO_LARGE: 'The image is too large. Please choose an image under 1 MB.',
  UNSUPPORTED_FORMAT: 'Unsupported image format. Please use JPG, PNG, or WebP.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;
