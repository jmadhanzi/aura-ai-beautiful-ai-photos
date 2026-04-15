import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { Wand2, Palette, Layers } from 'lucide-react';

const features = [
  { icon: Wand2, title: 'AI Enhancement', desc: 'One-tap photo perfection', color: 'text-gold' },
  { icon: Palette, title: 'Style Transfer', desc: 'Apply artistic styles instantly', color: 'text-rose' },
  { icon: Layers, title: 'Smart Layers', desc: 'Advanced editing made simple', color: 'text-mint' },
];

const OnboardingFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-obsidian px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col items-center justify-center gap-8"
      >
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-foreground text-center">
          Everything You Need
        </motion.h2>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -2 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(201,168,76,0.06)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card">
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <div>
                <h3 className="font-body font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/login')}
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-r from-gold to-gold-light py-4 font-body text-lg font-semibold text-obsidian overflow-hidden"
      >
        <span className="relative z-10">Continue</span>
        <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
      </motion.button>
    </div>
  );
};

export default OnboardingFeatures;
