import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FaceCanvas from '@/components/FaceCanvas';

const stats = [
  { value: '4.2M', label: 'Users' },
  { value: '4.9★', label: 'Rating' },
  { value: '50+', label: 'AI Tools' },
];

const OnboardingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-ink px-6 py-10 overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 mb-8 flex items-center gap-2 rounded-full px-4 py-2"
          style={{ border: '1px solid rgba(200,164,90,0.25)', background: 'rgba(200,164,90,0.06)' }}
        >
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="font-body text-xs font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.08em' }}>AURA AI Studio</span>
        </motion.div>

        {/* Face canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <FaceCanvas />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-3 mb-8 w-full justify-center"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-2xl px-5 py-3 glass-card"
            >
              <span className="font-display text-xl font-bold" style={{ color: 'var(--gold)' }}>{s.value}</span>
              <span className="font-body text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.55 }}
          className="text-center mb-3"
        >
          <h1 className="font-display leading-none" style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)' }}>
            Your thoughts,{' '}
            <em
              className="not-italic italic"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              elevated.
            </em>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="font-body text-center text-sm leading-relaxed mb-10 max-w-[280px]"
          style={{ color: 'var(--text-muted)' }}
        >
          Type any look you want. AURA's AI applies it with professional-grade precision — in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/onboarding/2')}
            className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer"
            style={{
              background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))',
              color: '#fff',
              boxShadow: '0 0 24px rgba(232,84,122,0.25)',
            }}
          >
            Get Started Free
          </motion.button>
          <button
            onClick={() => navigate('/login')}
            className="font-body text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Already have an account?{' '}
            <span style={{ color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingHero;
