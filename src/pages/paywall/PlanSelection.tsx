import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react';

type PlanId = 'weekly' | 'monthly' | 'annual';

const plans: {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  desc: string;
  save?: string;
  badge?: string;
}[] = [
  { id: 'weekly', name: 'Weekly', price: '$4.99', period: '/week', desc: 'Perfect for a quick event' },
  { id: 'annual', name: 'Annual Pro', price: '$4.17', period: '/month', desc: 'Billed as $49.99/year · All Pro features unlocked', save: '🎉 Save $95.88/yr vs monthly', badge: 'BEST VALUE ✦' },
  { id: 'monthly', name: 'Monthly', price: '$12.99', period: '/month', desc: 'Flexible, cancel any time' },
];

const includes = [
  'AI Skin Retouching', 'Pro Headshots',
  'Background AI', 'Face Sculpting',
  'Style Transfer', 'Prompt Editing',
  'Unlimited Exports', '30-day Guarantee',
];

const PlanSelection = () => {
  const navigate = useNavigate();
  const { selectedPlan, setSelectedPlan } = useAppStore();
  const [period, setPeriod] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="flex min-h-screen flex-col items-center bg-obsidian px-6 py-10 overflow-y-auto">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-sm">

        {/* Badge */}
        <motion.div variants={fadeUp} className="rounded-full px-4 py-1.5 mb-5" style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}>
          <span className="text-xs font-body font-medium text-gold tracking-wide">✦ Choose Your Plan</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="font-display text-[26px] font-black text-foreground text-center leading-tight mb-2">
          Transparent{' '}
          <em className="not-italic italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">pricing.</em>{' '}
          Cancel any time.
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground text-center mb-6">
          No tricks. No surprise charges. Our promise.
        </motion.p>

        {/* Period Toggle */}
        <motion.div variants={fadeUp} className="flex rounded-full p-1 mb-6 w-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['monthly', 'annual'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 rounded-full py-2 text-sm font-body font-medium transition-all ${
                period === p
                  ? 'text-gold'
                  : 'text-muted-foreground'
              }`}
              style={period === p ? { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' } : { border: '1px solid transparent' }}
            >
              {p === 'monthly' ? 'Monthly' : 'Annual · Save 68% 🎉'}
            </button>
          ))}
        </motion.div>

        {/* Plan Cards */}
        <div className="flex flex-col gap-3 w-full mb-6">
          {plans.map((plan) => {
            const selected = selectedPlan === plan.id;
            return (
              <motion.button
                key={plan.id}
                variants={fadeUp}
                onClick={() => setSelectedPlan(plan.id)}
                className="relative w-full rounded-2xl p-4 text-left transition-all"
                style={{
                  background: selected ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
                  border: selected ? '2px solid rgba(201,168,76,0.5)' : '2px solid rgba(255,255,255,0.06)',
                  boxShadow: selected ? '0 0 20px rgba(201,168,76,0.1)' : 'none',
                }}
              >
                {/* Best Value Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-4 rounded-full px-3 py-0.5 bg-gradient-to-r from-gold to-gold-light">
                    <span className="text-[10px] font-body font-bold text-obsidian tracking-wide">{plan.badge}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-semibold text-foreground">{plan.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{plan.desc}</p>
                    {plan.save && (
                      <p className="text-[11px] text-mint font-semibold mt-1">{plan.save}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-gold">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>

                    {/* Radio */}
                    <div
                      className="h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                      style={{
                        borderColor: selected ? '#C9A84C' : 'rgba(255,255,255,0.2)',
                        boxShadow: selected ? '0 0 8px rgba(201,168,76,0.3)' : 'none',
                      }}
                    >
                      {selected && <div className="h-2.5 w-2.5 rounded-full bg-gold" />}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Includes Grid */}
        <motion.div variants={fadeUp} className="w-full mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">What's included</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {includes.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-mint shrink-0" />
                <span className="text-xs text-foreground/80 font-body">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={fadeUp}
          onClick={() => navigate('/paywall/6')}
          className="w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-base font-semibold text-obsidian transition-transform active:scale-95"
        >
          Start 3-Day Free Trial →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PlanSelection;
