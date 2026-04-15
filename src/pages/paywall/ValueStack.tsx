import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Check } from 'lucide-react';

const values = ['Unlimited AI Edits', 'All Premium Filters', '4K Export', 'Cloud Backup', 'Priority Support'];

const ValueStack = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-1 flex-col items-center justify-center gap-6">
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-foreground text-center">Everything Included</motion.h2>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {values.map((v, i) => (
            <motion.div key={v} variants={fadeUp} custom={i} className="flex items-center gap-3 rounded-xl bg-surface border border-border p-4">
              <Check className="h-5 w-5 text-mint" />
              <span className="font-body text-foreground">{v}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={() => navigate('/paywall/4')} className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian active:scale-95 transition-transform">
        Continue →
      </motion.button>
    </div>
  );
};

export default ValueStack;
