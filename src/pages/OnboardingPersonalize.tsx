import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Analytics } from '@/services/analytics';

const goals = [
  { id: 'dating',    icon: '💛', title: 'Dating Profiles',    sub: 'Look irresistible on Hinge, Bumble, Tinder' },
  { id: 'linkedin',  icon: '💼', title: 'Professional',       sub: 'LinkedIn, resume, team pages' },
  { id: 'social',    icon: '📸', title: 'Social Media',       sub: 'Instagram, TikTok, content creation' },
  { id: 'branding',  icon: '🏆', title: 'Personal Brand',     sub: 'Speaker, founder, thought leader' },
  { id: 'events',    icon: '🎭', title: 'Special Events',     sub: 'Weddings, galas, red carpet' },
  { id: 'everyday',  icon: '✨', title: 'Everyday Glow',      sub: 'Look your best in any photo' },
];

const OnboardingPersonalize = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [committing, setCommitting] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setCommitting(true);
    Analytics.goalSelected(selected);
    // Store goal in Zustand (extend store if needed)
    localStorage.setItem('aura_goal', selected);
    await new Promise(r => setTimeout(r, 300));
    navigate('/onboarding/4');
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-ink px-6 py-10 overflow-hidden">
      <div className="aurora-bg" style={{ opacity: 0.6 }}>
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <div className="relative z-10 flex flex-col w-full max-w-sm mx-auto">
        {/* Step pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 mb-8"
          style={{ border: '1px solid rgba(200,164,90,0.2)', background: 'rgba(200,164,90,0.05)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
            Step 2 · Personalize
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="font-display mb-2" style={{ fontSize: 34, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            What's your
            <br />
            <em className="not-italic italic" style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>main goal?</em>
          </h1>
          <p className="font-body text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
            AURA adapts every suggestion, preset, and AI response to what actually matters to you.
          </p>
        </motion.div>

        {/* Goal grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {goals.map((g, i) => {
            const isSelected = selected === g.id;
            return (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(g.id)}
                className="relative flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all"
                style={{
                  background: isSelected ? 'rgba(200,164,90,0.1)' : 'var(--void)',
                  border: `1.5px solid ${isSelected ? 'rgba(200,164,90,0.45)' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: isSelected ? '0 0 20px rgba(200,164,90,0.1)' : 'none',
                }}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--gold)' }}>
                    <span style={{ fontSize: 10, color: 'var(--ink)', fontWeight: 900 }}>✓</span>
                  </div>
                )}
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <p className="font-body text-sm font-semibold" style={{ color: isSelected ? 'var(--gold)' : 'var(--text-primary)' }}>{g.title}</p>
                  <p className="font-body text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{g.sub}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6 justify-center">
          {[1,2,3,4].map(n => (
            <div key={n} className="h-1 rounded-full transition-all" style={{
              width: n <= 3 ? 24 : 12,
              background: n <= 3 ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
            }} />
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: selected ? 0 : 0, opacity: selected ? 1 : 0.5 }}
          whileHover={selected ? { scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          onClick={handleContinue}
          disabled={!selected || committing}
          className="w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))',
            color: '#fff',
            boxShadow: selected ? '0 0 24px rgba(232,84,122,0.2)' : 'none',
          }}
        >
          {committing ? 'Personalizing…' : 'See AURA in Action →'}
        </motion.button>

        <button
          onClick={() => navigate('/onboarding/4')}
          className="text-center mt-3 font-body text-xs"
          style={{ color: 'var(--text-faint)' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default OnboardingPersonalize;
