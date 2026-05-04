import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    gradient: 'linear-gradient(135deg, var(--rose), #F59E0B)',
    time: '3 days ago',
    text: "Tried Facetune, Retake, all of them. AURA is on another level — the skin retouching looks like I actually have good skin, not a filter. My LinkedIn recruiter commented on my photo.",
    badge: '📈 3× more recruiter messages',
    badgeColor: 'rgba(0,201,173,0.12)',
    badgeText: 'var(--teal)',
  },
  {
    name: 'Marcus T.',
    gradient: 'linear-gradient(135deg, var(--violet), #C084FC)',
    time: '1 week ago',
    text: "Saved $800 in headshot sessions. The AI headshot tool is insane — 23 different looks in 2 minutes. My new profile pic got 40 connection requests on day one.",
    badge: '💰 Saved $800 in photography',
    badgeColor: 'rgba(200,164,90,0.1)',
    badgeText: 'var(--gold)',
  },
  {
    name: 'Priya K.',
    gradient: 'linear-gradient(135deg, var(--teal), #3B82F6)',
    time: '2 weeks ago',
    text: "Finally an app that's honest about pricing. No hidden fees, and the 30-day guarantee made me feel completely safe trying it.",
    badge: "😊 First app I've stayed subscribed to",
    badgeColor: 'rgba(0,201,173,0.1)',
    badgeText: 'var(--teal)',
  },
];

const SocialProof = () => {
  const navigate = useNavigate();
  const { ref: barsRef, isInView: barsInView } = useInViewAnimation();

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
          className="rounded-full px-4 py-1.5 mb-6"
          style={{ border: '1px solid rgba(200,164,90,0.28)', background: 'rgba(200,164,90,0.06)' }}
        >
          <span className="font-body text-xs font-medium tracking-wide" style={{ color: 'var(--gold)' }}>✦ 44,000+ Verified Reviews</span>
        </motion.div>

        {/* Rating hero */}
        <motion.p
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
          className="font-display font-bold leading-none"
          style={{ fontSize: 72, color: 'var(--gold)' }}
        >
          4.9
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          className="flex gap-1 my-2"
        >
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-gold text-gold" />)}
        </motion.div>
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          className="font-mono text-[11px] uppercase tracking-widest mb-7"
          style={{ color: 'var(--text-muted)' }}
        >
          App Store · 44,000 reviews
        </motion.p>

        {/* Rating bars */}
        <motion.div
          ref={barsRef}
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="w-full flex flex-col gap-2 mb-8 rounded-2xl p-4"
          style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
        >
          {ratingBars.map(({ stars, pct, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-2.5 w-2.5" style={{ color: j < stars ? 'var(--gold)' : 'rgba(200,164,90,0.2)', fill: j < stars ? 'var(--gold)' : 'transparent' }} />
                ))}
              </div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stars === 5 ? 'linear-gradient(90deg, var(--gold-dim), var(--gold))' : 'rgba(200,164,90,0.3)' }}
                  initial={{ width: 0 }}
                  animate={{ width: barsInView ? `${pct}%` : 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * (5 - stars), ease: 'easeOut' }}
                />
              </div>
              <span className="font-mono text-[10px] shrink-0 w-8 text-right" style={{ color: 'var(--text-faint)' }}>{count}</span>
            </div>
          ))}
        </motion.div>

        {/* Review cards */}
        <div className="flex flex-col gap-3 w-full mb-8">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
              className="rounded-2xl p-4"
              style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl shrink-0" style={{ background: r.gradient }} />
                <div>
                  <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                  <p className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{r.time}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-gold text-gold" />)}
                </div>
              </div>
              <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{r.text}</p>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{ background: r.badgeColor, border: `1px solid ${r.badgeText}28` }}>
                <span className="font-body text-[11px] font-medium" style={{ color: r.badgeText }}>{r.badge}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/paywall/5')}
          className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer mb-3"
          style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff', boxShadow: '0 0 24px rgba(232,84,122,0.2)' }}
        >
          Join 4.2M Users Today →
        </motion.button>

        <button onClick={() => navigate('/paywall/5')} className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          See pricing first
        </button>
      </motion.div>
    </div>
  );
};

export default SocialProof;
