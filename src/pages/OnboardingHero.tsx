import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Sparkles } from 'lucide-react';

const OnboardingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col items-center justify-center gap-8 text-center"
      >
        <motion.div variants={fadeUp} className="relative">
          <div className="h-48 w-48 rounded-full bg-gradient-to-br from-gold/20 to-violet/20 flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-gold" />
          </div>
          <div className="absolute -inset-4 rounded-full bg-gold/5 blur-xl" />
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-display text-4xl font-bold leading-tight text-foreground">
          Transform Your Photos{' '}
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            With AI Magic
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="max-w-xs text-muted-foreground">
          Professional-grade editing powered by artificial intelligence. One tap, stunning results.
        </motion.p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => navigate('/onboarding/2')}
        className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian transition-transform active:scale-95"
      >
        Get Started
      </motion.button>
    </div>
  );
};

export default OnboardingHero;
