import { supabase } from '@/lib/supabase';
import { StorageError } from '@supabase/storage-js';

// Function to upload image to Supabase storage
export async function uploadImageToStorage(
  file: File | Buffer, 
  path: string, 
  bucketName: string = 'tryon-outputs'
): Promise<{ data: { path: string } | null; error: StorageError | null }> {
  let uploadResponse;
  
  if (file instanceof File) {
    // If file is a File object
    uploadResponse = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
  } else {
    // If file is a Buffer
    uploadResponse = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });
  }

  return uploadResponse;
}

// Function to get public URL for an image in storage
export async function getImagePublicUrl(
  path: string,
  bucketName: string = 'tryon-outputs'
): Promise<{ data: { publicUrl: string } | null; error: StorageError | null }> {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as StorageError };
  }
}

// Function to delete image from storage
export async function deleteImageFromStorage(
  path: string, 
  bucketName: string = 'tryon-outputs'
): Promise<{ error: StorageError | null }> {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([path]);

  return { error };
}