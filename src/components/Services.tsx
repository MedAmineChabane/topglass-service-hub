import { motion } from "framer-motion";
import { Sparkles, Layers, Settings, Shield, Truck, Clock } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Réparation Impact",
    description:
      "Réparez les petits impacts avant qu'ils ne se propagent. Intervention rapide et économique.",
  },
  {
    icon: Layers,
    title: "Remplacement Pare-brise",
    description:
      "Remplacement complet de votre pare-brise avec des vitres de qualité d'origine.",
  },
  {
    icon: Settings,
    title: "Calibrage ADAS",
    description:
      "Calibrage professionnel des systèmes d'aide à la conduite après remplacement.",
  },
  {
    icon: Shield,
    title: "Agréé Assurances",
    description:
      "Nous gérons directement avec votre assurance. Zéro démarche pour vous.",
  },
  {
    icon: Truck,
    title: "Intervention Mobile",
    description:
      "Nos techniciens se déplacent chez vous, au travail ou où vous le souhaitez.",
  },
  {
    icon: Clock,
    title: "Intervention Express",
    description:
      "Prise en charge rapide sous 24 à 48h partout en France.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Nos Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4"
          >
            Des solutions pour tous vos besoins
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Topglass vous accompagne pour tous vos travaux de vitrage automobile
            avec des techniciens certifiés.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border border-border hover:border-primary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
