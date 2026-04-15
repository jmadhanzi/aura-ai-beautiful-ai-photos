import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/integrations/supabase/client';

const timeline = [
  { step: '1', label: 'Today', sub: 'Free trial starts', active: true },
  { step: '2', label: 'Try everything', sub: 'All 50+ tools', active: true },
  { step: '3', label: 'Day 3', sub: 'Cancel if not amazed', active: false },
  { step: 'Pro', label: 'Day 4+', sub: '$49.99/yr if you love it', active: false },
];

const guarantees = [
  { icon: '🚫', title: 'No Charge Today', desc: 'Your card is not charged until day 4. Period.' },
  { icon: '❌', title: 'Cancel Instantly', desc: 'One tap cancel, any time. No hoops to jump through.' },
  { icon: '💰', title: '30-Day Refund', desc: 'Even after billing — email us and we refund. No questions.' },
  { icon: '🔒', title: 'Private & Safe', desc: 'Your photos process on-device. We never store or sell them.' },
];

const FreeTrialGuarantee = () => {
  const navigate = useNavigate();
  const { setIsProUser, setOnboardingComplete } = useAppStore();

  const handleStart = async () => {
    setIsProUser(true);
    setOnboardingComplete(true);
    // Update profile in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { selectedPlan } = useAppStore.getState();
      await supabase.from('profiles').update({
        is_pro: true,
        plan_type: selectedPlan,
        trial_started_at: new Date().toISOString(),
      }).eq('id', user.id);
    }
    navigate('/home');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-obsidian px-6 py-10 overflow-y-auto">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
        <div className="aurora-blob aurora-mint" />
      </div>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-sm relative z-10">

        {/* Badge */}
        <motion.div variants={fadeUp} className="rounded-full px-4 py-1.5 mb-5" style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}>
          <span className="text-xs font-body font-medium text-gold tracking-wide">✦ Zero Risk. 100% Reward.</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="font-display text-[26px] font-black text-foreground text-center leading-tight mb-2">
          3 days{' '}
          <em className="not-italic italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">completely free.</em>{' '}
          Then decide.
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground text-center mb-8">
          Experience everything Pro has to offer. If you don't love it, you owe us nothing.
        </motion.p>

        {/* Trial Timeline */}
        <motion.div variants={fadeUp} className="w-full flex items-start justify-between mb-8 px-1">
          {timeline.map((t, i) => (
            <div key={t.step} className="flex flex-col items-center flex-1 relative">
              {/* Connector line (before circle, except first) */}
              {i > 0 && (
                <div
                  className="absolute top-3 right-1/2 w-full h-[2px]"
                  style={{ background: timeline[i - 1].active && t.active ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
                />
              )}
              {/* Circle */}
              <div
                className="relative z-10 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-body font-bold mb-1.5"
                style={{
                  background: t.active ? '#C9A84C' : 'rgba(255,255,255,0.06)',
                  color: t.active ? '#07070F' : 'rgba(255,255,255,0.4)',
                  border: t.active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {t.step}
              </div>
              <p className="text-[11px] font-body font-semibold text-foreground text-center">{t.label}</p>
              <p className="text-[9px] text-muted-foreground text-center leading-tight">{t.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Guarantee Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 w-full mb-8">
          {guarantees.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl p-4 flex flex-col items-center text-center gap-2"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-2xl">{g.icon}</span>
              <p className="text-xs font-body font-semibold text-foreground">{g.title}</p>
              <p className="text-[10px] text-muted-foreground leading-snug">{g.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Final CTA Section */}
        <motion.p variants={fadeUp} className="text-xs text-muted-foreground text-center mb-3">
          After 3 days: $49.99/year ($4.17/mo) · Cancel anytime
        </motion.p>

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="relative w-full rounded-2xl bg-gradient-to-r from-gold to-gold-light font-body font-semibold text-obsidian overflow-hidden mb-3"
          style={{ fontSize: '17px', padding: '18px' }}
        >
          <span className="relative z-10">✦ Start My Free Trial — No Risk</span>
          <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
        </motion.button>

        <motion.p variants={fadeUp} className="text-[10px] text-muted-foreground text-center leading-relaxed">
          🔒 Secured by Apple Pay · No card needed for trial · 30-day money-back
        </motion.p>
      </motion.div>
    </div>
  );
};

export default FreeTrialGuarantee;
