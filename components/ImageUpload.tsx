'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImageToConnectBucket, validateImageFile } from '@/lib/uploadUtils';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  userId: string;
  disabled?: boolean;
  reset?: boolean; // New prop to trigger reset
  key?: string | number; // Key prop for forced re-render
}

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 5, 
  userId, 
  disabled = false,
  reset = false,
  key
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset internal state when reset prop changes
  useEffect(() => {
    if (reset) {
      setImages([]);
      setUploadError(null);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [reset]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    // Check if we've reached the maximum number of images
    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const result = await uploadImageToConnectBucket(file, userId);
      
      if (result.success && result.url) {
        const newImages = [...images, result.url];
        setImages(newImages);
        onImagesChange(newImages);
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading || images.length >= maxImages}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <FiUpload className="w-4 h-4" />
          {uploading ? 'Uploading...' : `Add Photo${maxImages > 1 ? 's' : ''}`}
        </Button>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {uploadError}
        </div>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p>• Maximum file size: 5MB</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Images will be stored securely in our cloud storage</p>
      </div>
    </div>
  );
} 