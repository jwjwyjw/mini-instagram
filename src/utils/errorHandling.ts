import { ApiClientError } from '../api/client';
import { ERROR_MESSAGES } from '../config/constants';

/**
 * Error handling utilities for consistent error messages across the app
 */

/**
 * Get user-friendly error message from API errors
 * @param error - Error object from API call
 * @returns User-friendly error message
 */
export function getApiErrorMessage(error: Error): string {
  if (error instanceof ApiClientError) {
    switch (error.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 413:
        return ERROR_MESSAGES.PAYLOAD_TOO_LARGE;
      case 415:
        return ERROR_MESSAGES.UNSUPPORTED_FORMAT;
      case 408:
        return ERROR_MESSAGES.TIMEOUT;
      default:
        return error.message;
    }
  }
  
  // Network errors
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return ERROR_MESSAGES.GENERIC;
}

