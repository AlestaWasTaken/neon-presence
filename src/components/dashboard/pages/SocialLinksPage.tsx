import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';

interface SocialLinksPageProps {
  profile: any;
}

export function SocialLinksPage({ profile }: SocialLinksPageProps) {
  const socialLinks = [
    { id: 1, name: 'Discord', url: 'https://discord.gg/example', icon: '🎮', color: '#5865F2' },
    { id: 2, name: 'Twitter', url: 'https://twitter.com/example', icon: '🐦', color: '#1DA1F2' },
    { id: 3, name: 'Instagram', url: 'https://instagram.com/example', icon: '📷', color: '#E4405F' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white text-gradient mb-2">Social Links</h1>
        <p className="text-smoke-400">Manage your social media connections</p>
      </div>

      {/* Add New Link */}
      <Card className="glass border-smoke-700/30 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
            Your Social Links
          </h2>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30 hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: link.color + '20', border: `1px solid ${link.color}30` }}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{link.name}</h3>
                    <p className="text-smoke-400 text-sm">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="border-smoke-600 text-smoke-300 hover:bg-smoke-800">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {socialLinks.length === 0 && (
          <div className="text-center py-12">
            <LinkIcon className="w-12 h-12 text-smoke-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-smoke-400 mb-2">No social links yet</h3>
            <p className="text-smoke-500 mb-4">Add your first social media link to get started</p>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
        )}
      </Card>

      {/* Link Preview */}
      <Card className="glass border-smoke-700/30 p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          Link Preview
        </h2>
        <div className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30">
          <p className="text-smoke-400 text-sm mb-4">This is how your links will appear on your profile:</p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <div 
                key={link.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full border hover-lift cursor-pointer transition-all"
                style={{ 
                  backgroundColor: link.color + '10',
                  borderColor: link.color + '30',
                  color: link.color
                }}
              >
                <span>{link.icon}</span>
                <span className="text-sm font-medium">{link.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}