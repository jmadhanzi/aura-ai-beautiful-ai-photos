import { motion } from 'framer-motion';

const FaceCanvas = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Oval container */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 200,
          height: 240,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a1030, #12121F, #1a1030)',
          border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 0 60px rgba(201,168,76,0.12), 0 0 120px rgba(139,92,246,0.08)',
        }}
      >
        {/* SVG Face wireframe */}
        <svg width="140" height="180" viewBox="0 0 140 180" fill="none">
          <ellipse cx="70" cy="90" rx="55" ry="72" stroke="rgba(201,168,76,0.35)" strokeWidth="1" />
          <ellipse cx="48" cy="75" rx="10" ry="6" stroke="rgba(201,168,76,0.35)" strokeWidth="0.8" />
          <ellipse cx="48" cy="75" rx="4" ry="3.5" fill="rgba(201,168,76,0.25)" />
          <circle cx="46" cy="73" r="1.2" fill="rgba(255,255,255,0.6)" />
          <ellipse cx="92" cy="75" rx="10" ry="6" stroke="rgba(201,168,76,0.35)" strokeWidth="0.8" />
          <ellipse cx="92" cy="75" rx="4" ry="3.5" fill="rgba(201,168,76,0.25)" />
          <circle cx="90" cy="73" r="1.2" fill="rgba(255,255,255,0.6)" />
          <path d="M70 82 L66 100 L74 100" stroke="rgba(201,168,76,0.25)" strokeWidth="0.8" fill="none" />
          <path d="M55 115 Q63 108 70 112 Q77 108 85 115" stroke="rgba(201,168,76,0.35)" strokeWidth="0.8" fill="none" />
          <path d="M55 115 Q70 124 85 115" stroke="rgba(201,168,76,0.25)" strokeWidth="0.6" fill="none" />
          <circle cx="70" cy="16" r="3" fill="rgba(0,229,195,0.5)" />
          <circle cx="70" cy="164" r="3" fill="rgba(0,229,195,0.5)" />
          <circle cx="14" cy="90" r="3" fill="rgba(0,229,195,0.5)" />
          <circle cx="126" cy="90" r="3" fill="rgba(0,229,195,0.5)" />
        </svg>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,229,195,0.8), transparent)',
            boxShadow: '0 0 12px rgba(0,229,195,0.6)',
          }}
          animate={{ top: ['8%', '92%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating badges with float animation */}
      <Badge label="✨ AI Enhanced" className="-top-2 -right-16" delay={0.6} floatDelay={0} />
      <Badge label="📐 68 Points" className="-bottom-2 -left-14" delay={0.8} floatDelay={1} />
      <Badge label="🔒 Private" className="top-1/2 -right-16 -translate-y-1/2" delay={1.0} floatDelay={2} />
    </div>
  );
};

const Badge = ({ label, className, delay, floatDelay }: { label: string; className: string; delay: number; floatDelay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -4, 0],
    }}
    transition={{
      opacity: { delay, duration: 0.4 },
      scale: { delay, duration: 0.4 },
      y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: floatDelay * 0.3 },
    }}
    className={`absolute whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-body font-medium ${className}`}
    style={{
      color: '#C9A84C',
      border: '1px solid rgba(201,168,76,0.3)',
      background: 'rgba(201,168,76,0.06)',
      backdropFilter: 'blur(12px)',
    }}
  >
    {label}
  </motion.div>
);

export default FaceCanvas;
