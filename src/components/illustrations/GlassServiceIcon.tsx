import { motion } from "framer-motion";

interface GlassServiceIconProps {
  isSelected?: boolean;
  className?: string;
}

const GlassServiceIcon = ({ isSelected = false, className = "" }: GlassServiceIconProps) => {
  const primaryColor = isSelected ? "#ffffff" : "#374151";
  const secondaryColor = isSelected ? "rgba(255,255,255,0.6)" : "#9ca3af";
  const glassColor = isSelected ? "rgba(255,255,255,0.3)" : "rgba(14, 165, 233, 0.2)";
  const glassStroke = isSelected ? "#ffffff" : "#0ea5e9";

  return (
    <svg viewBox="0 0 80 80" className={`w-16 h-16 ${className}`} xmlns="http://www.w3.org/2000/svg">
      {/* Cadre du pare-brise */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
        d="M15 55 L20 25 Q22 15 35 12 L45 12 Q58 15 60 25 L65 55"
        fill="none"
        stroke={primaryColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Vitre avec effet de transparence */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        d="M18 52 L22 27 Q24 19 35 16 L45 16 Q56 19 58 27 L62 52 Z"
        fill={glassColor}
        stroke={glassStroke}
        strokeWidth="2"
      />

      {/* Reflet sur la vitre */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        d="M25 22 L30 22 L27 42 L23 42 Z"
        fill={isSelected ? "white" : "#e0f2fe"}
      />

      {/* Impact/fissure (symbolique) */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6, type: "spring" }}
      >
        <circle cx="45" cy="35" r="4" fill="none" stroke={secondaryColor} strokeWidth="1.5" />
        <line x1="45" y1="31" x2="45" y2="25" stroke={secondaryColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="48" y1="33" x2="53" y2="30" stroke={secondaryColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="49" y1="37" x2="54" y2="40" stroke={secondaryColor} strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      {/* Base */}
      <motion.line
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        x1="12"
        y1="58"
        x2="68"
        y2="58"
        stroke={primaryColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default GlassServiceIcon;
