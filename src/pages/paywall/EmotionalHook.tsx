import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Heart } from 'lucide-react';

const EmotionalHook = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <motion.div variants={fadeUp}>
          <Heart className="h-16 w-16 text-rose" />
        </motion.div>
        <motion.h1 variants={fadeUp} className="font-display text-3xl font-bold text-foreground leading-tight">
          Your Photos Deserve{' '}
          <span className="bg-gradient-to-r from-rose to-violet bg-clip-text text-transparent">To Be Perfect</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-muted-foreground max-w-xs">
          Join 2M+ creators who transformed their content with AURA AI
        </motion.p>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={() => navigate('/paywall/2')} className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian active:scale-95 transition-transform">
        See the Magic →
      </motion.button>
    </div>
  );
};

export default EmotionalHook;
