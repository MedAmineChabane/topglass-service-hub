import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, FileText, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import mascotImage from '@/assets/mascot-topglass.png';

const MascotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on admin and auth pages
  const hiddenPaths = ['/admin', '/auth'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

  // Delay appearance for better UX
  useEffect(() => {
    if (!shouldHide) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldHide]);

  if (shouldHide || !isVisible) return null;

  const handleDevisClick = () => {
    setIsOpen(false);
    navigate('/devis');
  };

  return (
    <>
      {/* Backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Widget Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Options Bubble */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl border border-primary/20 overflow-hidden mb-2"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-3 flex items-center justify-between">
                <span className="text-white font-bold text-sm">Assistance Topglass</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Welcome message */}
              <div className="px-5 py-3 bg-primary/5 border-b border-border">
                <p className="text-sm text-foreground">
                  👋 <span className="font-semibold">Bienvenue chez Topglass !</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Votre assistant pour vos demandes de vitrage, litiges ou questions.
                </p>
              </div>

              {/* Options */}
              <div className="p-3 space-y-2">
                <button
                  onClick={handleDevisClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Devis gratuit</p>
                    <p className="text-xs text-muted-foreground">Estimation en 24h</p>
                  </div>
                </button>

                <a
                  href="tel:0465849498"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Appeler maintenant</p>
                    <p className="text-xs text-muted-foreground">04 65 84 94 98</p>
                  </div>
                </a>
              </div>

              {/* Footer message */}
              <div className="px-5 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  🚗 Intervention rapide partout en France
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.3
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95, rotate: -5 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-2xl border-4 border-white overflow-hidden group cursor-pointer"
          style={{
            boxShadow: '0 8px 32px rgba(255, 102, 0, 0.4), 0 0 0 4px rgba(255, 102, 0, 0.1)'
          }}
        >
          {/* Mascot Image */}
          <motion.img
            src={mascotImage}
            alt="Assistant Topglass"
            className="w-full h-full object-cover"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Pulse ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary"
            animate={{
              scale: [1, 1.3, 1.3],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />

          {/* Notification badge */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            >
              <span className="text-white text-xs font-bold">?</span>
            </motion.div>
          )}
        </motion.button>

        {/* Tooltip on first load */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 }}
            className="absolute bottom-24 right-0 bg-white rounded-xl shadow-xl px-4 py-2 border border-primary/20 whitespace-nowrap"
          >
            <p className="text-sm font-medium text-foreground">Besoin d'aide ? 👋</p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-primary/20 transform rotate-45" />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MascotWidget;
