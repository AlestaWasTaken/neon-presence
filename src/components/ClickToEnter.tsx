import { useState } from 'react';
import { Button } from '@/components/ui/button';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';

interface ClickToEnterProps {
  onEnter: () => void;
}

export default function ClickToEnter({ onEnter }: ClickToEnterProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <OptimizedVideoBackground />
      
      <div className="relative z-10 text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
            <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
              alesta
            </span>
          </h1>
          <p className="text-smoke-400 text-lg font-light tracking-wide">
            designer & marketing director
          </p>
        </div>

        <div className="w-12 h-px bg-smoke-600 mx-auto" />

        <Button
          onClick={onEnter}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          size="lg"
          className={`glass hover-lift text-smoke-200 hover:text-smoke-100 border-smoke-600/30 hover:bg-smoke-700/50 px-8 py-4 text-lg font-light tracking-wider transition-all duration-300 ${
            isHovered ? 'shadow-lg shadow-primary/20' : ''
          }`}
        >
          click to enter
        </Button>

        <div className="text-center">
          <p className="text-xs text-smoke-500 font-mono">
            welcome to the hideout
          </p>
        </div>
      </div>
    </div>
  );
}