import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Crown, Shield, HelpCircle, LogOut, ChevronRight, Home, Search, FolderOpen, Settings, Camera, X, Check, Pencil, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const planLabels: Record<string, string> = {
  weekly: '$4.99/week',
  monthly: '$12.99/month',
  annual: '$49.99/year ($4.17/mo)',
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
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editName.trim() })
      .eq('id', currentUser.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update name', variant: 'destructive' });
    } else {
      setCurrentUser({ ...currentUser, name: editName.trim() });
      toast({ title: 'Updated', description: 'Your name has been saved' });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast({ title: 'Invalid file', description: 'Please select a JPG, PNG, or WebP image', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB', variant: 'destructive' });
      return;
    }

    setUploadingAvatar(true);
    const filePath = `${currentUser.id}/avatar_${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploadingAvatar(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', currentUser.id);

    if (updateError) {
      toast({ title: 'Error', description: 'Failed to save avatar', variant: 'destructive' });
    } else {
      setCurrentUser({ ...currentUser, avatar: publicUrl });
      toast({ title: 'Updated', description: 'Avatar saved' });
    }
    setUploadingAvatar(false);
  };

  const startEditing = () => {
    setEditName(currentUser?.name || '');
    setEditing(true);
  };

  const menuItems = [
    { icon: Shield, label: 'Privacy Policy', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-obsidian pb-20">
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, var(--glow-top) 0%, transparent 70%)` }} />

      <header className="relative px-6 pt-12 pb-6">
        <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
      </header>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 px-6 space-y-6">

        {/* Profile Card */}
        <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-4">
            {/* Avatar with upload overlay */}
            <div className="relative shrink-0">
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleAvatarChange} />
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center font-display font-bold text-lg text-obsidian cursor-pointer overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? (
                  <div className="h-5 w-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                ) : currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  currentUser?.name?.[0]?.toUpperCase() || 'A'
                )}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-3 w-3 text-obsidian" />
              </div>
            </div>

            {/* Name (view or edit) */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={100}
                      autoFocus
                      className="flex-1 bg-transparent text-base font-display font-bold text-foreground outline-none border-b border-gold/40 pb-0.5"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <button onClick={handleSaveName} disabled={saving} className="h-7 w-7 rounded-full flex items-center justify-center bg-gold/20">
                      <Check className="h-3.5 w-3.5 text-gold" />
                    </button>
                    <button onClick={() => setEditing(false)} className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-display font-bold text-foreground truncate">
                        {currentUser?.name || 'AURA User'}
                      </p>
                      <button onClick={startEditing} className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {currentUser?.email || 'No email set'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Subscription Card */}
        <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.25)' }}>
          <div className="p-5" style={{ background: isProUser ? 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)' : 'rgba(26,26,46,1)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Crown className={`h-5 w-5 ${isProUser ? 'text-gold' : 'text-muted-foreground'}`} />
              <span className="text-sm font-display font-bold text-foreground">
                {isProUser ? 'AURA Pro' : 'Free Plan'}
              </span>
              {isProUser && (
                <span className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-body font-semibold text-obsidian bg-gradient-to-r from-gold to-gold-light">
                  ACTIVE
                </span>
              )}
            </div>

            {isProUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Plan</span>
                  <span className="text-xs text-foreground font-body font-medium">{planLabels[selectedPlan] || selectedPlan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Status</span>
                  <span className="text-xs font-body font-medium" style={{ color: '#34D399' }}>✓ Active Trial</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Features</span>
                  <span className="text-xs text-foreground font-body font-medium">All 50+ tools unlocked</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-body">Unlock all 50+ AI tools, unlimited exports, and priority processing.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/paywall/1')}
                  className="relative w-full rounded-xl py-3 text-sm font-body font-semibold text-obsidian bg-gradient-to-r from-gold to-gold-light overflow-hidden"
                >
                  <span className="relative z-10">✦ Upgrade to Pro</span>
                  <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div variants={fadeUp} className="glass-card rounded-2xl p-4 flex items-center gap-3">
          {theme === 'dark' ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-gold" />}
          <span className="flex-1 text-sm font-body font-medium text-foreground">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className="relative h-7 w-12 rounded-full transition-colors duration-300"
            style={{ background: theme === 'dark' ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.5)' }}
          >
            <motion.div
              className="absolute top-0.5 h-6 w-6 rounded-full"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
              animate={{ left: theme === 'dark' ? '2px' : '22px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </motion.div>

        {/* Menu Items */}
        <motion.div variants={fadeUp} className="space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              onClick={item.action}
              className="flex w-full items-center gap-3 rounded-2xl p-4 glass-card transition-all"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-body font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={fadeUp}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-body font-semibold transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </motion.button>
        </motion.div>

        <motion.p variants={fadeUp} className="text-center text-[10px] text-muted-foreground pb-4">
          AURA v1.0.0 · Made with ✦
        </motion.p>
      </motion.div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 px-4" style={{ background: 'var(--navbar-bg)', borderTop: `1px solid var(--subtle-border)`, backdropFilter: 'blur(20px)' }}>
        {tabs.map((tab) => {
          const active = tab.label === 'Settings';
          return (
            <motion.button
              key={tab.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1"
            >
              <tab.icon className={`h-5 w-5 ${active ? 'text-gold' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-body ${active ? 'text-gold font-semibold' : 'text-muted-foreground'}`}>{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsScreen;
