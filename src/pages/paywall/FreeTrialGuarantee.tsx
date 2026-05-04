import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/integrations/supabase/client';
import { Shield, X, DollarSign, Lock } from 'lucide-react';

const timeline = [
  { step: 'Today', sub: 'Trial starts — use everything free', icon: '🎁', active: true },
  { step: 'Days 1–3', sub: 'Try all 50+ AI tools', icon: '✨', active: true },
  { step: 'Day 3', sub: 'Cancel if not amazed — zero charge', icon: '❌', active: false },
  { step: 'Day 4+', sub: 'Just $49.99/year if you love it', icon: '👑', active: false },
];

const guarantees = [
  { icon: X, label: 'No Charge Today', desc: 'Card verified, not charged until day 4.', color: 'var(--rose)' },
  { icon: Shield, label: 'Cancel Instantly', desc: 'One tap. No email, no hoops.', color: 'var(--violet)' },
  { icon: DollarSign, label: '30-Day Refund', desc: 'Even after billing — we refund. No questions.', color: 'var(--teal)' },
  { icon: Lock, label: 'On-Device AI', desc: 'Your photos never leave your phone.', color: 'var(--gold)' },
];

const FreeTrialGuarantee = () => {
  const navigate = useNavigate();
  const { setIsProUser, setOnboardingComplete } = useAppStore();

  const handleStart = async () => {
    setIsProUser(true);
    setOnboardingComplete(true);
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
    <div className="relative flex min-h-screen flex-col items-center bg-ink px-6 py-10 overflow-y-auto">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" style={{ opacity: 0.8 }} />
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
          <span className="font-body text-xs font-medium tracking-wide" style={{ color: 'var(--gold)' }}>✦ Zero Risk. 100% Reward.</span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
          className="font-display text-center leading-tight mb-2"
          style={{ fontSize: 34, fontWeight: 700, color: 'var(--text-primary)' }}
        >
          3 days{' '}
          <em className="not-italic italic" style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            completely free.
          </em>{' '}
          Then decide.
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          className="font-body text-sm text-center mb-7"
          style={{ color: 'var(--text-muted)' }}
        >
          No commitment. No credit card charge. No pressure.
        </motion.p>

        {/* Timeline */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="w-full rounded-2xl overflow-hidden mb-6"
          style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
        >
          {timeline.map((item, i) => (
            <div
              key={item.step}
              className="flex items-start gap-4 px-5 py-4"
              style={{ borderBottom: i < timeline.length - 1 ? '1px solid var(--glass-border)' : 'none' }}
            >
              <div className="flex flex-col items-center shrink-0 mt-0.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{
                    background: item.active ? 'rgba(200,164,90,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.active ? 'rgba(200,164,90,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {item.icon}
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.06)', minHeight: 12 }} />
                )}
              </div>
              <div className="flex-1 pb-1">
                <p className="font-body text-sm font-semibold" style={{ color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {item.step}
                </p>
                <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Guarantees grid */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="grid grid-cols-2 gap-3 w-full mb-8"
        >
          {guarantees.map((g) => (
            <div
              key={g.label}
              className="rounded-2xl p-4"
              style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl mb-3"
                style={{ background: `${g.color}18`, border: `1px solid ${g.color}30` }}
              >
                <g.icon className="h-4 w-4" style={{ color: g.color }} />
              </div>
              <p className="font-body text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{g.label}</p>
              <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{g.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Main CTA */}
        <motion.button
          variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(232,84,122,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer mb-3"
          style={{
            background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))',
            color: '#fff',
            boxShadow: '0 0 30px rgba(232,84,122,0.25)',
          }}
        >
          Start My Free Trial Now ✦
        </motion.button>

        <p className="font-body text-xs text-center" style={{ color: 'var(--text-faint)' }}>
          🔒 256-bit encrypted · No charge for 3 days · Cancel in 1 tap
        </p>
      </motion.div>
    </div>
  );
};

export default FreeTrialGuarantee;
