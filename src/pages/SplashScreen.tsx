import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding/1'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center"
          animate={{ boxShadow: ['0 0 20px #C9A84C40', '0 0 40px #C9A84C80', '0 0 20px #C9A84C40'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-display text-3xl font-bold text-obsidian">A</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-display text-4xl font-bold tracking-wider text-foreground"
        >
          AURA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-mono text-sm tracking-widest text-gold"
        >
          AI-POWERED EDITING
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
