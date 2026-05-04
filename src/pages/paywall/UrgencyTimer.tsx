import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { useCountdown } from '@/hooks/useCountdown';

const pad = (n: number) => String(n).padStart(2, '0');

const competitors = [
  { icon: '📸', name: 'Pro Photographer', price: '$200–500/session', highlight: false },
  { icon: '🎨', name: 'Facetune Pro', price: '$79.99/year', highlight: false },
  { icon: '⚡', name: 'Retake AI', price: '$21.96/week (!)', highlight: false },
  { icon: '🖥', name: 'Adobe Lightroom', price: '$119.88/year', highlight: false },
  { icon: '✦', name: 'AURA (today only)', price: '$49.99/year', highlight: true },
];

/* Digit with scale-pop on change */
const AnimatedDigit = ({ value }: { value: string }) => {
  const prevRef = useRef(value);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setPop(true);
      prevRef.current = value;
      const t = setTimeout(() => setPop(false), 200);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.span
      animate={pop ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.2 }}
      className="font-mono text-[26px] font-bold text-foreground inline-block"
    >
      {value}
    </motion.span>
  );
};

const UrgencyTimer = () => {
  const navigate = useNavigate();
  const { hours, minutes, seconds } = useCountdown(14 * 60 + 37);

  const timerUnits = [
    { label: 'Hours', value: pad(hours) },
    { label: 'Minutes', value: pad(minutes) },
    { label: 'Seconds', value: pad(seconds) },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-ink px-6 py-10 overflow-y-auto">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
        <div className="aurora-blob aurora-mint" />
      </div>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-sm relative z-10">

        {/* Urgency Header Card */}
        <motion.div
          variants={fadeUp}
          className="w-full rounded-2xl p-5 mb-6 flex flex-col items-center gap-4 glass-card"
        >
          <p className="text-[11px] uppercase tracking-widest font-body font-semibold text-rose">⏳ Limited Offer · Ends In</p>

          <div className="flex items-center gap-2">
            {timerUnits.map((u, i) => (
              <div key={u.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,107,157,0.3)' }}>
                    <AnimatedDigit value={u.value} />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">{u.label}</span>
                </div>
                {i < 2 && <span className="font-mono text-xl text-muted-foreground mb-4">:</span>}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">This 68% launch discount expires when the timer hits zero</p>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          variants={fadeUp}
          className="w-full rounded-2xl p-5 mb-6 flex items-center justify-between gap-3 glass-card"
        >
          <div className="text-center">
            <p className="text-lg text-muted-foreground line-through font-body">$155.88</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Regular Year</p>
          </div>
          <span className="text-muted-foreground text-lg">→</span>
          <div className="text-center">
            <p className="font-display text-[34px] font-bold text-gold leading-none">$49.99</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Your Price Today</p>
          </div>
          <div className="rounded-lg px-3 py-2 text-center" style={{ border: '1px solid rgba(0,229,195,0.3)', background: 'rgba(0,229,195,0.06)' }}>
            <p className="font-display text-lg font-bold text-mint leading-none">$105</p>
            <p className="text-[9px] text-mint uppercase tracking-wide">You Save</p>
          </div>
        </motion.div>

        {/* Competitor Comparison */}
        <motion.div variants={fadeUp} className="w-full mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">How we compare:</p>
          <div className="flex flex-col gap-1.5">
            {competitors.map((c) => (
              <div
                key={c.name}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 glass-card ${c.highlight ? '!border-gold/30' : ''}`}
              >
                <span className="text-sm font-body text-foreground/80">
                  <span className="mr-2">{c.icon}</span>{c.name}
                </span>
                <span className={`text-xs font-mono font-semibold ${c.highlight ? 'text-gold' : 'text-muted-foreground'}`}>{c.price}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof Live Counter */}
        <motion.div
          variants={fadeUp}
          className="w-full rounded-2xl p-4 mb-8 flex flex-col gap-2 glass-card"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
            <span className="text-foreground/80 font-body">312 people are viewing this offer</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>⬆️</span>
            <span className="text-foreground/80 font-body">47 upgraded in the last hour</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🔥</span>
            <span className="text-foreground/80 font-body">Only 68% discount left today</span>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/paywall/3')}
          className="relative w-full rounded-2xl bg-gradient-to-r from-rose to-rose-mid py-4 font-body text-base font-semibold text-obsidian overflow-hidden mb-3"
        >
          <span className="relative z-10">Claim My 68% Discount →</span>
          <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
        </motion.button>
        <motion.button
          variants={fadeUp}
          onClick={() => navigate('/paywall/3')}
          className="w-full py-3 text-sm text-muted-foreground font-body transition-colors hover:text-foreground"
        >
          No thanks, I'll pay full price later
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UrgencyTimer;
