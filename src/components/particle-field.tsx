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

    // Exact Intellio colors: green #37B884, orange #EB7043, purple #6766FF
    const colors = [
      { r: 55, g: 184, b: 132 },   // #37B884 green
      { r: 235, g: 112, b: 67 },   // #EB7043 orange
      { r: 103, g: 102, b: 255 },  // #6766FF purple
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
      // Intellio uses 38 particles
      const count = 38;
      for (let i = 0; i < count; i++) {
        const colorIdx = Math.floor(Math.random() * colors.length);
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          // Intellio: speed 2, random direction
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          // Intellio: size 3, random
          radius: Math.random() * 3 + 1,
          color: colors[colorIdx],
          // Intellio: opacity 1 (no twinkle)
          opacity: 1,
        });
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Move — Intellio speed 2, random direction, straight false
        p.x += p.vx;
        p.y += p.vy;

        // Intellio: out_mode 'out' — particles disappear and reappear
        if (p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 4;
          p.vy = (Math.random() - 0.5) * 4;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const c = p.color;
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.opacity})`;

        // Glow effect
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
