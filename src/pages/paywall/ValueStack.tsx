import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';

const items = [
  { emoji: '✨', name: 'AI Skin Perfecting', desc: 'Frequency separation. Looks real, not airbrushed', price: '$29/mo', accent: '#C9A84C' },
  { emoji: '👔', name: 'Professional Headshots', desc: 'Replace $200 photo sessions', price: '$49/shot', accent: '#FF6B9D' },
  { emoji: '🌅', name: 'Background Replacement', desc: 'Any background. Pixel-perfect edges', price: '$15/mo', accent: '#00E5C3' },
  { emoji: '💎', name: '3D Face Sculpting', desc: '68-point mesh. Your identity preserved', price: '$39/mo', accent: '#8B5CF6' },
  { emoji: '🎨', name: 'Style & Makeup AI', desc: 'Any look. Applied to your exact geometry', price: '$19/mo', accent: '#F59E0B' },
  { emoji: '💬', name: 'Natural Language Editing', desc: '"Make me look confident" → done', price: '$25/mo', accent: '#0EA5E9' },
  { emoji: '🎬', name: 'Cinematic Color Grading', desc: 'Hollywood LUTs adapted to your skin tone', price: '$12/mo', accent: '#EC4899' },
  { emoji: '📱', name: 'Platform Optimizer', desc: 'Auto-optimize for IG, LinkedIn, Hinge, Tinder', price: '$9/mo', accent: '#10B981' },
];

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const ValueStack = () => {
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
          <span className="text-xs font-body font-medium text-gold tracking-wide">✦ Everything included</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="font-display text-[26px] font-black text-foreground text-center leading-tight mb-2">
          A full studio{' '}
          <em className="not-italic italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">in your pocket</em>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground text-center mb-6">
          Pro retouchers charge $50–200/hour for this. You get all of it.
        </motion.p>

        {/* Value list */}
        <div className="flex flex-col gap-2 w-full mb-6">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={itemVariant}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 rounded-xl px-3 py-3 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              {/* Accent bar */}
              <div className="w-[3px] self-stretch rounded-full shrink-0" style={{ backgroundColor: item.accent }} />
              {/* Emoji */}
              <span className="text-lg shrink-0">{item.emoji}</span>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
              </div>
              {/* Price */}
              <span className="text-xs font-display font-bold text-gold shrink-0">{item.price}</span>
            </motion.div>
          ))}
        </div>

        {/* Total value card */}
        <motion.div
          variants={fadeUp}
          className="w-full rounded-2xl p-5 flex items-center justify-between mb-8"
          style={{
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.25)',
          }}
        >
          <div>
            <p className="text-xs text-muted-foreground font-body mb-1">Total Retail Value</p>
            <p className="text-base text-muted-foreground line-through font-body">$197/month</p>
          </div>
          <div className="text-right">
            <p className="font-display text-[28px] font-bold text-gold leading-none">$4.17<span className="text-sm">/mo</span></p>
            <p className="text-[11px] text-mint font-semibold mt-1">Save 97% today</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={fadeUp}
          onClick={() => navigate('/paywall/4')}
          className="w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-base font-semibold text-obsidian transition-transform active:scale-95 mt-auto"
        >
          Get Everything for $4.17/mo →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ValueStack;
