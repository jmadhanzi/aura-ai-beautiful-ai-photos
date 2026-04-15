import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Camera, Wand2, Sparkles, Image, Settings, User } from 'lucide-react';

const tools = [
  { icon: Wand2, label: 'Enhance', color: 'text-gold' },
  { icon: Sparkles, label: 'AI Style', color: 'text-violet' },
  { icon: Image, label: 'Filters', color: 'text-rose' },
  { icon: Camera, label: 'Retouch', color: 'text-mint' },
];

const HomeScreen = () => {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">AURA</h1>
          <p className="text-xs text-muted-foreground font-mono">AI Photo Editor</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Upload Area */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 px-6 py-4"
      >
        <motion.div
          variants={fadeUp}
          className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gold/30 bg-gold/5"
        >
          <Camera className="h-12 w-12 text-gold" />
          <p className="font-body font-medium text-foreground">Tap to upload a photo</p>
          <p className="text-xs text-muted-foreground">or take a new one</p>
        </motion.div>

        {/* Tools */}
        <motion.div variants={fadeUp} className="mt-8">
          <h3 className="font-body font-semibold text-foreground mb-4">AI Tools</h3>
          <div className="grid grid-cols-4 gap-3">
            {tools.map((t) => (
              <button key={t.label} className="flex flex-col items-center gap-2 rounded-2xl bg-surface border border-border p-4 transition-colors hover:bg-card">
                <t.icon className={`h-6 w-6 ${t.color}`} />
                <span className="text-xs text-muted-foreground">{t.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent */}
        <motion.div variants={fadeUp} className="mt-8">
          <h3 className="font-body font-semibold text-foreground mb-4">Recent Edits</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-surface border border-border" />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
