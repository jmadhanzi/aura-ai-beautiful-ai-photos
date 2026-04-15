import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Smartphone, Mail, Music2, Facebook, Instagram } from 'lucide-react';

const providers = [
  { label: 'Continue with TikTok', icon: Music2, route: '/login/tiktok', bg: 'bg-surface' },
  { label: 'Continue with Facebook', icon: Facebook, route: '/login/facebook', bg: 'bg-surface' },
  { label: 'Continue with Instagram', icon: Instagram, route: '/login/instagram', bg: 'bg-surface' },
  { label: 'Continue with Phone', icon: Smartphone, route: '/login/phone', bg: 'bg-surface' },
  { label: 'Continue with Email', icon: Mail, route: '/login/email', bg: 'bg-surface' },
];

const LoginHub = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex w-full max-w-sm flex-col items-center gap-6"
      >
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-2 mb-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-obsidian">A</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome to AURA</h1>
          <p className="text-sm text-muted-foreground">Sign in to unlock AI editing</p>
        </motion.div>

        {providers.map((p, i) => (
          <motion.button
            key={p.label}
            variants={fadeUp}
            custom={i}
            whileHover={{ x: 4 }}
            whileTap={{ x: 2, scale: 0.98 }}
            onClick={() => navigate(p.route)}
            className={`flex w-full items-center gap-3 rounded-xl ${p.bg} border border-border px-5 py-3.5 font-body font-medium text-foreground transition-colors hover:bg-card`}
          >
            <p.icon className="h-5 w-5 text-muted-foreground" />
            <span>{p.label}</span>
          </motion.button>
        ))}

        <motion.p variants={fadeUp} className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginHub;
