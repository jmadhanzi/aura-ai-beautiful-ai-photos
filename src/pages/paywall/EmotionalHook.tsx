import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Star } from 'lucide-react';

const FaceWireframeBefore = () => (
  <svg width="60" height="75" viewBox="0 0 140 180" fill="none" opacity="0.4">
    <ellipse cx="70" cy="90" rx="55" ry="72" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <ellipse cx="48" cy="75" rx="10" ry="6" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
    <ellipse cx="48" cy="75" rx="4" ry="3.5" fill="rgba(255,255,255,0.08)" />
    <ellipse cx="92" cy="75" rx="10" ry="6" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
    <ellipse cx="92" cy="75" rx="4" ry="3.5" fill="rgba(255,255,255,0.08)" />
    <path d="M70 82 L66 100 L74 100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="none" />
    <path d="M55 115 Q63 108 70 112 Q77 108 85 115" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="none" />
  </svg>
);

const FaceWireframeAfter = () => (
  <svg width="60" height="75" viewBox="0 0 140 180" fill="none">
    <ellipse cx="70" cy="90" rx="55" ry="72" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
    <ellipse cx="48" cy="75" rx="10" ry="6" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" />
    <ellipse cx="48" cy="75" rx="4" ry="3.5" fill="rgba(201,168,76,0.5)" />
    <circle cx="46" cy="73" r="1.5" fill="rgba(255,255,255,0.7)" />
    <ellipse cx="92" cy="75" rx="10" ry="6" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" />
    <ellipse cx="92" cy="75" rx="4" ry="3.5" fill="rgba(201,168,76,0.5)" />
    <circle cx="90" cy="73" r="1.5" fill="rgba(255,255,255,0.7)" />
    <path d="M70 82 L66 100 L74 100" stroke="rgba(201,168,76,0.3)" strokeWidth="0.8" fill="none" />
    <path d="M55 115 Q63 108 70 112 Q77 108 85 115" stroke="rgba(201,168,76,0.5)" strokeWidth="1" fill="none" />
    <path d="M55 115 Q70 124 85 115" stroke="rgba(201,168,76,0.3)" strokeWidth="0.6" fill="none" />
  </svg>
);

const stats = [
  { value: '94%', label: 'feel more confident' },
  { value: '3.2×', label: 'more profile views' },
  { value: '8 sec', label: 'avg edit time' },
];

const avatarColors = [
  'from-gold to-gold-light',
  'from-rose to-violet',
  'from-mint to-violet',
  'from-violet to-rose',
];

const EmotionalHook = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-obsidian px-6 py-10 overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
        <div className="aurora-blob aurora-mint" />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col items-center w-full max-w-sm relative z-10"
      >
        {/* Top badge */}
        <motion.div
          variants={fadeUp}
          className="rounded-full px-4 py-1.5 mb-6"
          style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}
        >
          <span className="text-xs font-body font-medium text-gold tracking-wide">✦ You're moments away</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display text-[26px] font-black text-foreground text-center leading-tight mb-8"
        >
          What if your photos told the{' '}
          <em className="not-italic italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            story you deserve
          </em>
          ?
        </motion.h1>

        {/* Transformation gallery */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8 w-full justify-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 110, height: 140, background: 'linear-gradient(135deg, #1a1030, #12121F)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <FaceWireframeBefore />
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Before</span>
          </div>
          <span className="font-display text-2xl font-bold text-gold">→</span>
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative flex items-center justify-center rounded-2xl overflow-hidden"
              style={{ width: 110, height: 140, background: 'linear-gradient(135deg, #1f1828, #1a1530)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 0 30px rgba(201,168,76,0.08)' }}
            >
              <FaceWireframeAfter />
              <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.08) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
            </div>
            <span className="text-[10px] text-gold font-semibold uppercase tracking-wider">After AURA ✦</span>
          </div>
        </motion.div>

        {/* Emotion stats */}
        <motion.div variants={fadeUp} className="flex gap-2 mb-6 w-full">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 flex flex-col items-center gap-1 rounded-xl py-3 px-2"
              style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}
            >
              <span className="font-display text-base font-bold text-gold">{s.value}</span>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* User proof bar */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8 w-full">
          <div className="flex -space-x-2">
            {avatarColors.map((c, i) => (
              <div key={i} className={`h-8 w-8 rounded-full bg-gradient-to-br ${c} border-2 border-obsidian`} />
            ))}
          </div>
          <div className="flex-1">
            <p className="text-xs text-foreground leading-tight">
              <span className="font-semibold text-gold">12,847</span> people upgraded to Pro this week
            </p>
            <div className="flex gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-gold text-gold" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 w-full mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/paywall/2')}
            className="relative w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-base font-semibold text-obsidian overflow-hidden"
          >
            <span className="relative z-10">Unlock My Best Self →</span>
            <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
          </motion.button>
          <motion.button
            whileHover={{ opacity: 1 }}
            onClick={() => navigate('/paywall/3')}
            className="font-body text-sm text-muted-foreground transition-all hover:text-foreground hover:border-b hover:border-foreground/20"
          >
            See what's included first
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmotionalHook;
