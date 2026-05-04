import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Wand2 } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Skin Perfecting',
    desc: 'Neural frequency separation — looks like real skin, never filtered. Results in 8 seconds.',
    color: 'var(--gold)',
    bg: 'rgba(200,164,90,0.08)',
    border: 'rgba(200,164,90,0.2)',
    stat: '94% prefer over Facetune',
  },
  {
    icon: Wand2,
    title: 'Pro Headshots',
    desc: '23 professional looks in under 2 minutes. Replaces $200–$500 photography sessions.',
    color: 'var(--rose)',
    bg: 'rgba(232,84,122,0.07)',
    border: 'rgba(232,84,122,0.2)',
    stat: 'Saves $800/year avg',
  },
  {
    icon: Layers,
    title: 'Natural Language Editing',
    desc: 'Just describe the look. "Confident, editorial, warm lighting" — your AI understands.',
    color: 'var(--violet)',
    bg: 'rgba(139,108,240,0.07)',
    border: 'rgba(139,108,240,0.2)',
    stat: '50+ editing tools',
  },
];

const OnboardingFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-ink px-6 py-10 overflow-hidden">
      <div className="aurora-bg" style={{ opacity: 0.7 }}>
        <div className="aurora-blob aurora-violet" />
        <div className="aurora-blob aurora-mint" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
            style={{ border: '1px solid rgba(200,164,90,0.2)', background: 'rgba(200,164,90,0.05)' }}>
            <span className="font-body text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Step 2 of 2</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            A full studio
            <br />
            <em className="not-italic italic" style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              in your pocket.
            </em>
          </h1>
          <p className="font-body text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Pro retouchers charge $50–200/hr. You get it all.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="flex flex-col gap-4 flex-1">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-5"
              style={{ background: f.bg, border: `1px solid ${f.border}` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                  style={{ background: `${f.bg}`, border: `1px solid ${f.border}` }}>
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-semibold mb-0.5" style={{ color: 'var(--text-primary)', fontSize: 15 }}>{f.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
                    <span className="font-mono text-[10px]" style={{ color: f.color }}>{f.stat}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-6 my-6"
        >
          {['No ads', 'On-device AI', '30-day refund'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--teal)' }} />
              <span className="font-body text-[11px]" style={{ color: 'var(--text-muted)' }}>{t}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/onboarding/4')}
          className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer"
          style={{
            background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))',
            color: '#fff',
            boxShadow: '0 0 24px rgba(232,84,122,0.2)',
          }}
        >
          Experience It →
        </motion.button>
      </div>
    </div>
  );
};

export default OnboardingFeatures;
