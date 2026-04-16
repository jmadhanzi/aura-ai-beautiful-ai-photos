import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FaceCanvas from '@/components/FaceCanvas';

const stats = [
  { value: '2.4M', label: 'Users' },
  { value: '4.9★', label: 'Rating' },
  { value: '50+', label: 'AI Tools' },
];

const OnboardingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 py-10 overflow-hidden">
      {/* Face */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="mb-8"
      >
        <FaceCanvas />
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-3 mb-8"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center rounded-xl px-5 py-2.5 glass-card"
          >
            <span className="font-display text-lg font-bold text-gold">{s.value}</span>
            <span className="text-[10px] font-body uppercase tracking-widest text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="font-display text-[32px] font-black leading-tight text-center text-foreground mb-3"
      >
        Your most <em className="not-italic font-display italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">beautiful</em> self, unlocked
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed"
      >
        Professional-grade AI photo editing in your pocket. Results that used to take hours — done in seconds.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="flex flex-col items-center gap-3 w-full max-w-sm"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/onboarding/2')}
          className="relative w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian overflow-hidden"
        >
          <span className="relative z-10">Get Started Free →</span>
          <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
        </motion.button>
        <button
          onClick={() => navigate('/login')}
          className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Already have an account? <span className="text-gold underline underline-offset-2">Sign in</span>
        </button>
      </motion.div>
    </div>
  );
};

export default OnboardingHero;
