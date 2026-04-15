import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { ArrowLeft, Shield } from 'lucide-react';

const TikTokIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M22.2 8.6A5.6 5.6 0 0 1 18.8 4h-3.6v17.2a3.4 3.4 0 1 1-2.4-3.26V14.3a7 7 0 1 0 6 6.92V13.4a9.2 9.2 0 0 0 5.4 1.74V11.5a5.6 5.6 0 0 1-2-2.9Z" fill="white"/>
  </svg>
);

const QrGrid = () => {
  const pattern = [
    [1,1,1,0,1,1,1],
    [1,0,1,0,1,0,1],
    [1,1,1,0,1,1,1],
    [0,0,0,1,0,0,0],
    [1,1,1,0,1,1,1],
    [1,0,1,0,1,0,1],
    [1,1,1,0,1,1,1],
  ];
  return (
    <div className="grid grid-cols-7 gap-[3px]" style={{ width: 100, height: 100 }}>
      {pattern.flat().map((cell, i) => (
        <div
          key={i}
          className="rounded-[2px]"
          style={{
            backgroundColor: cell ? '#111' : '#fff',
            width: '100%',
            aspectRatio: '1',
          }}
        />
      ))}
    </div>
  );
};

const inputClass =
  "w-full rounded-xl bg-surface border border-border px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-[rgba(201,168,76,0.5)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]";

const TikTokLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-obsidian px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col items-center"
      >
        {/* Platform header */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#000',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            <TikTokIcon />
          </div>
          <h1 className="font-display text-[22px] font-bold text-foreground">Sign in with TikTok</h1>
          <p className="text-center text-sm text-muted-foreground max-w-xs">
            Scan the QR code in the TikTok app, or enter your username
          </p>
        </motion.div>

        {/* QR Code card */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-sm rounded-2xl p-6 flex flex-col items-center gap-4 mb-6"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="rounded-xl bg-white p-3">
            <QrGrid />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Open TikTok → Profile → Scan QR Code
          </p>
        </motion.div>

        {/* OR divider */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 w-full max-w-sm mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">or use username</span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Form */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4 w-full max-w-sm mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground font-body">TikTok Username</label>
            <input type="text" placeholder="@your_username" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground font-body">Password</label>
            <input type="password" placeholder="••••••••" className={inputClass} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={fadeUp}
          onClick={() => navigate('/paywall/1')}
          className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-base font-semibold text-obsidian transition-transform active:scale-95"
        >
          Connect TikTok Account →
        </motion.button>

        {/* Trust note */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 mt-6 max-w-xs">
          <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            We only access your public profile info. We never post without permission.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TikTokLogin;
