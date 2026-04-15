import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { Check, X } from 'lucide-react';

const rows = [
  { feature: 'AI Skin Retouching', aura: 'Pro-grade' },
  { feature: 'Face Sculpting', aura: '68-point' },
  { feature: 'Transparent Billing', aura: 'Always' },
  { feature: 'Refund Guarantee', aura: '30 days' },
  { feature: 'Privacy-first', aura: 'On-device' },
];

const BeforeAfterProof = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center bg-obsidian px-6 py-10 overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col items-center w-full max-w-sm"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="rounded-full px-4 py-1.5 mb-5"
          style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}
        >
          <span className="text-xs font-body font-medium text-gold tracking-wide">✦ Real Results. Zero Filters.</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="font-display text-[26px] font-black text-foreground text-center leading-tight mb-6">
          See the{' '}
          <em className="not-italic italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">difference</em>{' '}
          for yourself
        </motion.h1>

        {/* Slider */}
        <motion.div variants={fadeUp} className="w-full mb-8">
          <BeforeAfterSlider />
        </motion.div>

        {/* Comparison table */}
        <motion.div variants={fadeUp} className="w-full mb-8">
          {/* Header */}
          <div className="grid grid-cols-[1fr_60px_80px] gap-2 mb-3 px-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Feature</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center">Others</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold text-center">AURA ✦</span>
          </div>
          {/* Rows */}
          <div className="flex flex-col gap-1.5">
            {rows.map((r) => (
              <div
                key={r.feature}
                className="grid grid-cols-[1fr_60px_80px] gap-2 items-center rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="text-xs text-foreground font-body">{r.feature}</span>
                <div className="flex justify-center">
                  <X className="h-3.5 w-3.5 text-red-400/60" />
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Check className="h-3.5 w-3.5 text-mint" />
                  <span className="text-[10px] text-gold font-medium">{r.aura}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={fadeUp}
          onClick={() => navigate('/paywall/3')}
          className="w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-base font-semibold text-obsidian transition-transform active:scale-95 mt-auto"
        >
          I'm Convinced — Continue →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BeforeAfterProof;
