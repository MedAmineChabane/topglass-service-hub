import { motion } from "framer-motion";
import { Shield, Truck, Clock } from "lucide-react";
import HeroForm from "./HeroForm";

const Hero = () => {
  const features = [
    { icon: Shield, text: "Agréé toutes assurances" },
    { icon: Truck, text: "Intervention à domicile" },
    { icon: Clock, text: "RDV sous 48h" },
  ];

  return (
    <section
      id="hero-section"
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary-foreground/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-foreground leading-tight mb-6"
            >
              Remplacement & Réparation de{" "}
              <span className="text-primary">Pare-brise</span> Rapide & Fiable
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-secondary-foreground/80 mb-8 max-w-xl"
            >
              Votre sécurité est notre priorité. Service mobile disponible
              partout en France.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-6"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-secondary-foreground/90"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Decorative card representing technician image */}
              <div className="w-80 h-96 rounded-2xl bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full gradient-cta mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <p className="text-secondary-foreground font-display font-semibold text-lg">
                    Techniciens Certifiés
                  </p>
                  <p className="text-secondary-foreground/70 text-sm mt-2">
                    +15 000 interventions/an
                  </p>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 gradient-cta rounded-xl opacity-80" />
            </div>
          </motion.div>
        </div>

        {/* Hero Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <HeroForm />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
