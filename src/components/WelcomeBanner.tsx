import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import mascotImage from "@/assets/mascot-topglass.png";

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-sky-500 to-primary shadow-lg"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-3">
          {/* Mascot waving */}
          <motion.img
            src={mascotImage}
            alt="Mascotte Topglass"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
          
          {/* Welcome message */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-white font-medium text-sm md:text-base"
          >
            <span className="hidden md:inline">👋 Bienvenue chez Topglass ! </span>
            <span className="font-bold">Devis gratuit</span> et <span className="font-bold">franchise remboursée</span> sur tous nos services.
          </motion.p>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Fermer le bandeau"
          >
            <X className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
