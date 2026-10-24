import React, { useMemo } from 'react';
import './FloatingParticles.css';

export default function FloatingParticles({ count = 25 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed1 = ((i * 9301 + 49297) % 233280) / 233280;
      const seed2 = (((i + 7) * 9301 + 49297) % 233280) / 233280;
      const seed3 = (((i + 13) * 9301 + 49297) % 233280) / 233280;
      const seed4 = (((i + 19) * 9301 + 49297) % 233280) / 233280;
      return {
        id: i,
        x: seed1 * 100,
        y: seed2 * 100,
        size: seed3 * 4 + 2,
        duration: seed4 * 12 + 8,
        delay: seed1 * 6,
        opacity: seed2 * 0.4 + 0.1,
        isGold: seed3 > 0.4,
      };
    });
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
