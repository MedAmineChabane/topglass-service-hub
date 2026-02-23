import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import serviceVitrages from "@/assets/service-remplacement-vitrages.png";
import serviceReparationImpact from "@/assets/service-reparation-impact.png";
import serviceToitPanoramique from "@/assets/service-toit-panoramique.png";

const services = [
  {
    title: "Remplacement vitrages",
    description: "Remplacement complet de vos vitrages avec des verres de qualité d'origine. Intervention rapide et garantie.",
    image: serviceVitrages,
  },
  {
    title: "Réparation d'impact",
    description: "Réparation d'impact et de fissures sur vos vitrages pour éviter un remplacement coûteux.",
    image: serviceReparationImpact,
  },
  {
    title: "Vitre latérale",
    description: "Remplacement de vitres latérales avant et arrière pour tous types de véhicules.",
    image: null,
  },
  {
    title: "Lunette arrière",
    description: "Remplacement de lunette arrière avec dégivrage intégré selon le modèle de votre véhicule.",
    image: null,
  },
  {
    title: "Toit panoramique",
    description: "Remplacement et réparation de toits panoramiques en verre, intervention spécialisée.",
    image: serviceToitPanoramique,
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Nos </span>
              <span className="text-sky-400">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Topglass intervient sur tous types de vitrages automobiles, partout à Marseille et en région PACA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border/50 shadow-md overflow-hidden flex flex-col"
              >
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Image à venir</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{service.description}</p>
                  <Button
                    onClick={() => navigate("/devis")}
                    className="gradient-cta text-primary-foreground font-semibold w-full shadow-cta"
                  >
                    Demander un devis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
