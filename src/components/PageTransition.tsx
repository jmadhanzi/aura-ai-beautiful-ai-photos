import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'default' | 'paywall';
}

const PageTransition = ({ children, variant = 'default' }: PageTransitionProps) => {
  const isPaywall = variant === 'paywall';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, ...(isPaywall && { scale: 0.97 }) }}
      animate={{ opacity: 1, y: 0, ...(isPaywall && { scale: 1 }) }}
      exit={{ opacity: 0, y: -10, ...(isPaywall && { scale: 0.98 }) }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
