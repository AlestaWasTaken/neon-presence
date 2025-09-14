import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, Music, File, Trash2 } from 'lucide-react';

export function MediaPage() {
  const mediaFiles = [
    { id: 1, name: 'background-video.mp4', type: 'video', size: '15.2 MB', url: '/api/media/bg-video.mp4' },
    { id: 2, name: 'profile-avatar.jpg', type: 'image', size: '2.1 MB', url: '/api/media/avatar.jpg' },
    { id: 3, name: 'background-music.mp3', type: 'audio', size: '5.8 MB', url: '/api/media/bg-music.mp3' }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return Image;
      case 'audio': return Music;
      default: return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-red-500 to-red-600';
      case 'image': return 'from-green-500 to-green-600';
      case 'audio': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white text-gradient mb-2">Media Host</h1>
        <p className="text-smoke-400">Manage your profile media files</p>
      </div>

      {/* Upload Area */}
      <Card className="glass border-smoke-700/30 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Upload Media Files</h2>
          <p className="text-smoke-400 mb-6">
            Drag and drop files here or click to browse
          </p>
          
          <div className="border-2 border-dashed border-smoke-600 rounded-xl p-12 mb-6 hover:border-purple-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-smoke-400 mx-auto mb-4" />
            <p className="text-smoke-400 mb-2">Drop your files here</p>
            <p className="text-sm text-smoke-500">Supports: JPG, PNG, GIF, MP4, MP3, WAV (Max 50MB)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
              <Image className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              <Video className="w-4 h-4 mr-2" />
              Upload Videos
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              <Music className="w-4 h-4 mr-2" />
              Upload Audio
            </Button>
          </div>
        </div>
      </Card>

      {/* Media Library */}
      <Card className="glass border-smoke-700/30 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
            Media Library
          </h2>
          <div className="text-sm text-smoke-400">
            {mediaFiles.length} files • 23.1 MB total
          </div>
        </div>

        {mediaFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div key={file.id} className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30 hover-lift group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getFileColor(file.type)} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-600 text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1 truncate">{file.name}</h3>
                  <p className="text-smoke-400 text-sm mb-3">{file.size}</p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-smoke-600 text-smoke-300 hover:bg-smoke-800">
                      Copy URL
                    </Button>
                    <Button size="sm" variant="outline" className="border-smoke-600 text-smoke-300 hover:bg-smoke-800">
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-smoke-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-smoke-400 mb-2">No media files yet</h3>
            <p className="text-smoke-500 mb-4">Upload your first media file to get started</p>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First File
            </Button>
          </div>
        )}
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-smoke-700/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <File className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{mediaFiles.length}</div>
              <div className="text-sm text-smoke-400">Total Files</div>
            </div>
          </div>
          <div className="w-full bg-smoke-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
          </div>
        </Card>

        <Card className="glass border-smoke-700/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">23.1 MB</div>
              <div className="text-sm text-smoke-400">Storage Used</div>
            </div>
          </div>
          <div className="w-full bg-smoke-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '23%' }} />
          </div>
        </Card>

        <Card className="glass border-smoke-700/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">76.9 MB</div>
              <div className="text-sm text-smoke-400">Available</div>
            </div>
          </div>
          <div className="w-full bg-smoke-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '77%' }} />
          </div>
        </Card>
      </div>
    </div>
  );
}