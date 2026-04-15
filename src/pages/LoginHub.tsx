import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Smartphone, Mail, Music2, Facebook, Instagram } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const providers = [
  { label: 'Continue with Google', icon: GoogleIcon, action: 'google' as const, bg: 'bg-surface' },
  { label: 'Continue with TikTok', icon: Music2, route: '/login/tiktok', bg: 'bg-surface' },
  { label: 'Continue with Facebook', icon: Facebook, route: '/login/facebook', bg: 'bg-surface' },
  { label: 'Continue with Instagram', icon: Instagram, route: '/login/instagram', bg: 'bg-surface' },
  { label: 'Continue with Phone', icon: Smartphone, route: '/login/phone', bg: 'bg-surface' },
  { label: 'Continue with Email', icon: Mail, route: '/login/email', bg: 'bg-surface' },
];

const LoginHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast({ title: 'Error', description: String(result.error), variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (result.redirected) {
      return;
    }

    // Session set, navigate
    navigate('/paywall/1');
  };

  const handleClick = (p: (typeof providers)[number]) => {
    if ('action' in p && p.action === 'google') {
      handleGoogleSignIn();
    } else if ('route' in p && p.route) {
      navigate(p.route);
    }
  };

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
            onClick={() => handleClick(p)}
            disabled={p.action === 'google' && loading}
            className={`flex w-full items-center gap-3 rounded-xl ${p.bg} border border-border px-5 py-3.5 font-body font-medium text-foreground transition-colors hover:bg-card disabled:opacity-50`}
          >
            <p.icon className="h-5 w-5 text-muted-foreground" />
            <span>{p.action === 'google' && loading ? 'Connecting...' : p.label}</span>
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
