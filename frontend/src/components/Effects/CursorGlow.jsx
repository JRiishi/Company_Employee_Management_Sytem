// ✨ CursorGlow.jsx
// Soft radial glow following cursor. Pure rAF + CSS vars — zero React re-renders.
// Zero business logic — pure visual effect layer.

import { useEffect, useRef } from 'react';

export default function CursorGlow({ role = 'employee' }) {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let rafId;

    const getRoleColor = () => {
      switch(role) {
        case 'admin':    return 'rgba(99, 102, 241, 0.13)';   // indigo
        case 'manager':  return 'rgba(59, 130, 246, 0.13)';   // blue
        case 'hr':       return 'rgba(168, 85, 247, 0.12)';   // purple
        default:         return 'rgba(34, 197, 94, 0.10)';    // emerald
      }
    };

    const getRoleGradient = () => {
      switch(role) {
        case 'admin':    return 'rgba(99,102,241,0.12)';
        case 'manager':  return 'rgba(59,130,246,0.12)';
        case 'hr':       return 'rgba(168,85,247,0.11)';
        default:         return 'rgba(34,197,94,0.09)';
      }
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      // Smooth lerp — glow follows with elegant lag
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      el.style.left = `${currentX}px`;
      el.style.top  = `${currentY}px`;

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [role]);

  return (
    <div
      ref={glowRef}
      style={{
        position:       'fixed',
        width:          '600px',
        height:         '600px',
        borderRadius:   '50%',
        pointerEvents:  'none',
        zIndex:         1,
        transform:      'translate(-50%, -50%)',
        background:     `radial-gradient(circle, ${
          role === 'admin'    ? 'rgba(99,102,241,0.12)'  :
          role === 'manager'  ? 'rgba(59,130,246,0.12)'  :
          role === 'hr'       ? 'rgba(168,85,247,0.11)'  :
                                'rgba(34,197,94,0.09)'
        } 0%, transparent 70%)`,
        willChange:     'left, top',
        mixBlendMode:   'screen',
      }}
    />
  );
}
