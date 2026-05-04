import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import AuraLogo from '@/components/AuraLogo';
import { useAppStore } from '@/store/useAppStore';

const DEV_BYPASS = import.meta.env.DEV;

const SplashScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const devBypass = useCallback(() => {
    const { setCurrentUser, setIsProUser, setOnboardingComplete } = useAppStore.getState();
    setCurrentUser({ id: 'dev-user', name: 'Dev User', email: 'dev@aura.app' });
    setIsProUser(true);
    setOnboardingComplete(true);
    navigate('/home', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (DEV_BYPASS && searchParams.get('dev') === '1') {
      devBypass();
      return;
    }
    const timer = setTimeout(() => navigate('/onboarding/1'), 2800);
    return () => clearTimeout(timer);
  }, [devBypass, navigate, searchParams]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--ink)' }}>
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
        <div className="aurora-blob aurora-mint" />
      </div>

      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 w-12 h-12 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-6 h-px bg-gold" />
        <div className="absolute top-0 left-0 w-px h-6 bg-gold" />
      </div>
      <div className="absolute top-8 right-8 w-12 h-12 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-6 h-px bg-gold" />
        <div className="absolute top-0 right-0 w-px h-6 bg-gold" />
      </div>
      <div className="absolute bottom-8 left-8 w-12 h-12 pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-0 w-6 h-px bg-gold" />
        <div className="absolute bottom-0 left-0 w-px h-6 bg-gold" />
      </div>
      <div className="absolute bottom-8 right-8 w-12 h-12 pointer-events-none opacity-20">
        <div className="absolute bottom-0 right-0 w-6 h-px bg-gold" />
        <div className="absolute bottom-0 right-0 w-px h-6 bg-gold" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <AuraLogo />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2"
        >
          <h1
            className="font-display"
            style={{
              fontSize: 52,
              fontWeight: 600,
              letterSpacing: '0.22em',
              background: 'linear-gradient(135deg, var(--gold-dim) 0%, var(--gold) 35%, var(--gold-bright) 55%, var(--gold) 75%, var(--gold-dim) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AURA
          </h1>
          <p
            className="font-body"
            style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--tagline-color)' }}
          >
            AI Beauty Studio
          </p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-32 h-px rounded-full overflow-hidden" style={{ background: 'rgba(200,164,90,0.15)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-bright))' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="flex gap-1.5">
            {[0, 0.18, 0.36].map((delay, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 4, height: 4,
                  background: 'var(--gold)',
                  animation: `dotPulse 1.1s ease-in-out infinite ${delay}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dev bypass */}
      {DEV_BYPASS && (
        <button
          onClick={devBypass}
          className="absolute bottom-8 right-6 z-20 rounded-lg px-3 py-1.5 text-[10px] font-mono opacity-30 hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(200,164,90,0.1)', border: '1px solid rgba(200,164,90,0.25)', color: 'var(--gold)' }}
        >
          DEV → /home
        </button>
      )}
    </div>
  );
};

export default SplashScreen;
