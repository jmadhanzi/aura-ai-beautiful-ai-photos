import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Crown, Shield, HelpCircle, LogOut, ChevronRight, Home, Search, FolderOpen, Settings, Camera, Check, Pencil, Bell, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const planLabels: Record<string, string> = {
  weekly: '$4.99 / week',
  monthly: '$12.99 / month',
  annual: '$49.99 / year  ·  $4.17/mo',
};

const tabs = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Search, label: 'Explore', path: '/home' },
  { icon: FolderOpen, label: 'History', path: '/home' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { isProUser, selectedPlan, setCurrentUser } = useAppStore();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSaveName = async () => {
    if (!currentUser || !editName.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: editName.trim() }).eq('id', currentUser.id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to save name', variant: 'destructive' });
    } else {
      setCurrentUser({ ...currentUser, name: editName.trim() });
      toast({ title: 'Saved', description: 'Name updated successfully' });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast({ title: 'Invalid file', description: 'JPG, PNG, or WebP only', variant: 'destructive' }); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Too large', description: 'Max 5MB', variant: 'destructive' }); return;
    }
    setUploadingAvatar(true);
    const path = `${currentUser.id}/avatar_${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', currentUser.id);
      setCurrentUser({ ...currentUser, avatar: publicUrl });
      toast({ title: 'Photo updated' });
    } else {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    }
    setUploadingAvatar(false);
  };

  const menuItems = [
    { icon: Crown, label: 'Subscription', sub: isProUser ? `Pro · ${planLabels[selectedPlan] || ''}` : 'Free plan', color: 'var(--gold)', action: () => navigate('/paywall/5') },
    { icon: Bell, label: 'Notifications', sub: 'Manage push alerts', color: 'var(--violet)', action: () => {} },
    { icon: Palette, label: 'Appearance', sub: theme === 'dark' ? 'Dark mode' : 'Light mode', color: 'var(--rose)', action: toggleTheme },
    { icon: Shield, label: 'Privacy & Data', sub: 'On-device processing', color: 'var(--teal)', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', sub: 'Contact & FAQ', color: 'var(--gold-mid)', action: () => {} },
  ];

  return (
    <div className="flex min-h-screen flex-col pb-24" style={{ background: 'var(--ink)' }}>
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(200,164,90,0.05) 0%, transparent 70%)' }} />

      <header className="relative px-6 pt-14 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>Account</p>
        <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
      </header>

      <div className="flex-1 px-6 space-y-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5"
          style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center font-display font-bold text-2xl cursor-pointer overflow-hidden"
                style={{
                  background: currentUser?.avatar ? 'transparent' : 'linear-gradient(135deg, var(--gold-dim), var(--gold), var(--gold-bright))',
                  color: 'var(--ink)',
                  boxShadow: '0 0 20px rgba(200,164,90,0.2)',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {currentUser?.avatar
                  ? <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : (currentUser?.name?.[0]?.toUpperCase() || 'A')
                }
              </div>
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(5,5,9,0.6)' }}>
                  <div className="w-4 h-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
                style={{ background: 'var(--gold)', border: '2px solid var(--ink)' }}
              >
                <Camera className="h-2.5 w-2.5" style={{ color: 'var(--ink)' }} />
              </div>
            </div>

            {/* Name & email */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      className="flex-1 rounded-xl px-3 py-2 font-body text-sm outline-none"
                      style={{ background: 'rgba(200,164,90,0.08)', border: '1px solid rgba(200,164,90,0.3)', color: 'var(--text-primary)' }}
                    />
                    <button onClick={handleSaveName} disabled={saving}
                      className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--gold)' }}>
                      {saving ? <div className="w-3 h-3 border border-ink border-t-transparent rounded-full animate-spin" />
                        : <Check className="h-4 w-4" style={{ color: 'var(--ink)' }} />}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2">
                    <p className="font-body font-semibold truncate" style={{ color: 'var(--text-primary)', fontSize: 15 }}>
                      {currentUser?.name || 'Your Name'}
                    </p>
                    <button onClick={() => setEditing(true)}>
                      <Pencil className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="font-body text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{currentUser?.email}</p>
            </div>
          </div>

          {/* Pro status */}
          {isProUser && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{ background: 'rgba(200,164,90,0.08)', border: '1px solid rgba(200,164,90,0.2)' }}
            >
              <Crown className="h-4 w-4" style={{ color: 'var(--gold)' }} />
              <span className="font-body text-sm font-medium" style={{ color: 'var(--gold)' }}>Pro Member</span>
              <span className="ml-auto font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{planLabels[selectedPlan]}</span>
            </div>
          )}
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
        >
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="flex items-center gap-4 w-full px-5 py-4 text-left transition-colors"
              style={{ borderBottom: i < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
                <item.icon className="h-4 w-4" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                <p className="font-body text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0" style={{ color: 'var(--text-faint)' }} />
            </motion.button>
          ))}
        </motion.div>

        {/* Sign out */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-body text-sm font-medium"
          style={{ background: 'rgba(232,84,122,0.07)', border: '1px solid rgba(232,84,122,0.18)', color: 'var(--rose)' }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </motion.button>

        <p className="font-mono text-center text-[10px]" style={{ color: 'var(--text-faint)' }}>
          AURA v2.0.0 · Made with ♥
        </p>
      </div>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-4 px-4"
        style={{ background: 'var(--navbar-bg)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}
      >
        {tabs.map((tab) => {
          const active = tab.label === 'Settings';
          return (
            <motion.button
              key={tab.label}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 relative px-3"
            >
              <tab.icon className="h-5 w-5 transition-colors" style={{ color: active ? 'var(--gold)' : 'var(--text-faint)' }} />
              <span className="font-body text-[10px]" style={{ color: active ? 'var(--gold)' : 'var(--text-faint)', fontWeight: active ? 600 : 400 }}>
                {tab.label}
              </span>
              {active && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsScreen;
