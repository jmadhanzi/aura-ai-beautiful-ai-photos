import { motion } from 'framer-motion';

const meshPoints = [
  // Jawline
  { x: 15, y: 90 }, { x: 22, y: 120 }, { x: 38, y: 148 }, { x: 60, y: 160 },
  { x: 80, y: 163 }, { x: 102, y: 160 }, { x: 118, y: 148 }, { x: 128, y: 120 }, { x: 125, y: 90 },
  // Cheekbones
  { x: 18, y: 75 }, { x: 122, y: 75 },
  // Nose bridge points
  { x: 65, y: 65 }, { x: 75, y: 65 }, { x: 70, y: 95 }, { x: 62, y: 110 }, { x: 78, y: 110 },
  // Outer eyes
  { x: 30, y: 68 }, { x: 62, y: 58 }, { x: 78, y: 58 }, { x: 110, y: 68 },
  // Forehead
  { x: 40, y: 35 }, { x: 70, y: 22 }, { x: 100, y: 35 },
];

const FaceCanvas = () => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 260 }}>
      {/* Outer glow halo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220, height: 260,
          background: 'radial-gradient(ellipse, rgba(200,164,90,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Face oval */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 190,
          height: 240,
          borderRadius: '50%',
          background: 'var(--face-canvas-bg)',
          border: '1px solid rgba(200,164,90,0.18)',
          boxShadow: 'var(--face-canvas-shadow)',
        }}
      >
        {/* SVG Face mesh */}
        <svg width="140" height="180" viewBox="0 0 140 180" fill="none" style={{ position: 'absolute' }}>
          {/* Face oval */}
          <ellipse cx="70" cy="90" rx="54" ry="70" stroke="rgba(200,164,90,0.28)" strokeWidth="0.8" />

          {/* Symmetry axis */}
          <line x1="70" y1="18" x2="70" y2="166" stroke="rgba(200,164,90,0.08)" strokeWidth="0.5" strokeDasharray="3,4" />

          {/* Left eye */}
          <ellipse cx="46" cy="73" rx="11" ry="7" stroke="rgba(200,164,90,0.38)" strokeWidth="0.8" />
          <ellipse cx="46" cy="73" rx="4.5" ry="4" fill="rgba(200,164,90,0.22)" stroke="rgba(200,164,90,0.35)" strokeWidth="0.6" />
          <circle cx="44" cy="71.5" r="1.4" fill="rgba(255,255,255,0.65)" />
          {/* Left brow */}
          <path d="M33 63 Q46 56 59 63" stroke="rgba(200,164,90,0.3)" strokeWidth="0.9" fill="none" />

          {/* Right eye */}
          <ellipse cx="94" cy="73" rx="11" ry="7" stroke="rgba(200,164,90,0.38)" strokeWidth="0.8" />
          <ellipse cx="94" cy="73" rx="4.5" ry="4" fill="rgba(200,164,90,0.22)" stroke="rgba(200,164,90,0.35)" strokeWidth="0.6" />
          <circle cx="92" cy="71.5" r="1.4" fill="rgba(255,255,255,0.65)" />
          {/* Right brow */}
          <path d="M81 63 Q94 56 107 63" stroke="rgba(200,164,90,0.3)" strokeWidth="0.9" fill="none" />

          {/* Nose bridge */}
          <path d="M65 80 L64 98 Q70 104 76 98 L75 80" stroke="rgba(200,164,90,0.22)" strokeWidth="0.7" fill="none" />
          <path d="M60 102 Q64 106 70 104 Q76 106 80 102" stroke="rgba(200,164,90,0.3)" strokeWidth="0.7" fill="none" />

          {/* Lips */}
          <path d="M54 120 Q62 114 70 117 Q78 114 86 120" stroke="rgba(200,164,90,0.38)" strokeWidth="0.9" fill="none" />
          <path d="M54 120 Q62 130 70 127 Q78 130 86 120" stroke="rgba(200,164,90,0.28)" strokeWidth="0.7" fill="none" />
          <path d="M60 120 Q70 122 80 120" stroke="rgba(200,164,90,0.2)" strokeWidth="0.5" fill="none" />

          {/* Mesh points */}
          {meshPoints.map((pt, i) => (
            <motion.circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="1.2"
              fill="rgba(200,164,90,0.5)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' }}
            />
          ))}

          {/* 4 Cardinal markers */}
          <circle cx="70" cy="14" r="2.5" fill="var(--teal)" opacity="0.6" />
          <circle cx="70" cy="166" r="2.5" fill="var(--teal)" opacity="0.6" />
          <circle cx="14" cy="90" r="2.5" fill="var(--teal)" opacity="0.6" />
          <circle cx="126" cy="90" r="2.5" fill="var(--teal)" opacity="0.6" />

          {/* AI detection boxes around eyes */}
          <rect x="31" y="64" width="30" height="18" rx="2" stroke="rgba(0,201,173,0.25)" strokeWidth="0.6" fill="none" strokeDasharray="2,2" />
          <rect x="79" y="64" width="30" height="18" rx="2" stroke="rgba(0,201,173,0.25)" strokeWidth="0.6" fill="none" strokeDasharray="2,2" />
        </svg>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,201,173,0.9), transparent)',
            boxShadow: '0 0 10px rgba(0,201,173,0.6), 0 0 20px rgba(0,201,173,0.3)',
          }}
          animate={{ top: ['8%', '92%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Corner detection markers */}
        {[
          { top: 8, left: 8 }, { top: 8, right: 8 },
          { bottom: 8, left: 8 }, { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 pointer-events-none"
            style={pos}
          >
            <div className="absolute top-0 left-0 w-3 h-px bg-teal opacity-60" />
            <div className="absolute top-0 left-0 w-px h-3 bg-teal opacity-60" />
          </div>
        ))}
      </div>

      {/* Floating badges */}
      <FloatBadge label="✦ AI Enhanced" style={{ top: -8, right: -60 }} delay={0.5} />
      <FloatBadge label="68 landmarks" style={{ bottom: 16, left: -54 }} delay={0.9} />
      <FloatBadge label="🔒 On-device" style={{ top: '42%', right: -58 }} delay={1.2} />
    </div>
  );
};

const FloatBadge = ({ label, style, delay }: { label: string; style: React.CSSProperties; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
    transition={{
      opacity: { delay, duration: 0.4 },
      scale: { delay, duration: 0.4 },
      y: { delay: delay + 0.5, duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
    }}
    className="absolute whitespace-nowrap rounded-full font-body"
    style={{
      ...style,
      fontSize: 10,
      fontWeight: 500,
      padding: '5px 10px',
      color: 'var(--gold)',
      border: '1px solid var(--badge-border)',
      background: 'var(--badge-bg)',
      backdropFilter: 'blur(12px)',
    }}
  >
    {label}
  </motion.div>
);

export default FaceCanvas;
