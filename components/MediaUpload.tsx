'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImageToConnectBucket, validateImageFile } from '@/lib/uploadUtils';
import { FiUpload, FiX, FiImage, FiVideo } from 'react-icons/fi';

interface MediaUploadProps {
  onMediaChange: (urls: string[]) => void;
  maxFiles?: number;
  userId: string;
  disabled?: boolean;
  reset?: boolean; // New prop to trigger reset
  key?: string | number; // Key prop for forced re-render
}

export default function MediaUpload({ 
  onMediaChange, 
  maxFiles = 5, 
  userId, 
  disabled = false,
  reset = false,
  key
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [media, setMedia] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset internal state when reset prop changes
  useEffect(() => {
    if (reset) {
      setMedia([]);
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

    // Check if we've reached the maximum number of files
    if (media.length >= maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const result = await uploadImageToConnectBucket(file, userId);
      
      if (result.success && result.url) {
        const newMedia = [...media, result.url];
        setMedia(newMedia);
        onMediaChange(newMedia);
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

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
    onMediaChange(newMedia);
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|mov|avi|webm)$/i);
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading || media.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading || media.length >= maxFiles}
          className="flex items-center gap-2"
        >
          <FiUpload className="w-4 h-4" />
          {uploading ? 'Uploading...' : `Add Media${maxFiles > 1 ? '' : ''}`}
        </Button>
        <span className="text-sm text-gray-500">
          {media.length}/{maxFiles} files
        </span>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {uploadError}
        </div>
      )}

      {/* Media Preview */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {media.map((url, index) => (
            <div key={index} className="relative group">
              {isVideo(url) ? (
                <video
                  src={url}
                  className="w-full h-24 object-cover rounded-lg border"
                  controls
                  muted
                />
              ) : (
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
              )}
              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                {isVideo(url) ? <FiVideo className="w-3 h-3" /> : <FiImage className="w-3 h-3" />}
              </div>
              <button
                type="button"
                onClick={() => removeMedia(index)}
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
        <p>• Maximum file size: 10MB</p>
        <p>• Supported formats: JPEG, PNG, WebP, MP4, MOV, AVI</p>
        <p>• Files will be stored securely in our cloud storage</p>
      </div>
    </div>
  );
} 