import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const stats = [
  { value: '94%', label: 'feel more confident', icon: '💫' },
  { value: '3.2×', label: 'more profile views', icon: '📈' },
  { value: '8 sec', label: 'avg edit time', icon: '⚡' },
];

const avatarGradients = [
  'linear-gradient(135deg, var(--gold-dim), var(--gold))',
  'linear-gradient(135deg, var(--rose), var(--violet))',
  'linear-gradient(135deg, var(--teal), var(--violet))',
  'linear-gradient(135deg, var(--violet), var(--rose))',
];

const EmotionalHook = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-ink px-6 py-10 overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-1 flex-col items-center w-full max-w-sm relative z-10"
      >
        {/* Badge */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="rounded-full px-4 py-1.5 mb-6 flex items-center gap-2"
          style={{ border: '1px solid rgba(200,164,90,0.28)', background: 'rgba(200,164,90,0.06)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
          <span className="font-body text-xs font-medium tracking-wide" style={{ color: 'var(--gold)' }}>
            You're 30 seconds from your best photo ever
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
          className="font-display text-center leading-tight mb-3"
          style={{ fontSize: 34, fontWeight: 700, color: 'var(--text-primary)' }}
        >
          What if your photos told the{' '}
          <em className="not-italic italic" style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            story you deserve
          </em>
          ?
        </motion.h1>

        {/* Before / After transformation */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
          className="flex items-center gap-4 mb-8 w-full justify-center"
        >
          {/* Before */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex items-center justify-center rounded-3xl"
              style={{ width: 120, height: 150, background: 'linear-gradient(155deg, #0e0e1a, #12121f)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <svg width="68" height="88" viewBox="0 0 140 180" fill="none" opacity="0.35">
                <ellipse cx="70" cy="90" rx="54" ry="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <ellipse cx="46" cy="73" rx="10" ry="6.5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <ellipse cx="46" cy="73" rx="4" ry="3.5" fill="rgba(255,255,255,0.1)" />
                <ellipse cx="94" cy="73" rx="10" ry="6.5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <ellipse cx="94" cy="73" rx="4" ry="3.5" fill="rgba(255,255,255,0.1)" />
                <path d="M70 82 L66 100 L74 100" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" fill="none" />
                <path d="M54 116 Q62 109 70 113 Q78 109 86 116" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" fill="none" />
              </svg>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Before</span>
          </div>

          {/* Arrow */}
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="font-display text-2xl" style={{ color: 'var(--gold)' }}>→</span>
          </motion.div>

          {/* After */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative flex items-center justify-center rounded-3xl overflow-hidden"
              style={{
                width: 120, height: 150,
                background: 'linear-gradient(155deg, #1a1230, #181535)',
                border: '1.5px solid rgba(200,164,90,0.3)',
                boxShadow: '0 0 30px rgba(200,164,90,0.1)',
              }}
            >
              <svg width="68" height="88" viewBox="0 0 140 180" fill="none">
                <ellipse cx="70" cy="90" rx="54" ry="70" stroke="rgba(200,164,90,0.5)" strokeWidth="1" />
                <ellipse cx="46" cy="73" rx="10" ry="6.5" stroke="rgba(200,164,90,0.45)" strokeWidth="0.8" />
                <ellipse cx="46" cy="73" rx="4" ry="3.5" fill="rgba(200,164,90,0.4)" />
                <circle cx="44" cy="71.5" r="1.4" fill="rgba(255,255,255,0.75)" />
                <ellipse cx="94" cy="73" rx="10" ry="6.5" stroke="rgba(200,164,90,0.45)" strokeWidth="0.8" />
                <ellipse cx="94" cy="73" rx="4" ry="3.5" fill="rgba(200,164,90,0.4)" />
                <circle cx="92" cy="71.5" r="1.4" fill="rgba(255,255,255,0.75)" />
                <path d="M70 82 L66 100 L74 100" stroke="rgba(200,164,90,0.35)" strokeWidth="0.8" fill="none" />
                <path d="M54 116 Q62 109 70 113 Q78 109 86 116" stroke="rgba(200,164,90,0.55)" strokeWidth="1" fill="none" />
                <path d="M54 116 Q70 126 86 116" stroke="rgba(200,164,90,0.3)" strokeWidth="0.7" fill="none" />
              </svg>
              {/* Shimmer */}
              <div className="absolute inset-0 animate-shimmer"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(200,164,90,0.07) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--gold)' }}>After AURA ✦</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="flex gap-2 mb-6 w-full"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-3.5 glass-card">
              <span className="text-base">{s.icon}</span>
              <span className="font-display text-base font-bold" style={{ color: 'var(--gold)' }}>{s.value}</span>
              <span className="font-body text-[9px] text-center leading-tight px-1" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="flex items-center gap-3 mb-8 w-full rounded-2xl p-3.5"
          style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
        >
          <div className="flex -space-x-2 shrink-0">
            {avatarGradients.map((g, i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 shrink-0" style={{ background: g, borderColor: 'var(--ink)' }} />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--gold)' }}>14,209</span> people upgraded this week
            </p>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-gold text-gold" />)}
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="flex flex-col items-center gap-3 w-full mt-auto"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/paywall/2')}
            className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer"
            style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff', boxShadow: '0 0 24px rgba(232,84,122,0.2)' }}
          >
            Unlock My Best Self →
          </motion.button>
          <button
            onClick={() => navigate('/paywall/2')}
            className="font-body text-sm transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            See what's included first
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmotionalHook;
