import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
interface FooterProps {
  hideCta?: boolean;
}
const Footer = ({
  hideCta = false
}: FooterProps) => {
  const navigate = useNavigate();
  const goToDevis = () => {
    navigate("/devis");
  };
  return <footer id="contact" className="bg-foreground text-background">
      {/* CTA Section */}
      {!hideCta && <div className="container mx-auto px-4 py-12">
          <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-secondary-foreground mb-4">
              Besoin d'une intervention rapide ?
            </h3>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">Nos techniciens certifiés interviennent partout à Marseille et en région Paca 48h.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={goToDevis} size="lg" className="gradient-cta text-primary-foreground font-bold shadow-cta">
                Demander un devis gratuit
              </Button>
              <a href="https://wa.me/33465849498" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Phone className="w-4 h-4 mr-2" />
                  04 65 84 94 98
                </Button>
              </a>
            </div>
          </div>
        </div>}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 border-t border-background/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/topglass-logo.png" alt="Topglass" className="h-14 w-14 rounded-full object-cover border-2 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
              <span className="font-display font-bold text-xl">
                <span className="text-white">Top</span>
                <span className="text-sky-500">glass</span>
              </span>
            </div>
            <p className="text-background/70 mb-4">Leader du remplacement de pare-brise en marseille et region Paca. Intervention rapide, service de qualité.</p>
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
              <li><a href="/devis" className="hover:text-primary transition-colors">Remplacement pare-brise</a></li>
              <li><a href="/devis" className="hover:text-primary transition-colors">Réparation d'impact</a></li>
              <li><a href="/devis" className="hover:text-primary transition-colors">Vitre latérale</a></li>
              <li><a href="/devis" className="hover:text-primary transition-colors">Lunette arrière</a></li>
              <li><a href="/devis" className="hover:text-primary transition-colors">Toit panoramique</a></li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Informations</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="/devis" className="hover:text-primary transition-colors">Demander un devis</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Nous contacter</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4 text-background/70">
              <li>
                <a href="https://wa.me/33465849498" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>04 65 84 94 98</span>
                </a>
              </li>
              <li>
                <a href="mailto:Topglassfrance@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Topglassfrance@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>2 Impasse Jolie Manon<br />13003 Marseille</span>
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