import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Clock, MapPin, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.png";

const Hero = () => {
  const navigate = useNavigate();

  const goToDevis = () => {
    navigate("/devis");
  };

  const features = [
    { icon: Shield, text: "Agréé toutes assurances" },
    { icon: Clock, text: "Intervention rapide" },
    { icon: MapPin, text: "Partout en France" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-40 md:pt-44 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8"
          >
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">N°1 du remplacement de pare-brise</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            style={{
              textShadow: '2px 2px 0 rgba(0,0,0,0.8), -2px -2px 0 rgba(0,0,0,0.8), 2px -2px 0 rgba(0,0,0,0.8), -2px 2px 0 rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.5)'
            }}
          >
            <span className="text-white">Top</span>
            <span className="text-sky-500">glass</span>
            <span className="text-white"> : Remplacement Pare-Brise à{" "}</span>
            <span className="text-sky-500">Marseille</span>
            <span className="text-white"> & Partout en France</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md"
          >
            Intervention rapide, franchise remboursée, zéro avance de frais. 
            Nos techniciens certifiés se déplacent chez vous.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Button
              onClick={goToDevis}
              size="lg"
              className="gradient-cta text-primary-foreground font-bold text-lg px-10 py-7 rounded-xl shadow-cta hover:opacity-90 transition-all animate-pulse-glow"
            >
              Réserver mon intervention
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 pb-16"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-800">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
