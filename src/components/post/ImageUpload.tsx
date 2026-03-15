import { useCallback, useState, useRef } from 'react';
import { Upload, X, AlertTriangle, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { compressImage, formatFileSize } from '../../utils/imageCompression';
import { FILE_UPLOAD } from '../../config/constants';

const MAX_FILE_SIZE = FILE_UPLOAD.MAX_SIZE;
const ALLOWED_TYPES = FILE_UPLOAD.ALLOWED_TYPES;

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  error?: string;
  enableCompression?: boolean;
}

export function ImageUpload({ onChange, error, enableCompression = true }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleFile = useCallback(async (file: File) => {
    setValidationError(null);
    setCompressionInfo(null);
    
    // Step 1: Validate file type
    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      setValidationError('Please upload a JPG, PNG, or WebP image');
      onChange(null);
      setPreview(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    let processedFile = file;
    const originalSize = file.size;

    // Step 2: If oversized, attempt compression first (if enabled)
    if (file.size > MAX_FILE_SIZE) {
      if (enableCompression) {
        setIsCompressing(true);
        try {
          processedFile = await compressImage(file, {
            maxSizeMB: FILE_UPLOAD.COMPRESSION_TARGET_SIZE,
            maxWidthOrHeight: FILE_UPLOAD.MAX_DIMENSION,
            quality: FILE_UPLOAD.COMPRESSION_QUALITY,
          });
          
          const savedBytes = originalSize - processedFile.size;
          setCompressionInfo(
            `Compressed from ${formatFileSize(originalSize)} to ${formatFileSize(processedFile.size)} (saved ${formatFileSize(savedBytes)})`
          );
        } catch (error) {
          console.error('Compression failed:', error);
        } finally {
          setIsCompressing(false);
        }
      }
      
      // Step 3: After compression attempt, validate final size
      if (processedFile.size > MAX_FILE_SIZE) {
        const sizeMB = (processedFile.size / MAX_FILE_SIZE).toFixed(2);
        setValidationError(`Image is too large (${sizeMB} MB). Maximum size is 1 MB`);
        onChange(null);
        setPreview(null);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }
    }

    // Step 4: Accept the file
    onChange(processedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(processedFile);
  }, [onChange, enableCompression]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onChange(null);
    setPreview(null);
    setValidationError(null);
    setCompressionInfo(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const displayError = validationError || error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Photo
      </label>
      
      {preview ? (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={preview} 
              alt="Upload preview" 
              className="w-full aspect-square object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {compressionInfo && (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <Zap className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{compressionInfo}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={clsx(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-gray-400',
            displayError && 'border-red-300 bg-red-50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-describedby={displayError ? 'upload-error' : undefined}
          />
          {isCompressing ? (
            <>
              <div className="w-10 h-10 mx-auto mb-3 animate-spin">
                <Zap className="w-10 h-10 text-pink-500" aria-hidden="true" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Compressing image...
              </p>
            </>
          ) : (
            <>
              <Upload className={clsx('w-10 h-10 mx-auto mb-3', displayError ? 'text-red-400' : 'text-gray-400')} aria-hidden="true" />
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-pink-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, or WebP (max 1 MB)
              </p>
            </>
          )}
        </div>
      )}

      {displayError && (
        <div id="upload-error" className="flex items-center gap-2 text-sm text-red-600" role="alert">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
