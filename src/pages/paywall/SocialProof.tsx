import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Sarah K.', text: 'AURA completely changed my Instagram game!', stars: 5 },
  { name: 'Mike D.', text: 'Best AI photo editor I\'ve ever used.', stars: 5 },
  { name: 'Jess L.', text: 'Worth every penny. My photos look professional now.', stars: 5 },
];

const SocialProof = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-1 flex-col items-center justify-center gap-6">
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-foreground text-center">Loved by Creators</motion.h2>
        <motion.p variants={fadeUp} className="text-gold font-mono text-sm">★ 4.9 Average Rating</motion.p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {reviews.map((r, i) => (
            <motion.div key={r.name} variants={fadeUp} custom={i} className="rounded-2xl bg-surface border border-border p-5">
              <div className="flex gap-0.5 mb-2">{Array.from({ length: r.stars }).map((_, j) => <Star key={j} className="h-4 w-4 fill-gold text-gold" />)}</div>
              <p className="text-foreground text-sm mb-2">"{r.text}"</p>
              <p className="text-muted-foreground text-xs">— {r.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={() => navigate('/paywall/5')} className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian active:scale-95 transition-transform">
        Continue →
      </motion.button>
    </div>
  );
};

export default SocialProof;
