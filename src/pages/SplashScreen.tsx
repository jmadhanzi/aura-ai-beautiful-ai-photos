import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuraLogo from '@/components/AuraLogo';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding/1'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 animate-[auroraShift_6s_ease-in-out_infinite_alternate]" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 10%, rgba(201,168,76,var(--aurora-gold-opacity)) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 15% 90%, rgba(139,92,246,var(--aurora-violet-opacity)) 0%, transparent 55%),
          radial-gradient(ellipse 45% 50% at 85% 50%, rgba(0,229,195,var(--aurora-mint-opacity)) 0%, transparent 55%)
        `,
      }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AuraLogo />
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-display text-[42px] font-bold"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C, #FFE099)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.15em',
          }}
        >
          AURA
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-body"
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: 'var(--tagline-color)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          Your Face. Perfected by AI.
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-2 mt-4"
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="rounded-full animate-[dotPulse_1s_ease-in-out_infinite]"
              style={{
                width: 5,
                height: 5,
                backgroundColor: '#C9A84C',
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
