import React, { useMemo } from 'react';
import './FloatingParticles.css';

export default function FloatingParticles({ count = 25 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.4 + 0.1,
      isGold: Math.random() > 0.4,
    }));
  }, [count]);

  return (
    <div className="floating-particles-container" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`floating-particle ${p.isGold ? 'gold' : 'rose'}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
