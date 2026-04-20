// 🌌 UniverseBackground.jsx
// Fixed canvas rendering interactive starfield with nebulas and shooting stars.
// Zero business logic — pure visual layer. pointer-events: none ensures no interaction blocking.

import { useEffect, useRef } from 'react';

export default function UniverseBackground({ role = 'employee' }) {
  const canvasRef = useRef(null);

  // Role → nebula color palette
  const ROLE_COLORS = {
    admin:    { r: 99,  g: 102, b: 241 }, // indigo
    manager:  { r: 59,  g: 130, b: 246 }, // blue
    employee: { r: 34,  g: 197, b: 94  }, // emerald
    hr:       { r: 168, g: 85,  b: 247 }, // purple
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    // ─── RESIZE ──────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const C = ROLE_COLORS[role] || ROLE_COLORS.employee;

    // ─── STARS ───────────────────────────────────────────────
    const NUM_STARS = window.innerWidth < 768 ? 150 : 320;
    const stars = Array.from({ length: NUM_STARS }, () => ({
      x:         Math.random() * canvas.width,
      y:         Math.random() * canvas.height,
      radius:    Math.random() * 1.4 + 0.2,
      opacity:   Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      depth:     Math.random(),
    }));

    // ─── SHOOTING STARS ──────────────────────────────────────
    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height * 0.5,
        len:     Math.random() * 120 + 60,
        speed:   Math.random() * 8 + 5,
        opacity: 1,
        angle:   Math.PI / 5 + (Math.random() * 0.3 - 0.15),
      });
    };

    let lastShoot = 0;
    let nextShootInterval = 2500 + Math.random() * 2500;

    // ─── NEBULA CLOUDS ───────────────────────────────────────
    const nebulas = [
      { x: 0.15, y: 0.2,  r: 0.35, opacity: 0.045, color: [C.r, C.g, C.b] },
      { x: 0.85, y: 0.75, r: 0.40, opacity: 0.040, color: [C.r, C.g, C.b] },
      { x: 0.50, y: 0.55, r: 0.30, opacity: 0.030, color: [C.r, C.g, C.b] },
      { x: 0.75, y: 0.15, r: 0.25, opacity: 0.025, color: [180, 180, 255]  },
      { x: 0.20, y: 0.80, r: 0.28, opacity: 0.020, color: [120, 80, 200]   },
    ];

    // ─── PAUSE ON TAB HIDDEN ──────────────────────────────────
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        animFrame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // ─── DRAW ─────────────────────────────────────────────────
    const draw = (timestamp) => {
      const W = canvas.width;
      const H = canvas.height;

      // Clear with deep space color
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, W, H);

      // ── Nebula clouds ──
      nebulas.forEach(n => {
        const grd = ctx.createRadialGradient(
          n.x * W, n.y * H, 0,
          n.x * W, n.y * H, n.r * Math.max(W, H)
        );
        grd.addColorStop(0,   `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity})`);
        grd.addColorStop(0.5, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity * 0.4})`);
        grd.addColorStop(1,   `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      });

      // ── Mouse-influenced ambient glow ──
      const glowGrd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 420);
      glowGrd.addColorStop(0,   `rgba(${C.r},${C.g},${C.b},0.04)`);
      glowGrd.addColorStop(0.5, `rgba(${C.r},${C.g},${C.b},0.015)`);
      glowGrd.addColorStop(1,   `rgba(${C.r},${C.g},${C.b},0)`);
      ctx.fillStyle = glowGrd;
      ctx.fillRect(0, 0, W, H);

      // ── Twinkling stars with mouse parallax ──
      const parallaxStrength = 18;
      stars.forEach((star) => {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset));
        const px = star.x + ((mouse.x - W / 2) / W) * parallaxStrength * star.depth;
        const py = star.y + ((mouse.y - H / 2) / H) * parallaxStrength * star.depth;

        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);

        if (star.radius > 1.0) {
          const halo = ctx.createRadialGradient(px, py, 0, px, py, star.radius * 4);
          halo.addColorStop(0, `rgba(200,210,255,${twinkle * star.opacity * 0.8})`);
          halo.addColorStop(1, `rgba(200,210,255,0)`);
          ctx.fillStyle = halo;
          ctx.arc(px, py, star.radius * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        }

        ctx.fillStyle = `rgba(220, 225, 255, ${twinkle * star.opacity})`;
        ctx.fill();
      });

      // ── Shooting stars ──
      if (timestamp - lastShoot > nextShootInterval) {
        spawnShootingStar();
        lastShoot = timestamp;
        nextShootInterval = 2500 + Math.random() * 2500;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.012;

        if (s.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.7, `rgba(255,255,255,${s.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Vignette (darken corners) ──
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.95);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [role]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
        willChange: 'contents',
      }}
    />
  );
}
