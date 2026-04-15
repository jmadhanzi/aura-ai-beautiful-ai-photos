import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp } from '@/design-system/animations';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const UrgencyTimer = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div initial="hidden" animate="visible" className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <motion.div variants={fadeUp}><Clock className="h-12 w-12 text-rose" /></motion.div>
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-foreground">Limited Time Offer</motion.h2>
        <motion.div variants={fadeUp} className="flex items-center gap-2 rounded-2xl bg-surface border border-rose/30 px-8 py-4">
          <span className="font-mono text-4xl font-bold text-rose">{String(mins).padStart(2, '0')}</span>
          <span className="font-mono text-4xl text-muted-foreground">:</span>
          <span className="font-mono text-4xl font-bold text-rose">{String(secs).padStart(2, '0')}</span>
        </motion.div>
        <motion.p variants={fadeUp} className="text-muted-foreground text-sm max-w-xs">
          Lock in 60% off your first year. This offer expires when the timer hits zero.
        </motion.p>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={() => navigate('/paywall/7')} className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-rose to-violet py-4 font-body text-lg font-semibold text-foreground active:scale-95 transition-transform">
        Claim My Discount →
      </motion.button>
    </div>
  );
};

export default UrgencyTimer;
