import { motion } from "framer-motion";
import { Wallet, CreditCard, MapPin, Shield } from "lucide-react";

const reassuranceItems = [
  {
    icon: Wallet,
    title: "Franchise Remboursée",
    description: "Nous remboursons votre franchise sous 30 jours",
  },
  {
    icon: CreditCard,
    title: "Zéro Avance de Frais",
    description: "Prise en charge directe avec votre assurance",
  },
  {
    icon: MapPin,
    title: "Déplacement Gratuit",
    description: "Intervention sur site, à domicile ou au bureau",
  },
  {
    icon: Shield,
    title: "Garantie 10 Ans",
    description: "Sur toutes nos interventions",
  },
];

const ReassuranceBanner = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reassuranceItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-foreground/10 flex items-center justify-center mb-4">
                <item.icon className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-secondary-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-secondary-foreground/80 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReassuranceBanner;
