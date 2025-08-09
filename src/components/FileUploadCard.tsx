import { useRef } from 'react';
import { Upload, X, Music, Image, Video } from 'lucide-react';

interface FileUploadCardProps {
  title: string;
  currentFile?: string;
  acceptedTypes: string;
  placeholder?: string;
  uploading?: boolean;
  onFileSelect: (file: File) => void;
  onDelete?: () => void;
  type: 'image' | 'video' | 'audio';
}

export default function FileUploadCard({
  title,
  currentFile,
  acceptedTypes,
  placeholder = "Click to upload/change",
  uploading,
  onFileSelect,
  onDelete,
  type
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'audio':
        return <Music className="w-8 h-8 text-smoke-400" />;
      case 'video':
        return <Video className="w-8 h-8 text-smoke-400" />;
      case 'image':
        return <Image className="w-8 h-8 text-smoke-400" />;
      default:
        return <Upload className="w-8 h-8 text-smoke-400" />;
    }
  };

  const renderContent = () => {
    if (uploading) {
      return (
        <div className="text-smoke-400 text-center">
          <div className="animate-spin w-8 h-8 mx-auto mb-2">⟳</div>
          <span className="text-xs">Uploading...</span>
        </div>
      );
    }

    if (currentFile) {
      if (type === 'image') {
        return (
          <img 
            src={currentFile} 
            alt={title}
            className="w-full h-full object-cover rounded"
          />
        );
      }
      
      if (type === 'video') {
        return (
          <video 
            src={currentFile} 
            className="w-full h-full object-cover rounded"
            muted
            controls={false}
            loop
            autoPlay
          />
        );
      }

      if (type === 'audio') {
        return (
          <div className="text-smoke-400 text-center">
            <Music className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Audio file uploaded</span>
          </div>
        );
      }
    }

    return (
      <div className="text-smoke-400 text-center">
        {getIcon()}
        <span className="text-xs block mt-2">{placeholder}</span>
      </div>
    );
  };

  return (
    <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-4">
      <h3 className="text-smoke-100 font-medium mb-3">{title}</h3>
      
      <div 
        className="aspect-video bg-smoke-800/50 rounded border border-smoke-700/30 flex items-center justify-center cursor-pointer hover:border-smoke-600/50 transition-colors overflow-hidden"
        onClick={handleClick}
      >
        {renderContent()}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-smoke-400">
          {currentFile ? 'File uploaded' : 'No file selected'}
        </span>
        {currentFile && onDelete && (
          <button 
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}