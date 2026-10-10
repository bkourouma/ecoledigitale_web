'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  t: number;
}

interface Blot {
  x: number;
  y: number;
  t: number;
  r: number;
  ink: string;
}

const TRAIL_MS = 650;
const BLOT_MS = 1400;
const PAPER_INK = '31, 45, 122';
const CHALK_INK = '244, 242, 234';

/**
 * La plume laisse une traînée d'encre qui sèche vite, et une tache à chaque clic.
 * Posée au-dessus de la page, invisible aux clics. Désactivée au tactile et
 * pour les personnes qui préfèrent moins d'animation.
 */
export function InkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const points: Point[] = [];
    const blots: Blot[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const inkAt = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      return el?.closest('.board, .cover') ? CHALK_INK : PAPER_INK;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      while (points.length && now - points[0].t > TRAIL_MS) points.shift();
      while (blots.length && now - blots[0].t > BLOT_MS) blots.shift();

      if (points.length > 1) {
        const ink = inkAt(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1];
          const b = points[i];
          const life = 1 - (now - b.t) / TRAIL_MS;
          const speed = Math.hypot(b.x - a.x, b.y - a.y);
          ctx.strokeStyle = `rgba(${ink}, ${(0.55 * life).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.8, Math.min(3.2, 3.4 - speed * 0.08)) * life + 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const blot of blots) {
        const life = 1 - (now - blot.t) / BLOT_MS;
        const grow = Math.min(1, (now - blot.t) / 140);
        ctx.fillStyle = `rgba(${blot.ink}, ${(0.5 * life).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(blot.x, blot.y, blot.r * (0.4 + 0.6 * grow), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(blot.x + blot.r * 0.9, blot.y - blot.r * 0.5, blot.r * 0.28 * grow, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = points.length || blots.length ? requestAnimationFrame(draw) : 0;
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      points.push({ x: event.clientX, y: event.clientY, t: performance.now() });
      if (points.length > 60) points.shift();
      kick();
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      blots.push({
        x: event.clientX,
        y: event.clientY,
        t: performance.now(),
        r: 5 + Math.random() * 3,
        ink: inkAt(event.clientX, event.clientY),
      });
      kick();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
