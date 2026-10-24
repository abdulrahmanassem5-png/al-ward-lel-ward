import { useRef, useEffect } from 'react';
import './TiltCard.css';

export default function TiltCard({ children, className = '', maxTilt = 8, glare = true }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rAFRef = useRef(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    // Detect touch / non-hover screens
    if (typeof window !== 'undefined') {
      isTouchRef.current = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    }
    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchRef.current || !cardRef.current) return;

    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);

    const clientX = e.clientX;
    const clientY = e.clientY;

    rAFRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
      cardRef.current.style.transition = 'transform 0.08s ease-out';

      if (glare && glareRef.current) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.opacity = '0.35';
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212, 168, 83, 0.45) 0%, rgba(212, 168, 83, 0.08) 50%, transparent 80%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current || !cardRef.current) return;

    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);

    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    cardRef.current.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0';
      glareRef.current.style.transition = 'opacity 0.45s ease';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && <div ref={glareRef} className="tilt-card-glare" style={{ opacity: 0 }} />}
    </div>
  );
}
