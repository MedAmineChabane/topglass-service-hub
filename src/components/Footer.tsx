import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
const Footer = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("diagnostic-form");
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <footer id="contact" className="bg-foreground text-background">
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-secondary-foreground mb-4">
            Besoin d'une intervention rapide ?
          </h3>
          <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
            Nos techniciens certifiés interviennent partout en France sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={scrollToForm} size="lg" className="gradient-cta text-primary-foreground font-bold shadow-cta">
              Demander un devis gratuit
            </Button>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Phone className="w-4 h-4 mr-2" />
              01 23 45 67 89
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 border-t border-background/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/assets/topglass-logo.png" 
                alt="Topglass" 
                className="h-14 w-14 rounded-full object-cover border-2 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
              <span className="font-display font-bold text-xl">
                <span className="text-white">Top</span>
                <span className="text-sky-500">glass</span>
              </span>
            </div>
            <p className="text-background/70 mb-4">
              Leader du remplacement de pare-brise en France. Intervention rapide, service de qualité.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Nos Services</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Remplacement pare-brise</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Réparation d'impact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vitre latérale</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Lunette arrière</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Toit panoramique</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Informations</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Nos centres</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">CGV</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4 text-background/70">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@topglass.fr</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>45 Boulevard Baille<br />13006 Marseille</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6 border-t border-background/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© 2026 Topglass. Tous droits réservés.</p>
          <p>Agréé par toutes les compagnies d'assurance</p>
        </div>
      </div>
    </footer>;
};
export default Footer;