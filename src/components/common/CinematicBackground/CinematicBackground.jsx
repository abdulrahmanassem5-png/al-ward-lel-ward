import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CinematicBackground.css';

/**
 * Ultra-Luxury Cinematic Ken Burns Crossfade Background — Al-Ward Lel-Ward
 *
 * Choreography:
 * 1. 5000ms scene duration + 2000ms smooth crossfade.
 * 2. 7000ms continuous 3D camera pan & zoom per scene.
 * 3. 4 Royal Scenes:
 *    - Scene 0: /images/bg-royal-palace-roses.jpg (Slow zoom-in + subtle elevation)
 *    - Scene 1: /images/bg-royal-macro-petals.jpg (Pullback + horizontal pan)
 *    - Scene 2: /images/vision-philosophy.jpg (Smooth diagonal zoom)
 *    - Scene 3: /images/royal-craftsmanship.jpg (Central slow push-in)
 * 4. Radial Vignette + Vertical Gradient + Floating Golden Dust Particles.
 * 5. Instant Preloading + prefers-reduced-motion accessibility.
 */

const SCENES = [
  {
    id: 'palace-roses',
    src: '/images/bg-royal-palace-roses.jpg',
    alt: 'Royal Palace Architecture & Crimson Ecuadorian Roses',
    sceneClass: 'kenburns-scene-0',
  },
  {
    id: 'macro-petals',
    src: '/images/bg-royal-macro-petals.jpg',
    alt: 'Macro Velvet Rose Petals with 24k Gold Foil Leaf',
    sceneClass: 'kenburns-scene-1',
  },
  {
    id: 'vision-philosophy',
    src: '/images/vision-philosophy.jpg',
    alt: 'Royal Floral Atelier & Crimson Rose Bouquet Crafting',
    sceneClass: 'kenburns-scene-2',
  },
  {
    id: 'royal-craftsmanship',
    src: '/images/royal-craftsmanship.jpg',
    alt: 'Haute Floristry Peonies, Pearl Trims and French Tulle Collar',
    sceneClass: 'kenburns-scene-3',
  },
];

const SCENE_DURATION = 5000;
const CROSSFADE_DURATION = 2000;

