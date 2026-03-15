import { VALIDATION, FILE_UPLOAD } from '../config/constants';

/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates author name
 */
export function validateAuthor(author: string): ValidationResult {
  const trimmed = author.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your name' };
  }
  
  if (trimmed.length < VALIDATION.AUTHOR_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be at least ${VALIDATION.AUTHOR_MIN_LENGTH} characters` 
    };
  }
  
  if (trimmed.length > VALIDATION.AUTHOR_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be ${VALIDATION.AUTHOR_MAX_LENGTH} characters or less` 
    };
  }
  
  return { isValid: true };
}

/**
 * Validates caption
 */
export function validateCaption(caption: string): ValidationResult {
  if (caption.length > VALIDATION.CAPTION_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Caption must be ${VALIDATION.CAPTION_MAX_LENGTH} characters or less` 
    };
  }
  
  return { isValid: true };
}

/**
 * Validates image file
 */
export function validateImageFile(file: File): ValidationResult {
  if (!(FILE_UPLOAD.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please upload a JPG, PNG, or WebP image' 
    };
  }
  
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    const sizeMB = (file.size / 1_000_000).toFixed(2);
    return { 
      isValid: false, 
      error: `Image is too large (${sizeMB} MB). Maximum size is 1 MB` 
    };
  }
  
  return { isValid: true };
}

/**
 * Validates create post form data
 */
export interface CreatePostFormData {
  author: string;
  caption: string;
  image?: File | null;
}

export function validateCreatePostForm(data: CreatePostFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  
  const authorValidation = validateAuthor(data.author);
  if (!authorValidation.isValid) {
    errors.author = authorValidation.error!;
  }
  
  const captionValidation = validateCaption(data.caption);
  if (!captionValidation.isValid) {
    errors.caption = captionValidation.error!;
  }
  
  return errors;
}
