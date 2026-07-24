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

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      opacity: number;
      opacityDir: number;
      opacitySpeed: number;
    };

    const colors = [
      "rgba(107, 159, 255, ",  // soft blue
      "rgba(155, 127, 239, ",  // purple/violet
      "rgba(255, 154, 60, ",   // orange/amber
      "rgba(255, 255, 255, ",   // white
      "rgba(94, 234, 181, ",   // emerald (Aperture touch)
    ];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas!.width * canvas!.height) / 8000), 150);
      for (let i = 0; i < count; i++) {
        const colorIdx = Math.floor(Math.random() * colors.length);
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: Math.random() * 2 + 0.5,
          color: colors[colorIdx],
          opacity: Math.random() * 0.6 + 0.2,
          opacityDir: Math.random() > 0.5 ? 1 : -1,
          opacitySpeed: Math.random() * 0.008 + 0.002,
        });
      }
    }

    function animate() {
      if (!ctx) return;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        // Twinkle effect
        p.opacity += p.opacityDir * p.opacitySpeed;
        if (p.opacity >= 0.8) {
          p.opacity = 0.8;
          p.opacityDir = -1;
        }
        if (p.opacity <= 0.15) {
          p.opacity = 0.15;
          p.opacityDir = 1;
        }

        // Draw with glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = p.color + p.opacity + ")";

        // Add glow for larger particles
        if (p.radius > 1.5) {
          ctx!.shadowBlur = 6;
          ctx!.shadowColor = p.color + (p.opacity * 0.8) + ")";
        } else {
          ctx!.shadowBlur = 0;
        }

        ctx!.fill();
      }
      ctx!.shadowBlur = 0;

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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
