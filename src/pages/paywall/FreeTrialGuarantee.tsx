import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Shield, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const FreeTrialGuarantee = () => {
  const navigate = useNavigate();
  const { setIsProUser, setOnboardingComplete } = useAppStore();

  const handleStart = () => {
    setIsProUser(true);
    setOnboardingComplete(true);
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <motion.div variants={fadeUp} className="flex gap-4">
          <Shield className="h-10 w-10 text-mint" />
          <RotateCcw className="h-10 w-10 text-gold" />
        </motion.div>
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-foreground">
          Try Free for 3 Days
        </motion.h2>
        <motion.div variants={fadeUp} className="rounded-2xl bg-surface border border-border p-6 max-w-sm w-full">
          <div className="flex flex-col gap-3 text-left text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Today</span><span className="text-foreground">Full access unlocked</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Day 3</span><span className="text-foreground">Reminder notification</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Day 4</span><span className="text-foreground">Billing begins</span></div>
          </div>
        </motion.div>
        <motion.p variants={fadeUp} className="text-muted-foreground text-xs max-w-xs">
          Cancel anytime before your trial ends. No charge, no questions.
        </motion.p>
      </motion.div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={handleStart} className="w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian active:scale-95 transition-transform">
          Start Free Trial
        </motion.button>
        <button onClick={() => navigate('/home')} className="text-sm text-muted-foreground underline">
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default FreeTrialGuarantee;