// 24 lightweight floating golden dust particles
const DUST_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${((i * 17) % 94) + 3}%`,
  top: `${((i * 23) % 90) + 5}%`,
  size: `${(i % 3) * 1.5 + 2}px`,
  duration: `${7 + (i % 5) * 1.5}s`,
  delay: `${(i * 0.35) % 4}s`,
  drift: `${(i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 8)}px`,
  maxOpacity: 0.35 + (i % 4) * 0.15,
}));

export default function CinematicBackground({
  petalCount = 20,
  interactive = true,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 });

  // 1. Accessibility: Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // 2. Performance: Preload all 4 scene images immediately
  useEffect(() => {
    SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.src;
    });
  }, []);

  // 3. Ken Burns Crossfade Timer Engine (5000ms duration, 2000ms crossfade)
  useEffect(() => {
    if (prefersReducedMotion) return;

    let exitTimeoutId = null;

    const intervalId = setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);

        if (exitTimeoutId) clearTimeout(exitTimeoutId);
        exitTimeoutId = setTimeout(() => {
          setPrevIndex(null);
        }, CROSSFADE_DURATION);

        return (current + 1) % SCENES.length;
      });
    }, SCENE_DURATION);

    return () => {
      clearInterval(intervalId);
      if (exitTimeoutId) clearTimeout(exitTimeoutId);
    };
  }, [prefersReducedMotion]);

  // 4. Interactive pointer listener
  const handlePointerMove = useCallback((clientX, clientY) => {
    if (!interactive) return;
    const m = mouseRef.current;
    m.vx = clientX - (m.lastX === -1000 ? clientX : m.lastX);
    m.vy = clientY - (m.lastY === -1000 ? clientY : m.lastY);
    m.x = clientX;
    m.y = clientY;
    m.lastX = clientX;
    m.lastY = clientY;
  }, [interactive]);

  useEffect(() => {
    const onMouseMove = (e) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onPointerLeave = () => {
      const m = mouseRef.current;
      m.x = -1000;
      m.y = -1000;
      m.lastX = -1000;
      m.lastY = -1000;
      m.vx = 0;
      m.vy = 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onPointerLeave);
    };
  }, [handlePointerMove]);

  // 5. Lightweight Canvas Petal Simulation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Petal {
      constructor(randomizeY = false) {
        this.reset(randomizeY);
      }

      reset(randomizeY = false) {
        this.x = Math.random() * width;
        this.y = randomizeY ? Math.random() * height : -30;
        this.size = Math.random() * 9 + 6;
        this.speedY = Math.random() * 0.45 + 0.25;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.35 + 0.15;
        this.curl = Math.random() * 0.4 + 0.6;
      }

      update(mx, my, mvx, mvy) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.008) * 0.3;
        this.rotation += this.rotationSpeed;

        if (mx > -500) {
          const dx = this.x - mx;
          const dy = this.y - my;
          const distSq = dx * dx + dy * dy;
          const radius = 120;
          if (distSq < radius * radius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 1.5;
            this.x += (dx / dist) * force * 2 + mvx * 0.05;
            this.y += (dy / dist) * force * 2 + mvy * 0.05;
          }
        }

        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate((this.rotation * Math.PI) / 180);
        context.scale(1, this.curl);
        context.globalAlpha = this.opacity;

        context.beginPath();
        context.moveTo(0, -this.size * 1.1);
        context.bezierCurveTo(
          this.size * 0.8, -this.size * 0.6,
          this.size * 0.7, this.size * 0.6,
          0, this.size * 1.1
        );
        context.bezierCurveTo(
          -this.size * 0.7, this.size * 0.6,
          -this.size * 0.8, -this.size * 0.6,
          0, -this.size * 1.1
        );

        const grad = context.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, '#7A1224');
        grad.addColorStop(0.5, '#4A0814');
        grad.addColorStop(1, '#240409');
        context.fillStyle = grad;
        context.fill();

        context.restore();
      }
    }

    const petals = Array.from({ length: petalCount }, () => new Petal(true));
    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      const m = mouseRef.current;
      for (let i = 0; i < petals.length; i++) {
        petals[i].update(m.x, m.y, m.vx, m.vy);
        petals[i].draw(ctx);
      }

      m.vx *= 0.88;
      m.vy *= 0.88;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      } else {
        if (!isRunning) {
          isRunning = true;
          animFrameIdRef.current = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [petalCount, prefersReducedMotion]);

  return (
    <aside className="cinematic-bg-root" aria-hidden="true">
      {/* ── Layer 1: 4-Scene Ken Burns Crossfade Sequence ── */}
      <div className="cinematic-scenes-container">
        {SCENES.map((scene, idx) => {
          const isActive = idx === activeIndex;
          const isExiting = idx === prevIndex;
          const isAnimating = isActive || isExiting;

          return (
            <div
              key={scene.id}
              className={`cinematic-scene-layer ${isActive ? 'is-active' : ''} ${
                isExiting ? 'is-exiting' : ''
              }`}
            >
              <img
                src={scene.src}
                alt={scene.alt}
                className={`cinematic-scene-img ${scene.sceneClass} ${
                  isAnimating ? 'is-animating' : ''
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          );
        })}
      </div>

      {/* ── Layer 2: Floating Golden Dust Particles ── */}
      {!prefersReducedMotion && (
        <div className="golden-dust-container">
          {DUST_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="golden-dust-particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                '--duration': p.duration,
                '--delay': p.delay,
                '--drift': p.drift,
                '--max-opacity': p.maxOpacity,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Layer 3: Interactive Petal Canvas Simulation ── */}
      {!prefersReducedMotion && (
        <canvas ref={canvasRef} className="cinematic-petal-canvas" />
      )}

      {/* ── Layer 4: Cinematic Radial Vignette ── */}
      <div className="cinematic-vignette-layer" />

      {/* ── Layer 5: Vertical Seamless Header & Footer Blend Gradient ── */}
      <div className="cinematic-vertical-blend-layer" />

      {/* ── Layer 6: Film Grain Organic Noise Texture ── */}
      <div className="cinematic-grain-overlay" />
    </aside>
  );
}
