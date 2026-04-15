import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { useAppStore } from '@/store/useAppStore';

const plans = [
  { id: 'weekly' as const, label: 'Weekly', price: '$4.99/wk', sub: 'Cancel anytime' },
  { id: 'annual' as const, label: 'Annual', price: '$29.99/yr', sub: 'Best value — save 88%', popular: true },
  { id: 'monthly' as const, label: 'Monthly', price: '$9.99/mo', sub: 'Most flexible' },
];

const PlanSelection = () => {
  const navigate = useNavigate();
  const { selectedPlan, setSelectedPlan } = useAppStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-1 flex-col items-center justify-center gap-6 w-full max-w-sm">
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-foreground text-center">Choose Your Plan</motion.h2>
        {plans.map((p) => (
          <motion.button
            key={p.id}
            variants={fadeUp}
            onClick={() => setSelectedPlan(p.id)}
            className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
              selectedPlan === p.id ? 'border-gold bg-gold/5' : 'border-border bg-surface'
            } ${p.popular ? 'relative' : ''}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-gold-light px-3 py-0.5 text-xs font-semibold text-obsidian">
                MOST POPULAR
              </span>
            )}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-body font-semibold text-foreground">{p.label}</h3>
                <p className="text-xs text-muted-foreground">{p.sub}</p>
              </div>
              <span className="font-display text-lg font-bold text-gold">{p.price}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={() => navigate('/paywall/6')} className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian active:scale-95 transition-transform">
        Continue →
      </motion.button>
    </div>
  );
};

export default PlanSelection;
