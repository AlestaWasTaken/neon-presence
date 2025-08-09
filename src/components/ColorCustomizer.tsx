import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Moon, Sun, Zap, Heart, Star, Circle } from 'lucide-react';

interface ColorCustomizerProps {
  onColorChange: (field: string, value: string) => void;
  currentColors?: {
    primary_color?: string;
    accent_color?: string;
    theme?: string;
  };
}

const colorPresets = [
  { name: 'Snow', icon: Circle, primary: '#ffffff', accent: '#f8fafc', bg: 'linear-gradient(135deg, #ffffff, #f8fafc)' },
  { name: 'Ocean', icon: Circle, primary: '#0ea5e9', accent: '#06b6d4', bg: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
  { name: 'Forest', icon: Circle, primary: '#22c55e', accent: '#16a34a', bg: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { name: 'Sunset', icon: Circle, primary: '#f59e0b', accent: '#ea580c', bg: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
  { name: 'Rose', icon: Heart, primary: '#ec4899', accent: '#f43f5e', bg: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { name: 'Purple', icon: Sparkles, primary: '#8b5cf6', accent: '#a855f7', bg: 'linear-gradient(135deg, #8b5cf6, #a855f7)' },
  { name: 'Electric', icon: Zap, primary: '#06b6d4', accent: '#8b5cf6', bg: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' },
  { name: 'Gold', icon: Star, primary: '#eab308', accent: '#f59e0b', bg: 'linear-gradient(135deg, #eab308, #f59e0b)' },
];

const themePresets = [
  { name: 'Dark', icon: Moon, value: 'dark' },
  { name: 'Light', icon: Sun, value: 'light' },
  { name: 'Auto', icon: Circle, value: 'system' },
];

export default function ColorCustomizer({ onColorChange, currentColors }: ColorCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (preset: any) => {
    setSelectedColor(preset.name);
    onColorChange('primary_color', preset.primary);
    onColorChange('accent_color', preset.accent);
  };

  const handleThemeSelect = (theme: any) => {
    onColorChange('theme', theme.value);
  };

  return (
    <Card className="glass border-smoke-700/30 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary animate-pulse" />
          Colors & Theme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        
        {/* Color Presets */}
        <div className="space-y-3">
          <h4 className="text-xs text-smoke-400 font-medium">Color Palette</h4>
          <div className="grid grid-cols-4 gap-2">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                onClick={() => handleColorSelect(preset)}
                variant="ghost"
                size="sm"
                className={`h-12 p-2 group/color relative overflow-hidden border border-smoke-700/30 hover:border-primary/50 transition-all ${
                  selectedColor === preset.name ? 'ring-2 ring-primary/50' : ''
                }`}
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover/color:opacity-30 transition-opacity"
                  style={{ background: preset.bg }}
                />
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <preset.icon className="w-4 h-4 text-smoke-300 group-hover/color:text-smoke-100 transition-colors" />
                  <span className="text-xs text-smoke-400 group-hover/color:text-smoke-200 transition-colors">{preset.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Theme Presets */}
        <div className="space-y-3">
          <h4 className="text-xs text-smoke-400 font-medium">Theme</h4>
          <div className="grid grid-cols-3 gap-2">
            {themePresets.map((theme) => (
              <Button
                key={theme.name}
                onClick={() => handleThemeSelect(theme)}
                variant="ghost"
                size="sm"
                className={`h-10 p-2 group/theme border border-smoke-700/30 hover:border-accent/50 transition-all ${
                  currentColors?.theme === theme.value ? 'ring-2 ring-accent/50' : ''
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <theme.icon className="w-3 h-3 text-smoke-300 group-hover/theme:text-smoke-100 transition-colors" />
                  <span className="text-xs text-smoke-400 group-hover/theme:text-smoke-200 transition-colors">{theme.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Selection Display */}
        {selectedColor && (
          <div className="p-3 bg-smoke-800/30 rounded-lg border border-smoke-700/30">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary/40 to-accent/40 border border-smoke-600/50"></div>
              <span className="text-xs text-smoke-300">Selected: {selectedColor}</span>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}