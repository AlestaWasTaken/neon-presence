import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadProps {
  bucket: string;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

export function useFileUpload({
  bucket,
  folder,
  allowedTypes = [],
  maxSize = 50
}: UseFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      // Validate file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `Allowed types: ${allowedTypes.join(', ')}`,
          variant: "destructive"
        });
        return null;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum size: ${maxSize}MB`,
          variant: "destructive"
        });
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload files",
          variant: "destructive"
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder ? folder + '/' : ''}${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL for public buckets
      if (bucket === 'avatars' || bucket === 'cursors') {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);
        return publicUrl;
      }

      // For private buckets, return the path
      return data.path;

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      toast({
        title: "File deleted",
        description: "File removed successfully"
      });
      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading
  };
}