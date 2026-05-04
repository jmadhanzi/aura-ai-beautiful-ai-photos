import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -48 }} animate={{ y: 0 }} exit={{ y: -48 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-3 px-4"
          style={{ background: 'rgba(232,84,122,0.95)', backdropFilter: 'blur(12px)' }}
        >
          <WifiOff className="h-4 w-4 text-white" />
          <span className="font-body text-sm font-semibold text-white">You're offline — some features may be unavailable</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
