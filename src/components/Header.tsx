import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById("hero-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "#hero-section", label: "Accueil" },
    { href: "#services", label: "Services" },
    { href: "#temoignages", label: "Témoignages" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-display font-bold text-lg">
                TG
              </span>
            </div>
            <span className="font-display font-bold text-xl text-secondary-foreground">
              Topglass
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-secondary-foreground/90 hover:text-primary font-medium transition-colors rounded-lg hover:bg-secondary-foreground/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-secondary-foreground/80">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">01 23 45 67 89</span>
            </div>
            <Button
              onClick={scrollToForm}
              className="gradient-cta text-primary-foreground font-bold shadow-cta hover:opacity-90 transition-opacity"
            >
              DEVIS GRATUIT
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary-foreground"
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
            className="md:hidden bg-secondary border-t border-secondary-foreground/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-secondary-foreground py-3 px-4 font-medium rounded-lg hover:bg-secondary-foreground/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 text-secondary-foreground/80 py-3 px-4">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">01 23 45 67 89</span>
              </div>
              <Button
                onClick={scrollToForm}
                className="gradient-cta text-primary-foreground font-bold w-full mt-2"
              >
                DEVIS GRATUIT
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
