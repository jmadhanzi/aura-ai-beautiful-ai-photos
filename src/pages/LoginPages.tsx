import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp } from '@/design-system/animations';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Phone Login with OTP
export const PhoneLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setOtpSent(true);
      toast({ title: 'Code sent', description: 'Check your phone for the verification code.' });
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      navigate('/paywall/1');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-obsidian px-6 py-8">
      <button onClick={() => navigate('/login')} className="mb-8 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" /> Back
      </button>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Sign in with Phone</h1>
        {!otpSent ? (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Phone Number</label>
              <Input type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-surface border-border" />
            </div>
            <Button onClick={sendOtp} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 font-semibold text-obsidian hover:opacity-90">
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Verification Code</label>
              <Input type="text" placeholder="123456" value={token} onChange={(e) => setToken(e.target.value)} className="bg-surface border-border" />
            </div>
            <Button onClick={verifyOtp} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 font-semibold text-obsidian hover:opacity-90">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Email Login with sign in / sign up
export const EmailLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Account created', description: 'Check your email to confirm your account.' });
        navigate('/paywall/1');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        navigate('/paywall/1');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-obsidian px-6 py-8">
      <button onClick={() => navigate('/login')} className="mb-8 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" /> Back
      </button>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{isSignUp ? 'Create Account' : 'Sign in with Email'}</h1>
        {isSignUp && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Full Name</label>
            <Input type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-surface border-border" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Email</label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface border-border" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Password</label>
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-surface border-border" />
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 font-semibold text-obsidian hover:opacity-90">
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground text-center hover:text-foreground transition-colors">
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </motion.div>
    </div>
  );
};

// OAuth placeholder pages
const OAuthPlaceholder = ({ title, provider }: { title: string; provider: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen flex-col bg-obsidian px-6 py-8">
      <button onClick={() => navigate('/login')} className="mb-8 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" /> Back
      </button>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col gap-6 items-center text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          {provider} OAuth requires additional configuration. Please use Email or Phone sign-in for now.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 font-semibold text-obsidian hover:opacity-90">
          Back to Login Options
        </Button>
      </motion.div>
    </div>
  );
};

export const FacebookLogin = () => <OAuthPlaceholder title="Sign in with Facebook" provider="Facebook" />;
export const InstagramLogin = () => <OAuthPlaceholder title="Sign in with Instagram" provider="Instagram" />;
