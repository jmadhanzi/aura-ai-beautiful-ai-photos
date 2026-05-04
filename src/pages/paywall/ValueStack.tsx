import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const items = [
  { emoji: '✨', name: 'AI Skin Perfecting', desc: 'Frequency separation. Looks real, not filtered', price: '$29/mo', accent: 'var(--gold)', bg: 'rgba(200,164,90,0.07)' },
  { emoji: '👔', name: 'Professional Headshots', desc: 'Replace $200 photography sessions instantly', price: '$49/shot', accent: 'var(--rose)', bg: 'rgba(232,84,122,0.06)' },
  { emoji: '🌅', name: 'Background Replacement', desc: 'Any background. Pixel-perfect AI edges', price: '$15/mo', accent: 'var(--teal)', bg: 'rgba(0,201,173,0.06)' },
  { emoji: '💎', name: '3D Face Sculpting', desc: '68-point mesh. Your identity preserved', price: '$39/mo', accent: 'var(--violet)', bg: 'rgba(139,108,240,0.06)' },
  { emoji: '🎨', name: 'Style & Makeup AI', desc: 'Any look. Applied to your exact geometry', price: '$19/mo', accent: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
  { emoji: '💬', name: 'Natural Language Editing', desc: '"Make me confident" → done in 8 seconds', price: '$25/mo', accent: '#0EA5E9', bg: 'rgba(14,165,233,0.06)' },
  { emoji: '🎬', name: 'Cinematic Color Grading', desc: 'Hollywood LUTs tuned to your exact skin tone', price: '$12/mo', accent: '#EC4899', bg: 'rgba(236,72,153,0.06)' },
  { emoji: '📱', name: 'Platform Optimizer', desc: 'Auto-optimize for IG, LinkedIn, Hinge, Tinder', price: '$9/mo', accent: 'var(--teal-mid)', bg: 'rgba(0,201,173,0.05)' },
];

const itemVariant = {
  hidden: { opacity: 0, x: -18 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' as const },
  }),
};

const ValueStack = () => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '').split('/')[0]), 0);

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-ink px-6 py-10 overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="flex flex-1 flex-col items-center w-full max-w-sm relative z-10"
      >
        {/* Badge */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="rounded-full px-4 py-1.5 mb-5"
          style={{ border: '1px solid rgba(200,164,90,0.28)', background: 'rgba(200,164,90,0.06)' }}
        >
          <span className="font-body text-xs font-medium tracking-wide" style={{ color: 'var(--gold)' }}>✦ Everything included</span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
          className="font-display text-center leading-tight mb-2"
          style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}
        >
          A full studio{' '}
          <em className="not-italic italic" style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            in your pocket
          </em>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          className="font-body text-sm text-center mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          Pro retouchers charge $50–200/hour for this. You get all of it.
        </motion.p>

        {/* Value list */}
        <div className="flex flex-col gap-2 w-full mb-5">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={itemVariant}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: item.bg, border: `1px solid ${item.accent}28` }}
            >
              <motion.div
                className="w-0.5 self-stretch rounded-full shrink-0"
                style={{ background: item.accent }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.3 }}
              />
              <span className="text-base shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                <p className="font-body text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
              <span className="font-mono text-xs font-bold shrink-0" style={{ color: item.accent }}>{item.price}</span>
            </motion.div>
          ))}
        </div>

        {/* Value card */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="w-full rounded-2xl p-5 flex items-center justify-between mb-8 glass-card"
        >
          <div>
            <p className="font-body text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Total Retail Value</p>
            <p className="font-body text-base line-through" style={{ color: 'var(--text-muted)' }}>${total}/month</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="font-display font-bold" style={{ fontSize: 34, color: 'var(--gold)', lineHeight: 1 }}>$4.17</span>
              <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <p className="font-mono text-[11px] font-bold mt-1" style={{ color: 'var(--teal)' }}>Save 97% today 🎉</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/paywall/4')}
          className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer mt-auto"
          style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff', boxShadow: '0 0 24px rgba(232,84,122,0.2)' }}
        >
          Get Everything for $4.17/mo →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ValueStack;
