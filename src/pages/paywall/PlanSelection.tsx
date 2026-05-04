import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Check, Shield } from 'lucide-react';

type PlanId = 'weekly' | 'monthly' | 'annual';

const plans: { id: PlanId; name: string; price: string; period: string; subtext: string; save?: string; badge?: string }[] = [
  { id: 'annual', name: 'Annual Pro', price: '$4.17', period: '/mo', subtext: 'Billed $49.99/year — best deal', save: 'Save $105.89 vs monthly', badge: 'BEST VALUE ✦' },
  { id: 'monthly', name: 'Monthly Pro', price: '$12.99', period: '/mo', subtext: 'Flexible — cancel any time' },
  { id: 'weekly', name: 'Weekly', price: '$4.99', period: '/wk', subtext: 'Perfect for a quick event' },
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

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-ink px-6 py-10 overflow-y-auto">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-col items-center w-full max-w-sm relative z-10"
      >
        {/* Badge */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="rounded-full px-4 py-1.5 mb-5"
          style={{ border: '1px solid rgba(200,164,90,0.28)', background: 'rgba(200,164,90,0.06)' }}
        >
          <span className="font-body text-xs font-medium tracking-wide" style={{ color: 'var(--gold)' }}>✦ Choose Your Plan</span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
          className="font-display text-center leading-tight mb-2"
          style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}
        >
          Transparent{' '}
          <em className="not-italic italic" style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            pricing.
          </em>{' '}
          Cancel any time.
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          className="font-body text-sm text-center mb-7"
          style={{ color: 'var(--text-muted)' }}
        >
          No tricks. No hidden fees. Our promise.
        </motion.p>

        {/* Plan Cards */}
        <div className="flex flex-col gap-3 w-full mb-6">
          {plans.map((plan, i) => {
            const selected = selectedPlan === plan.id;
            return (
              <motion.button
                key={plan.id}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.1 + i * 0.06 } } }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedPlan(plan.id)}
                className="relative w-full rounded-2xl p-4 text-left transition-all"
                style={{
                  background: selected ? 'rgba(200,164,90,0.07)' : 'var(--void)',
                  border: selected ? '1.5px solid rgba(200,164,90,0.45)' : '1px solid var(--glass-border)',
                  boxShadow: selected ? '0 0 24px rgba(200,164,90,0.1)' : 'none',
                }}
              >
                {/* Pulse glow when selected */}
                {selected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ boxShadow: ['0 0 12px rgba(200,164,90,0.06)', '0 0 24px rgba(200,164,90,0.14)', '0 0 12px rgba(200,164,90,0.06)'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {plan.badge && (
                  <div
                    className="absolute -top-3 left-4 rounded-full px-3 py-0.5"
                    style={{ background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))', }}
                  >
                    <span className="font-body text-[10px] font-bold tracking-wide" style={{ color: 'var(--ink)' }}>{plan.badge}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{plan.name}</p>
                    <p className="font-body text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{plan.subtext}</p>
                    {plan.save && (
                      <p className="font-mono text-[10px] font-bold mt-1" style={{ color: 'var(--teal)' }}>🎉 {plan.save}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-display font-bold" style={{ fontSize: 22, color: 'var(--gold)', lineHeight: 1 }}>{plan.price}</span>
                      <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                    </div>
                    <div
                      className="h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                      style={{
                        borderColor: selected ? 'var(--gold)' : 'rgba(255,255,255,0.18)',
                        boxShadow: selected ? '0 0 8px rgba(200,164,90,0.35)' : 'none',
                      }}
                    >
                      {selected && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--gold)' }} />}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Includes grid */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="w-full mb-7 rounded-2xl p-4"
          style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3 text-center" style={{ color: 'var(--text-muted)' }}>
            Everything included
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {includes.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--teal)' }} />
                <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          {['No charge today', 'Cancel any time', '30-day refund'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <Shield className="h-3 w-3" style={{ color: 'var(--teal)' }} />
              <span className="font-body text-[10px]" style={{ color: 'var(--text-muted)' }}>{t}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/paywall/6')}
          className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer"
          style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff', boxShadow: '0 0 24px rgba(232,84,122,0.2)' }}
        >
          Start 3-Day Free Trial →
        </motion.button>

        <p className="font-body text-xs text-center mt-3" style={{ color: 'var(--text-faint)' }}>
          No charge until day 4. Cancel any time.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanSelection;
