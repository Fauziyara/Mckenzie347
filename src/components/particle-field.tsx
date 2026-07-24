"use client";

import { useEffect, useRef } from "react";

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    // Mostly white with few emerald + orange accents — like distant stars
    const colors = [
      { r: 255, g: 255, b: 255 },    // white (dominant)
      { r: 255, g: 255, b: 255 },    // white
      { r: 255, g: 255, b: 255 },    // white
      { r: 16, g: 185, b: 129 },     // emerald (rare)
      { r: 249, g: 115, b: 22 },     // orange (rare)
    ];

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: { r: number; g: number; b: number };
      opacity: number;
    };

    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const count = 20;
      for (let i = 0; i < count; i++) {
        const colorIdx = Math.floor(Math.random() * colors.length);
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: Math.random() * 3 + 1,
          color: colors[colorIdx],
          opacity: 1,
        });
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 4;
          p.vy = (Math.random() - 0.5) * 4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const c = p.color;
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, 0.6)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
