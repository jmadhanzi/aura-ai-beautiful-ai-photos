import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { User, Crown, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Home, Search, FolderOpen, Settings } from 'lucide-react';

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
  const { isProUser, selectedPlan } = useAppStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: Shield, label: 'Privacy Policy', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-obsidian pb-20">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative px-6 pt-12 pb-6">
        <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
      </header>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 px-6 space-y-6">

        {/* Profile Card */}
        <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full flex items-center justify-center font-display font-bold text-lg text-obsidian shrink-0" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              currentUser?.name?.[0]?.toUpperCase() || 'A'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-display font-bold text-foreground truncate">
              {currentUser?.name || 'AURA User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.email || 'No email set'}
            </p>
          </div>
          <User className="h-5 w-5 text-muted-foreground shrink-0" />
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
                  <span className="text-xs text-emerald-400 font-body font-medium">✓ Active Trial</span>
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

        {/* App Version */}
        <motion.p variants={fadeUp} className="text-center text-[10px] text-muted-foreground pb-4">
          AURA v1.0.0 · Made with ✦
        </motion.p>
      </motion.div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 px-4" style={{ background: 'rgba(7,7,15,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
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
