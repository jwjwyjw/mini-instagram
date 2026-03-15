/**
 * Image compression and optimization utilities
 * Provides client-side image processing to reduce file sizes before upload
 */

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
  fileType?: string;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  quality: 0.85,
  fileType: 'image/jpeg',
};

/**
 * Compresses an image file to meet size requirements
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // If file is already small enough, return as-is
  if (file.size <= opts.maxSizeMB * 1_000_000) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > opts.maxWidthOrHeight || height > opts.maxWidthOrHeight) {
            if (width > height) {
              height = (height / width) * opts.maxWidthOrHeight;
              width = opts.maxWidthOrHeight;
            } else {
              width = (width / height) * opts.maxWidthOrHeight;
              height = opts.maxWidthOrHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const compressedFile = new File([blob], file.name, {
                type: opts.fileType,
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            opts.fileType,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates image file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid, false otherwise
 */
export function isValidImageType(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1000;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
