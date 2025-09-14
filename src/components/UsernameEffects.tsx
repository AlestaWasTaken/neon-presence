import React from 'react';

interface UsernameEffectsProps {
  username: string;
  effect: 'none' | 'glow' | 'shadow' | 'neon';
  className?: string;
}

export function UsernameEffects({ username, effect, className = '' }: UsernameEffectsProps) {
  const getEffectClasses = () => {
    switch (effect) {
      case 'glow':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_15px_rgba(0,255,159,0.5)]';
      case 'shadow':
        return 'text-smoke-100 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]';
      case 'neon':
        return 'text-primary animate-pulse drop-shadow-[0_0_10px_currentColor] font-bold';
      default:
        return 'text-smoke-100';
    }
  };

  return (
    <h1 className={`text-2xl md:text-4xl font-black ${getEffectClasses()} ${className}`}>
      {username}
    </h1>
  );
}