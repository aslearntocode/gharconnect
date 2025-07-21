import { getSupabaseClient } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImageToConnectBucket(
  file: File,
  userId: string,
  postId?: string
): Promise<UploadResult> {
  try {
    const supabase = await getSupabaseClient();
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}.${fileExtension}`;
    
    console.log('Attempting to upload file:', fileName);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Upload file to the connect bucket
    const { data, error } = await supabase.storage
      .from('connect')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error details:', {
        message: error.message,
        name: error.name,
        error: error
      });
      
      // Provide more specific error messages
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.message?.includes('not found')) {
        errorMessage = 'Storage bucket not found. Please contact support.';
      } else if (error.message?.includes('unauthorized') || error.message?.includes('forbidden')) {
        errorMessage = 'You are not authorized to upload files. Please log in again.';
      } else if (error.message?.includes('file size')) {
        errorMessage = 'File is too large. Maximum size is 5MB.';
      } else if (error.message?.includes('file type')) {
        errorMessage = 'File type not supported. Please use JPEG, PNG, or WebP.';
      } else if (error.message?.includes('policy')) {
        errorMessage = 'Upload policy error. Please contact support.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

    console.log('Upload successful, getting public URL...');

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('connect')
      .getPublicUrl(fileName);

    console.log('Public URL generated:', urlData.publicUrl);

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Upload failed with exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed unexpectedly'
    };
  }
}

export async function deleteImageFromConnectBucket(fileUrl: string): Promise<boolean> {
  try {
    const supabase = await getSupabaseClient();
    
    // Extract the file path from the URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    const filePath = `${userId}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('connect')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    };
  }

  return { valid: true };
} 