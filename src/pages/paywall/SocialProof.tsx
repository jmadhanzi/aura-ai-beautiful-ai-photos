import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Star } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';

const ratingBars = [
  { stars: 5, pct: 87, count: '38.3k' },
  { stars: 4, pct: 9, count: '4.0k' },
  { stars: 3, pct: 2, count: '880' },
  { stars: 2, pct: 1, count: '440' },
  { stars: 1, pct: 0.5, count: '220' },
];

const reviews = [
  {
    name: 'Sarah M.',
    gradient: 'linear-gradient(135deg, #FF6B9D, #F59E0B)',
    time: '3 days ago',
    text: "I've tried Facetune, Retake, and others. AURA is on another level — the skin retouching looks like I actually have good skin, not like a filter. My LinkedIn recruiter literally commented on my photo.",
    badge: '📈 3× more recruiter messages',
    badgeColor: 'rgba(0,229,195,0.12)',
    badgeText: 'text-mint',
  },
  {
    name: 'Marcus T.',
    gradient: 'linear-gradient(135deg, #8B5CF6, #C084FC)',
    time: '1 week ago',
    text: "Saved $800 in headshot sessions. The AI headshot tool is insane — 23 different looks in 2 minutes. My new profile pic got 40 connection requests the first day.",
    badge: '💰 Saved $800 in photography',
    badgeColor: 'rgba(201,168,76,0.12)',
    badgeText: 'text-gold',
  },
  {
    name: 'Priya K.',
    gradient: 'linear-gradient(135deg, #00E5C3, #3B82F6)',
    time: '2 weeks ago',
    text: "Finally an app that's honest about pricing. Clear, no hidden fees, and the 30-day guarantee made me feel safe.",
    badge: "😊 First app I haven't unsubscribed from",
    badgeColor: 'rgba(0,229,195,0.12)',
    badgeText: 'text-mint',
  },
];

const reviewCardVariant = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.12, type: 'spring' as const, stiffness: 200, damping: 20 },
  }),
};

const SocialProof = () => {
  const navigate = useNavigate();
  const { ref: barsRef, isInView: barsInView } = useInViewAnimation();

  return (
    <div className="flex min-h-screen flex-col items-center bg-obsidian px-6 py-10 overflow-y-auto">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-sm">

        {/* Badge */}
        <motion.div variants={fadeUp} className="rounded-full px-4 py-1.5 mb-6" style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}>
          <span className="text-xs font-body font-medium text-gold tracking-wide">✦ 44,000+ Verified Reviews</span>
        </motion.div>

        {/* Rating Hero */}
        <motion.p variants={fadeUp} className="font-display text-[64px] font-bold text-gold leading-none">4.9</motion.p>
        <motion.div variants={fadeUp} className="flex gap-1 my-2">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-gold text-gold" />)}
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6">App Store Rating · 44,000 reviews</motion.p>

        {/* Rating Bars — animate on viewport entry */}
        <motion.div ref={barsRef} variants={fadeUp} className="w-full flex flex-col gap-1.5 mb-8">
          {ratingBars.map((bar, i) => (
            <div key={bar.stars} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-muted-foreground font-mono text-right">{bar.stars}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C97A)' }}
                  initial={{ width: 0 }}
                  animate={barsInView ? { width: `${bar.pct}%` } : { width: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground font-mono">{bar.count}</span>
            </div>
          ))}
        </motion.div>

        {/* Review Cards — stagger from right with spring */}
        <div className="flex flex-col gap-4 w-full mb-8">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              custom={i}
              variants={reviewCardVariant}
              initial="hidden"
              animate="visible"
              className="relative rounded-2xl p-5 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="absolute top-2 left-4 font-display text-[72px] leading-none text-gold pointer-events-none select-none" style={{ opacity: 0.08 }}>"</span>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="h-9 w-9 rounded-full shrink-0" style={{ background: r.gradient }} />
                <div>
                  <p className="text-sm font-body font-semibold text-foreground">{r.name}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-gold text-gold" />)}</div>
                    <span className="text-[10px] text-muted-foreground">· {r.time} · Verified Purchase</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3 relative z-10">"{r.text}"</p>
              <div className="inline-block rounded-full px-3 py-1 relative z-10" style={{ background: r.badgeColor }}>
                <span className={`text-xs font-body font-medium ${r.badgeText}`}>{r.badge}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/paywall/5')}
          className="relative w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-base font-semibold text-obsidian overflow-hidden"
        >
          <span className="relative z-10">Join 2.4M Happy Users →</span>
          <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SocialProof;
