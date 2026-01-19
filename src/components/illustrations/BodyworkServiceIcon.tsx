import { motion } from "framer-motion";

interface BodyworkServiceIconProps {
  isSelected?: boolean;
  className?: string;
}

const BodyworkServiceIcon = ({ isSelected = false, className = "" }: BodyworkServiceIconProps) => {
  const primaryColor = isSelected ? "#ffffff" : "#374151";
  const secondaryColor = isSelected ? "rgba(255,255,255,0.6)" : "#9ca3af";
  const accentColor = isSelected ? "#ffffff" : "#f97316";

  return (
    <svg viewBox="0 0 80 80" className={`w-16 h-16 ${className}`} xmlns="http://www.w3.org/2000/svg">
      {/* Carrosserie de voiture stylisée */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
        d="M10 45 L15 45 L20 30 Q22 25 30 25 L50 25 Q58 25 60 30 L65 45 L70 45"
        fill="none"
        stroke={primaryColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Ligne de base */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        d="M12 48 L25 48 M40 48 L55 48 M68 48 L68 48"
        fill="none"
        stroke={primaryColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Roues */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4, type: "spring" }}
      >
        <circle cx="27" cy="50" r="8" fill={primaryColor} />
        <circle cx="27" cy="50" r="4" fill={secondaryColor} />
      </motion.g>
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5, type: "spring" }}
      >
        <circle cx="53" cy="50" r="8" fill={primaryColor} />
        <circle cx="53" cy="50" r="4" fill={secondaryColor} />
      </motion.g>

      {/* Étoile d'impact / dommage */}
      <motion.g
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
      >
        <circle cx="45" cy="35" r="6" fill="none" stroke={accentColor} strokeWidth="2" />
        <line x1="45" y1="29" x2="45" y2="24" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="51" y1="35" x2="56" y2="35" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="41" x2="45" y2="46" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="39" y1="35" x2="34" y2="35" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* Outil / clé */}
      <motion.g
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <path
          d="M60 60 L65 55 L70 58 L68 63 L60 65 Z"
          fill={secondaryColor}
          stroke={primaryColor}
          strokeWidth="1.5"
        />
        <rect x="55" y="62" width="8" height="4" rx="1" fill={primaryColor} transform="rotate(-20 59 64)" />
      </motion.g>
    </svg>
  );
};

export default BodyworkServiceIcon;
