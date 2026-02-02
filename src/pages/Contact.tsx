import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Contactez </span>
              <span className="text-sky-400">Topglass</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-12">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
            
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-xl border border-border/50">
              <div className="space-y-8">
                {/* Phone - WhatsApp */}
                <a 
                  href="https://wa.me/33465849498"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-4 p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Téléphone / WhatsApp</p>
                    <p className="text-xl font-bold text-foreground">04 65 84 94 98</p>
                  </div>
                </a>
                
                {/* Email */}
                <a 
                  href="mailto:Topglassfrance@gmail.com"
                  className="flex items-center justify-center gap-4 p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-xl font-bold text-foreground">Topglassfrance@gmail.com</p>
                  </div>
                </a>
                
                {/* Location */}
                <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="text-lg font-bold text-foreground">2 Impasse Jolie Manon, 13003 Marseille</p>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Horaires</p>
                    <p className="text-xl font-bold text-foreground">Lun - Sam : 8h - 19h</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-muted-foreground mb-4">Besoin d'un devis rapide ?</p>
                <Button 
                  onClick={() => window.location.href = '/devis'}
                  size="lg" 
                  className="gradient-cta text-primary-foreground font-bold shadow-cta"
                >
                  Demander un devis gratuit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
