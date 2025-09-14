import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Eye, Star, Download } from 'lucide-react';

export function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: 'Neon Gaming',
      description: 'Perfect for gamers with vibrant neon effects',
      preview: '/api/templates/neon-gaming.jpg',
      category: 'Gaming',
      premium: false,
      rating: 4.8,
      downloads: 1200
    },
    {
      id: 2,
      name: 'Minimalist Pro',
      description: 'Clean and professional design',
      preview: '/api/templates/minimalist-pro.jpg',
      category: 'Professional',
      premium: true,
      rating: 4.9,
      downloads: 850
    },
    {
      id: 3,
      name: 'Cyberpunk',
      description: 'Futuristic cyberpunk aesthetic',
      preview: '/api/templates/cyberpunk.jpg',
      category: 'Futuristic',
      premium: true,
      rating: 4.7,
      downloads: 950
    },
    {
      id: 4,
      name: 'Nature Zen',
      description: 'Calm and peaceful nature theme',
      preview: '/api/templates/nature-zen.jpg',
      category: 'Nature',
      premium: false,
      rating: 4.6,
      downloads: 720
    },
    {
      id: 5,
      name: 'Dark Matter',
      description: 'Mysterious dark space theme',
      preview: '/api/templates/dark-matter.jpg',
      category: 'Space',
      premium: true,
      rating: 4.8,
      downloads: 1100
    },
    {
      id: 6,
      name: 'Retro Wave',
      description: 'Nostalgic 80s retro vibes',
      preview: '/api/templates/retro-wave.jpg',
      category: 'Retro',
      premium: false,
      rating: 4.5,
      downloads: 640
    }
  ];

  const categories = ['All', 'Gaming', 'Professional', 'Futuristic', 'Nature', 'Space', 'Retro'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white text-gradient mb-2">Profile Templates</h1>
        <p className="text-smoke-400">Choose from our collection of stunning profile templates</p>
      </div>

      {/* Category Filter */}
      <Card className="glass border-smoke-700/30 p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
              className={category === 'All' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                : 'border-smoke-600 text-smoke-300 hover:bg-smoke-800'
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Card key={template.id} className="glass border-smoke-700/30 overflow-hidden hover-lift group">
            {/* Template Preview */}
            <div className="relative aspect-video bg-gradient-to-br from-smoke-800 to-smoke-900 flex items-center justify-center">
              <div className="text-smoke-400 text-sm">Template Preview</div>
              {template.premium && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Template Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{template.rating}</span>
                  </div>
                </div>
                <p className="text-smoke-400 text-sm mb-3">{template.description}</p>
                
                <div className="flex items-center justify-between text-xs text-smoke-500">
                  <span className="bg-smoke-800 px-2 py-1 rounded-full">{template.category}</span>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-smoke-600 text-smoke-300 hover:bg-smoke-800"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className={template.premium 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                  }
                >
                  {template.premium ? 'Upgrade' : 'Use'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Premium Promotion */}
      <Card className="glass border-purple-500/30 p-8 bg-gradient-to-br from-purple-900/20 to-purple-800/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Unlock Premium Templates</h2>
          <p className="text-purple-300 mb-6">
            Get access to exclusive premium templates and advanced customization options
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-purple-200 mb-6">
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4" />
              50+ Premium Templates
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              Advanced Customization
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              Regular Updates
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8">
            Upgrade to Premium
          </Button>
        </div>
      </Card>

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-smoke-700/30 p-6 text-center">
          <div className="text-2xl font-bold text-white text-gradient mb-1">24</div>
          <div className="text-smoke-400 text-sm">Total Templates</div>
        </Card>
        
        <Card className="glass border-smoke-700/30 p-6 text-center">
          <div className="text-2xl font-bold text-white text-gradient mb-1">8</div>
          <div className="text-smoke-400 text-sm">Premium Templates</div>
        </Card>
        
        <Card className="glass border-smoke-700/30 p-6 text-center">
          <div className="text-2xl font-bold text-white text-gradient mb-1">4.7</div>
          <div className="text-smoke-400 text-sm">Average Rating</div>
        </Card>
      </div>
    </div>
  );
}