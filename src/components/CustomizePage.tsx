import React, { useState } from 'react';
import { MediaUploader } from '@/components/MediaUploader';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Crown, MapPin, Sparkles } from 'lucide-react';

interface CustomizePageProps {
  formData: any;
  setFormData: (data: any) => void;
  customizationSettings: any;
  handleCustomizationChange: (key: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CustomizePage({ 
  formData, 
  setFormData, 
  customizationSettings, 
  handleCustomizationChange,
  onSave,
  isSaving 
}: CustomizePageProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white text-gradient mb-2">Customize Your Profile</h1>
        <p className="text-smoke-400">Personalize your profile with unique assets and styling</p>
      </div>

      {/* Assets Uploader */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
          Media Assets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Background Video
            </h3>
            <MediaUploader
              type="background"
              currentUrl={formData.background_video_url}
              onUpload={(url) => setFormData(prev => ({ ...prev, background_video_url: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, background_video_url: '' }))}
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Background Audio
            </h3>
            <MediaUploader
              type="audio"
              currentUrl={formData.audio_url}
              onUpload={(url) => setFormData(prev => ({ ...prev, audio_url: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, audio_url: '' }))}
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Profile Avatar
            </h3>
            <MediaUploader
              type="avatar"
              currentUrl={formData.avatar_url}
              onUpload={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              Custom Cursor
            </h3>
            <MediaUploader
              type="cursor"
              currentUrl={formData.custom_cursor_url}
              onUpload={(url) => setFormData(prev => ({ ...prev, custom_cursor_url: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, custom_cursor_url: '' }))}
            />
          </div>
        </div>
      </div>

      {/* Premium Banner */}
      <div className="glass rounded-xl p-6 bg-gradient-to-r from-purple-900/20 to-purple-700/20 border border-purple-500/30">
        <div className="flex items-center justify-center gap-3 text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">Want exclusive features? Unlock more with Premium</span>
        </div>
      </div>

      {/* General Customization */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          General Customization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Description */}
          <div className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30">
            <Label className="text-white mb-3 block font-medium">Profile Description</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="marketing director & designer"
              className="bg-smoke-800 border-smoke-600 text-white resize-none focus:border-purple-500 transition-colors"
              rows={3}
            />
          </div>

          {/* Discord Presence */}
          <div className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30">
            <Label className="text-white mb-3 block font-medium">Discord Presence</Label>
            <Select defaultValue="disabled">
              <SelectTrigger className="bg-smoke-800 border-smoke-600 text-white focus:border-purple-500 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-smoke-900 border-smoke-700">
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Profile Opacity */}
          <div className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-white font-medium">Profile Opacity</Label>
              <span className="text-sm text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">{customizationSettings.profileOpacity}%</span>
            </div>
            <Slider
              value={[customizationSettings.profileOpacity]}
              onValueChange={(value) => handleCustomizationChange('profileOpacity', value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Profile Blur */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-gray-300">Profile Blur</Label>
              <span className="text-sm text-gray-400">{customizationSettings.profileBlur}px</span>
            </div>
            <Slider
              value={[customizationSettings.profileBlur]}
              onValueChange={(value) => handleCustomizationChange('profileBlur', value[0])}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Background Effects */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Background Effects</Label>
            <Select 
              value={customizationSettings.backgroundEffect}
              onValueChange={(value) => handleCustomizationChange('backgroundEffect', value)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
                <SelectItem value="particles">Particles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Username Effects */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Username Effects</Label>
            <Select 
              value={customizationSettings.usernameEffect}
              onValueChange={(value) => handleCustomizationChange('usernameEffect', value)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Choose Username Effects</SelectItem>
                <SelectItem value="glow">Glow</SelectItem>
                <SelectItem value="shadow">Shadow</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              value={customizationSettings.location}
              onChange={(e) => handleCustomizationChange('location', e.target.value)}
              placeholder="İstanbul"
              className="bg-gray-900 border-gray-600 text-white"
            />
          </div>

          {/* Glow Settings */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Glow Settings</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Username
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                Socials
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                Badges
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Customization */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
          Color Customization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Accent Color */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customizationSettings.accentColor}
                onChange={(e) => handleCustomizationChange('accentColor', e.target.value)}
                className="w-8 h-8 rounded border border-gray-600"
              />
              <Input
                value={customizationSettings.accentColor}
                onChange={(e) => handleCustomizationChange('accentColor', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customizationSettings.textColor}
                onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                className="w-8 h-8 rounded border border-gray-600"
              />
              <Input
                value={customizationSettings.textColor}
                onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customizationSettings.backgroundColor}
                onChange={(e) => handleCustomizationChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded border border-gray-600"
              />
              <Input
                value={customizationSettings.backgroundColor}
                onChange={(e) => handleCustomizationChange('backgroundColor', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Icon Color */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Label className="text-gray-300 mb-2 block">Icon Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customizationSettings.iconColor}
                onChange={(e) => handleCustomizationChange('iconColor', e.target.value)}
                className="w-8 h-8 rounded border border-gray-600"
              />
              <Input
                value={customizationSettings.iconColor}
                onChange={(e) => handleCustomizationChange('iconColor', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Enable Profile Gradient */}
        <div className="mt-6">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            onClick={() => handleCustomizationChange('enableGradient', !customizationSettings.enableGradient)}
          >
            Enable Profile Gradient
          </Button>
        </div>
      </div>

      {/* Other Customization */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Other Customization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Monochrome Icons */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Monochrome Icons</Label>
              <Switch
                checked={customizationSettings.monochromeIcons}
                onCheckedChange={(checked) => handleCustomizationChange('monochromeIcons', checked)}
              />
            </div>
          </div>

          {/* Animated Title */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Animated Title</Label>
              <Switch
                checked={customizationSettings.animatedTitle}
                onCheckedChange={(checked) => handleCustomizationChange('animatedTitle', checked)}
              />
            </div>
          </div>

          {/* Swap Box Colors */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Swap Box Colors</Label>
              <Switch defaultChecked={false} />
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Volume Control</Label>
              <Switch
                checked={customizationSettings.volumeControl}
                onCheckedChange={(checked) => handleCustomizationChange('volumeControl', checked)}
              />
            </div>
          </div>

          {/* Use Discord Avatar */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Use Discord Avatar</Label>
              <Switch defaultChecked={false} />
            </div>
          </div>

          {/* Discord Avatar Decoration */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Discord Avatar Decoration</Label>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-3 text-lg font-semibold rounded-xl shadow-lg hover-lift disabled:opacity-50"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Kaydediliyor...
            </div>
          ) : (
            'Değişiklikleri Kaydet'
          )}
        </Button>
      </div>
    </div>
  );
}
