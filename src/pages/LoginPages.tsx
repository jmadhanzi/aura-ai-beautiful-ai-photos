import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp } from '@/design-system/animations';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage = ({ title, fields }: { title: string; fields: { label: string; type: string; placeholder: string }[] }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-obsidian px-6 py-8">
      <button onClick={() => navigate('/login')} className="mb-8 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" /> Back
      </button>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">{f.label}</label>
            <Input type={f.type} placeholder={f.placeholder} className="bg-surface border-border" />
          </div>
        ))}
        <Button
          onClick={() => navigate('/paywall/1')}
          className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 font-semibold text-obsidian hover:opacity-90"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export const TikTokLogin = () => <LoginPage title="Sign in with TikTok" fields={[{ label: 'Username', type: 'text', placeholder: '@username' }]} />;
export const FacebookLogin = () => <LoginPage title="Sign in with Facebook" fields={[{ label: 'Email', type: 'email', placeholder: 'you@example.com' }, { label: 'Password', type: 'password', placeholder: '••••••••' }]} />;
export const InstagramLogin = () => <LoginPage title="Sign in with Instagram" fields={[{ label: 'Username', type: 'text', placeholder: '@username' }]} />;
export const PhoneLogin = () => <LoginPage title="Sign in with Phone" fields={[{ label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' }]} />;
export const EmailLogin = () => <LoginPage title="Sign in with Email" fields={[{ label: 'Email', type: 'email', placeholder: 'you@example.com' }, { label: 'Password', type: 'password', placeholder: '••••••••' }]} />;
