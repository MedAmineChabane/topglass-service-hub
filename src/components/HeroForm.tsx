import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Phone, Car, Layers, Calendar, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const vehicleTypes = [
  { id: "voiture", label: "Voiture" },
  { id: "utilitaire", label: "Utilitaire" },
  { id: "camion", label: "Camion" },
];

const glassTypes = [
  { id: "pare-brise", label: "Pare-brise" },
  { id: "vitre-laterale", label: "Vitre latérale" },
  { id: "lunette-arriere", label: "Lunette arrière" },
  { id: "toit-panoramique", label: "Toit panoramique" },
];

const HeroForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    glassType: "",
    location: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit = () => {
    return (
      formData.name.length >= 2 &&
      formData.phone.length >= 8 &&
      formData.vehicleType &&
      formData.glassType &&
      formData.location.length >= 3
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        vehicle_type: formData.vehicleType,
        glass_type: formData.glassType,
        vehicle_brand: "Non spécifié",
        location: formData.location,
        name: formData.name,
        phone: formData.phone,
        email: "non-fourni@topglass.fr",
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontactons dans les plus brefs délais.",
      });

      setFormData({
        name: "",
        phone: "",
        vehicleType: "",
        glassType: "",
        location: "",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-xl shadow-strong p-4 md:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Votre nom"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            className="pl-10 h-12 bg-background border-border"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            className="pl-10 h-12 bg-background border-border"
          />
        </div>

        {/* Vehicle Type */}
        <div className="relative">
          <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
          <Select
            value={formData.vehicleType}
            onValueChange={(value) => updateFormData("vehicleType", value)}
          >
            <SelectTrigger className="pl-10 h-12 bg-background border-border">
              <SelectValue placeholder="Type de véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Glass Type */}
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
          <Select
            value={formData.glassType}
            onValueChange={(value) => updateFormData("glassType", value)}
          >
            <SelectTrigger className="pl-10 h-12 bg-background border-border">
              <SelectValue placeholder="Type de vitre" />
            </SelectTrigger>
            <SelectContent>
              {glassTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Ville ou code postal"
            value={formData.location}
            onChange={(e) => updateFormData("location", e.target.value)}
            className="pl-10 h-12 bg-background border-border"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canSubmit() || isSubmitting}
          className="h-12 gradient-cta text-primary-foreground font-bold shadow-cta hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "DEVIS GRATUIT"
          )}
        </Button>
      </div>
    </form>
  );
};

export default HeroForm;
