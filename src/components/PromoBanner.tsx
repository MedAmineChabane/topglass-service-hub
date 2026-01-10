import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const scrollToForm = () => {
    const formElement = document.getElementById("diagnostic-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm md:text-base">
        <span className="font-semibold">
          OFFRE SPÉCIALE - 15% de réduction sur le remplacement de pare-brise
        </span>
        <Button
          onClick={scrollToForm}
          variant="secondary"
          size="sm"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 py-1 h-auto"
        >
          EN PROFITER
        </Button>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        aria-label="Fermer la bannière"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PromoBanner;
