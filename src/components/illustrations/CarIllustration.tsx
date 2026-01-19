import { motion } from "framer-motion";

interface CarIllustrationProps {
  className?: string;
  highlightWindshield?: boolean;
}

const CarIllustration = ({ className = "", highlightWindshield = true }: CarIllustrationProps) => {
  return (
    <svg
      viewBox="0 0 500 280"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ombre sous la voiture */}
      <ellipse cx="250" cy="260" rx="180" ry="15" fill="rgba(0,0,0,0.1)" />

      {/* Corps de la voiture - Base */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M60 180 
           L60 160 
           Q60 140 80 140 
           L100 140 
           L120 100 
           Q130 80 160 80 
           L340 80 
           Q370 80 380 100 
           L400 140 
           L420 140 
           Q440 140 440 160 
           L440 180"
        fill="none"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Ligne de carrosserie inférieure */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        d="M60 180 
           Q60 200 80 200 
           L130 200 
           Q140 200 140 195 
           L140 180"
        fill="none"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        d="M180 180 
           L180 195 
           Q180 200 190 200 
           L310 200 
           Q320 200 320 195 
           L320 180"
        fill="none"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        d="M360 180 
           L360 195 
           Q360 200 370 200 
           L420 200 
           Q440 200 440 180"
        fill="none"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Pare-brise (avec effet de verre) */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        d="M140 100 
           L160 80 
           Q165 75 175 75 
           L260 75 
           Q270 75 275 80 
           L295 100 
           Q298 105 295 110 
           L290 130 
           Q287 140 275 140 
           L160 140 
           Q148 140 145 130 
           L140 110 
           Q137 105 140 100 Z"
        fill={highlightWindshield ? "rgba(14, 165, 233, 0.15)" : "rgba(200, 220, 240, 0.3)"}
        stroke={highlightWindshield ? "#0ea5e9" : "#9ca3af"}
        strokeWidth={highlightWindshield ? "3" : "2"}
      />

      {/* Reflet sur le pare-brise */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8, delay: 1 }}
        d="M155 85 L175 85 L165 120 L150 120 Z"
        fill="white"
      />

      {/* Vitre latérale arrière */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        d="M300 100 
           L320 100 
           Q335 100 345 115 
           L360 140 
           L300 140 Z"
        fill="rgba(200, 220, 240, 0.3)"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Montant central */}
      <motion.line
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        x1="295"
        y1="100"
        x2="295"
        y2="140"
        stroke="#374151"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Phares avant */}
      <motion.ellipse
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        cx="90"
        cy="155"
        rx="15"
        ry="12"
        fill="#fef3c7"
        stroke="#374151"
        strokeWidth="2"
      />
      <motion.ellipse
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        cx="90"
        cy="155"
        rx="8"
        ry="6"
        fill="#fcd34d"
      />

      {/* Phares arrière */}
      <motion.rect
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        x="425"
        y="148"
        width="12"
        height="20"
        rx="3"
        fill="#fecaca"
        stroke="#374151"
        strokeWidth="2"
      />
      <motion.rect
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
        x="428"
        y="152"
        width="6"
        height="12"
        rx="2"
        fill="#ef4444"
      />

      {/* Roue avant */}
      <motion.g
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 1.4, type: "spring" }}
      >
        <circle cx="160" cy="200" r="35" fill="#1f2937" stroke="#374151" strokeWidth="3" />
        <circle cx="160" cy="200" r="28" fill="#374151" />
        <circle cx="160" cy="200" r="20" fill="#6b7280" />
        <circle cx="160" cy="200" r="8" fill="#9ca3af" />
        {/* Rayons de la jante */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <line
            key={i}
            x1={160 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={200 + 10 * Math.sin((angle * Math.PI) / 180)}
            x2={160 + 18 * Math.cos((angle * Math.PI) / 180)}
            y2={200 + 18 * Math.sin((angle * Math.PI) / 180)}
            stroke="#9ca3af"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      {/* Roue arrière */}
      <motion.g
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 1.5, type: "spring" }}
      >
        <circle cx="340" cy="200" r="35" fill="#1f2937" stroke="#374151" strokeWidth="3" />
        <circle cx="340" cy="200" r="28" fill="#374151" />
        <circle cx="340" cy="200" r="20" fill="#6b7280" />
        <circle cx="340" cy="200" r="8" fill="#9ca3af" />
        {/* Rayons de la jante */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <line
            key={i}
            x1={340 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={200 + 10 * Math.sin((angle * Math.PI) / 180)}
            x2={340 + 18 * Math.cos((angle * Math.PI) / 180)}
            y2={200 + 18 * Math.sin((angle * Math.PI) / 180)}
            stroke="#9ca3af"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      {/* Rétroviseur */}
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.6 }}
        d="M140 110 L125 115 L125 125 L140 120"
        fill="#374151"
        stroke="#374151"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Poignée de porte */}
      <motion.rect
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, delay: 1.7 }}
        x="200"
        y="135"
        width="25"
        height="6"
        rx="3"
        fill="#9ca3af"
      />

      {/* Ligne de design sur la carrosserie */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        d="M100 165 Q250 155 400 165"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CarIllustration;
