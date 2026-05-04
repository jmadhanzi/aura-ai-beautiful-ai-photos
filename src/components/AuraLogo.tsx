import { motion } from 'framer-motion';

const AuraLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => {
  const s = size === 'small' ? 0.65 : 1;
  const dim = 100 * s;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
      {/* Outer pulse ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: dim,
          height: dim,
          border: `1px solid rgba(200,164,90,0.2)`,
          animation: 'pulseRing 3s ease-out infinite',
        }}
      />
      {/* Ring 1 — slow spin */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: dim,
          height: dim,
          border: `${1.5 * s}px solid transparent`,
          borderTopColor: 'rgba(200,164,90,0.7)',
          borderRightColor: 'rgba(200,164,90,0.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Ring 2 — reverse */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 74 * s,
          height: 74 * s,
          border: `${1 * s}px solid transparent`,
          borderTopColor: 'rgba(139,108,240,0.5)',
          borderLeftColor: 'rgba(139,108,240,0.2)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Ring 3 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 52 * s,
          height: 52 * s,
          border: `${1 * s}px solid transparent`,
          borderTopColor: 'rgba(0,201,173,0.4)',
          borderBottomColor: 'rgba(0,201,173,0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      {/* Center gem */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 38 * s,
          height: 38 * s,
          background: 'linear-gradient(135deg, #C8A45A 0%, #EED498 50%, #C8A45A 100%)',
          boxShadow: `0 0 ${30 * s}px rgba(200,164,90,0.5), 0 0 ${60 * s}px rgba(200,164,90,0.2)`,
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="font-display"
          style={{ fontSize: 18 * s, fontWeight: 700, color: '#050509', lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          A
        </span>
      </motion.div>
    </div>
  );
};

export default AuraLogo;
