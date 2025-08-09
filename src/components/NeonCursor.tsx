import { useEffect, useState } from 'react';

const NeonCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[10000] w-3 h-3 bg-primary rounded-full"
      style={{
        left: position.x - 6,
        top: position.y - 6,
        boxShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary))',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        mixBlendMode: 'difference'
      }}
    />
  );
};

export default NeonCursor;