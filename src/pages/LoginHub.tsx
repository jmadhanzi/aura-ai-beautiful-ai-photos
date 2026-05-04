import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Mail, Music2, Facebook } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';

const AppleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

type OAuthAction = 'google' | 'apple';
type Provider = {
  label: string;
  icon: React.FC;
  action?: OAuthAction;
  route?: string;
  priority?: boolean;
};

const providers: Provider[] = [
  { label: 'Continue with Google', icon: GoogleIcon, action: 'google', priority: true },
  { label: 'Continue with Apple', icon: AppleIcon, action: 'apple', priority: true },
  { label: 'Continue with Email', icon: Mail, route: '/login/email' },
  { label: 'Continue with Phone', icon: Smartphone, route: '/login/phone' },
  { label: 'Continue with TikTok', icon: Music2, route: '/login/tiktok' },
  { label: 'Continue with Facebook', icon: Facebook, route: '/login/facebook' },
];

const LoginHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: OAuthAction) => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) {
      toast({ title: 'Sign-in failed', description: String(result.error), variant: 'destructive' });
      setLoading(false);
      return;
    }
    if (!result.redirected) navigate('/paywall/1');
  };

  const handleClick = (p: Provider) => {
    if (p.action) handleOAuth(p.action);
    else if (p.route) navigate(p.route);
  };

  const priority = providers.filter(p => p.priority);
  const secondary = providers.filter(p => !p.priority);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-12 overflow-hidden">
      <div className="aurora-bg" style={{ opacity: 0.6 }}>
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="relative z-10 flex w-full max-w-sm flex-col items-center"
      >
        {/* Header */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          {/* Logo */}
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mb-1"
            style={{
              background: 'linear-gradient(135deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-bright) 100%)',
              boxShadow: '0 0 30px rgba(200,164,90,0.3)',
            }}
          >
            <span className="font-display text-3xl font-bold" style={{ color: 'var(--ink)', lineHeight: 1 }}>A</span>
          </div>
          <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome to AURA</h1>
          <p className="font-body text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            Sign in to unlock your AI beauty studio
          </p>
        </motion.div>

        {/* Priority providers */}
        <div className="flex flex-col gap-3 w-full mb-4">
          {priority.map((p, i) => (
            <motion.button
              key={p.label}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } } }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(p)}
              disabled={loading}
              className="flex items-center gap-3 rounded-2xl px-5 py-4 font-body font-medium transition-all disabled:opacity-50"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
              }}
            >
              <p.icon />
              <span className="text-sm">{loading ? 'Connecting…' : p.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.2 } } }}
          className="flex items-center gap-3 w-full mb-4"
        >
          <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          <span className="font-body text-xs" style={{ color: 'var(--text-faint)' }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
        </motion.div>

        {/* Secondary providers */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-8">
          {secondary.map((p, i) => (
            <motion.button
              key={p.label}
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.25 + i * 0.05 } } }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(p)}
              className="flex items-center justify-center gap-2 rounded-xl py-3 font-body text-sm transition-all"
              style={{ background: 'var(--void)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
            >
              <p.icon />
              <span className="text-xs">{p.label.replace('Continue with ', '')}</span>
            </motion.button>
          ))}
        </div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.5 } } }}
          className="font-body text-xs text-center"
          style={{ color: 'var(--text-faint)' }}
        >
          By continuing, you agree to our{' '}
          <span style={{ color: 'var(--gold)', cursor: 'pointer' }}>Terms</span>
          {' '}&amp;{' '}
          <span style={{ color: 'var(--gold)', cursor: 'pointer' }}>Privacy Policy</span>
        </motion.p>
      </motion.div>

      {/* Dev bypass */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            const store = useAppStore.getState();
            store.setCurrentUser({ id: 'dev-user', name: 'Dev User', email: 'dev@aura.app' });
            store.setIsProUser(true);
            store.setOnboardingComplete(true);
            navigate('/home', { replace: true });
          }}
          className="absolute bottom-6 right-5 rounded-lg px-3 py-1.5 text-[10px] font-mono opacity-25 hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(200,164,90,0.1)', border: '1px solid rgba(200,164,90,0.25)', color: 'var(--gold)' }}
        >
          DEV → /home
        </button>
      )}
    </div>
  );
};

export default LoginHub;
