import { useState, useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    const setVisibility = (visible) => {
      isVisibleRef.current = visible;
      const opacity = visible ? '1' : '0';
      if (dotRef.current) dotRef.current.style.opacity = opacity;
      if (ringRef.current) ringRef.current.style.opacity = opacity;
    };

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (!isVisibleRef.current) {
        setVisibility(true);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.clickable') ||
          target.classList?.contains('clickable'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setVisibility(false);
    };

    // Smooth Lerp loop for the gold aura ring
    const render = () => {
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Outer Lagging Golden Halo Ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovered ? 'hovered' : ''}`}
        style={{ opacity: 0 }}
      />
      {/* Crisp Immediate Golden Star Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovered ? 'hovered' : ''}`}
        style={{ opacity: 0 }}
      />
    </>
  );
}
