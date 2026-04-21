// 🌈 RoleGradientOverlay.jsx
// Role-specific gradient overlays — fixed layer above canvas, below glass UI.
// Creates aurora/nebula glow unique to each user role.
// Zero business logic — pure visual layer.

export default function RoleGradientOverlay({ role = 'employee' }) {
  const gradients = {
    admin: `
      radial-gradient(ellipse 70% 45% at 15% 10%, rgba(99,102,241,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 55% 40% at 85% 90%, rgba(139,92,246,0.14) 0%, transparent 70%),
      radial-gradient(ellipse 40% 35% at 70% 20%, rgba(99,102,241,0.08) 0%, transparent 60%)
    `,
    manager: `
      radial-gradient(ellipse 70% 45% at 15% 10%, rgba(59,130,246,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 55% 40% at 85% 90%, rgba(14,165,233,0.14) 0%, transparent 70%),
      radial-gradient(ellipse 40% 35% at 60% 30%, rgba(99,179,237,0.08) 0%, transparent 60%)
    `,
    employee: `
      radial-gradient(ellipse 70% 45% at 15% 10%, rgba(34,197,94,0.15) 0%, transparent 70%),
      radial-gradient(ellipse 55% 40% at 85% 90%, rgba(16,185,129,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 35% at 55% 25%, rgba(52,211,153,0.07) 0%, transparent 60%)
    `,
    hr: `
      radial-gradient(ellipse 70% 45% at 15% 10%, rgba(168,85,247,0.17) 0%, transparent 70%),
      radial-gradient(ellipse 55% 40% at 85% 90%, rgba(192,132,252,0.13) 0%, transparent 70%),
      radial-gradient(ellipse 40% 35% at 65% 20%, rgba(168,85,247,0.07) 0%, transparent 60%)
    `,
  };

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        1,
        pointerEvents: 'none',
        background:    gradients[role] || gradients.employee,
        transition:    'background 1.2s ease',
      }}
    />
  );
}
