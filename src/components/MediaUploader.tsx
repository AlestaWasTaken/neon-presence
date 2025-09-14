import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Play, Pause, Volume2, Image, Video, Music } from 'lucide-react';
import { toast } from 'sonner';

interface MediaUploaderProps {
  type: 'background' | 'audio' | 'avatar' | 'cursor';
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function MediaUploader({ type, currentUrl, onUpload, onRemove }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const bucketMap = {
    background: 'backgrounds',
    audio: 'audio',
    avatar: 'avatars',
    cursor: 'cursors'
  };

  const acceptedTypes = {
    background: 'image/*,video/*',
    audio: 'audio/*',
    avatar: 'image/*',
    cursor: 'image/*'
  };

  const getIcon = () => {
    switch (type) {
      case 'background': return Video;
      case 'audio': return Music;
      case 'avatar': return Image;
      case 'cursor': return Image;
      default: return Upload;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'background': return 'Arka Plan';
      case 'audio': return 'Ses';
      case 'avatar': return 'Profil Resmi';
      case 'cursor': return 'Özel Cursor';
      default: return 'Medya';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'tan küçük olmalıdır');
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const bucket = bucketMap[type];

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onUpload(data.publicUrl);
      toast.success('Dosya başarıyla yüklendi');
    } catch (error: any) {
      toast.error('Yükleme sırasında hata oluştu: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const IconComponent = getIcon();
  const displayUrl = preview || currentUrl;
  const isVideo = displayUrl && /\.(mp4|webm|ogg|mov)$/i.test(displayUrl);
  const isImage = displayUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(displayUrl);
  const isAudio = displayUrl && /\.(mp3|wav|ogg|m4a)$/i.test(displayUrl);

  return (
    <Card className="glass border-smoke-700/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-smoke-200 flex items-center gap-2">
              <IconComponent className="w-4 h-4" />
              {getTitle()}
            </h3>
            {displayUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Preview Area */}
          <div className="relative aspect-video bg-smoke-900/50 rounded-lg border border-smoke-700/30 overflow-hidden">
            {!displayUrl ? (
              <div className="flex flex-col items-center justify-center h-full text-smoke-400">
                <IconComponent className="w-8 h-8 mb-2" />
                <span className="text-sm">Dosya seç</span>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {isVideo && (
                  <video
                    ref={videoRef}
                    src={displayUrl}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    autoPlay
                  />
                )}
                {isImage && (
                  <img
                    src={displayUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                {isAudio && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Music className="w-12 h-12 text-smoke-300 mb-4" />
                    <audio
                      ref={audioRef}
                      src={displayUrl}
                      controls
                      className="w-full max-w-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes[type]}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full glass border-smoke-700/30"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Yükleniyor...' : displayUrl ? 'Değiştir' : 'Dosya Seç'}
            </Button>
            <p className="text-xs text-smoke-500 text-center">
              Maksimum 10MB • {acceptedTypes[type].replace('/*', '').toUpperCase()} formatları
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}