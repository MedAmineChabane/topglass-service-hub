import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const services = [
  { name: "Remplacement pare-brise", href: "#services" },
  { name: "Réparation d'impact", href: "#services" },
  { name: "Vitre latérale", href: "#services" },
  { name: "Lunette arrière", href: "#services" },
  { name: "Toit panoramique", href: "#services" },
];

interface HeaderProps {
  minimal?: boolean;
}

const Header = ({ minimal = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToDevis = () => {
    navigate("/devis");
    setIsMenuOpen(false);
  };

  // Header minimal avec seulement le logo
  if (minimal) {
    return (
      <header className="fixed top-4 left-4 z-50">
        <a href="/" className="flex items-center">
          <img 
            src="/assets/topglass-logo.png" 
            alt="Topglass - Remplacement pare-brise" 
            className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-2 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          />
        </a>
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-2xl ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-xl border border-white/10 shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="/assets/topglass-logo.png" 
              alt="Topglass - Remplacement pare-brise" 
              className="h-20 w-20 md:h-28 md:w-28 rounded-full object-cover border-2 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-white hover:text-primary transition-colors font-bold">
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden z-50"
                  >
                    {services.map((service, index) => (
                      <a
                        key={index}
                        href={service.href}
                        className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                      >
                        {service.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#temoignages" className="text-white hover:text-primary transition-colors font-bold">
              Témoignages
            </a>
            <a href="#contact" className="text-white hover:text-primary transition-colors font-bold">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:0123456789"
              className="flex items-center gap-2 text-secondary animate-phone-pulse hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">01 23 45 67 89</span>
            </a>
            <Button 
              onClick={goToDevis}
              className="gradient-cta text-primary-foreground font-semibold shadow-cta hover:opacity-90 transition-opacity animate-pulse-glow"
            >
              Devis gratuit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a 
                href="#services" 
                className="text-foreground py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#temoignages" 
                className="text-foreground py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Témoignages
              </a>
              <a 
                href="#contact" 
                className="text-foreground py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <a 
                href="tel:0123456789"
                className="flex items-center gap-2 text-secondary py-2 animate-phone-pulse"
              >
                <Phone className="w-4 h-4" />
                <span className="font-semibold">01 23 45 67 89</span>
              </a>
              <Button 
                onClick={goToDevis}
                className="gradient-cta text-primary-foreground font-semibold w-full animate-pulse-glow"
              >
                Devis gratuit
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
