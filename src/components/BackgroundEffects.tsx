import React, { useEffect, useRef } from 'react';

interface BackgroundEffectsProps {
  effect: 'none' | 'rain' | 'snow' | 'particles';
}

export function BackgroundEffects({ effect }: BackgroundEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (effect === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles: any[] = [];

    // Initialize particles based on effect
    const initParticles = () => {
      particles = [];
      const particleCount = effect === 'particles' ? 50 : 100;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: effect === 'snow' ? Math.random() * 2 + 1 : Math.random() * 5 + 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reset particles that go off screen
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x > canvas.width) {
          particle.x = 0;
        }
        if (particle.x < 0) {
          particle.x = canvas.width;
        }

        // Draw based on effect type
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        if (effect === 'rain') {
          ctx.strokeStyle = '#4FC3F7';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
          ctx.stroke();
        } else if (effect === 'snow') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'particles') {
          ctx.fillStyle = '#00ff9f';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effect]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}