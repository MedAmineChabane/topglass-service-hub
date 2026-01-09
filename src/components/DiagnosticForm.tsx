import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Car, 
  Truck, 
  Bus,
  CircleDot,
  Square,
  Maximize2,
  Sun,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const vehicleTypes = [
  { id: "voiture", label: "Voiture", icon: Car },
  { id: "utilitaire", label: "Utilitaire", icon: Truck },
  { id: "camion", label: "Camion", icon: Bus },
];

const glassTypes = [
  { id: "pare-brise", label: "Pare-brise", icon: Maximize2 },
  { id: "vitre-laterale", label: "Vitre latérale", icon: Square },
  { id: "lunette-arriere", label: "Lunette arrière", icon: CircleDot },
  { id: "toit-panoramique", label: "Toit panoramique", icon: Sun },
];

const vehicleBrands = [
  "Renault", "Peugeot", "Citroën", "Volkswagen", "Toyota", 
  "Ford", "BMW", "Mercedes", "Audi", "Fiat", "Opel", "Nissan",
  "Hyundai", "Kia", "Dacia", "Tesla", "Autre"
];

const DiagnosticForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    vehicleType: "",
    glassType: "",
    vehicleBrand: "",
    location: "",
    name: "",
    phone: "",
    email: "",
  });

  const totalSteps = 5;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.vehicleType !== "";
      case 2: return formData.glassType !== "";
      case 3: return formData.vehicleBrand !== "";
      case 4: return formData.location.length >= 3;
      case 5: return formData.name && formData.phone && formData.email;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("leads").insert({
        vehicle_type: formData.vehicleType,
        glass_type: formData.glassType,
        vehicle_brand: formData.vehicleBrand,
        location: formData.location,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontactons dans les plus brefs délais.",
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

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (isSuccess) {
    return (
      <section id="diagnostic-form" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-card rounded-2xl shadow-strong p-10 text-center"
          >
            <div className="w-20 h-20 gradient-cta rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4">
              Merci pour votre demande !
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Un conseiller Topglass vous contactera dans les prochaines 24 heures pour confirmer votre intervention.
            </p>
            <div className="bg-accent rounded-xl p-6">
              <p className="text-accent-foreground font-medium">
                📞 Pour une urgence, appelez-nous au{" "}
                <span className="text-secondary font-bold">01 23 45 67 89</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnostic-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Obtenez votre devis en 2 minutes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Remplissez ce formulaire rapide et recevez une estimation gratuite pour votre intervention.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                    i + 1 <= step
                      ? "gradient-cta text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-cta"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl shadow-strong p-8 md:p-10">
            <AnimatePresence mode="wait">
              {/* Step 1: Vehicle Type */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                    Quel est votre type de véhicule ?
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => updateFormData("vehicleType", type.id)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                          formData.vehicleType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <type.icon className={`w-8 h-8 ${
                          formData.vehicleType === type.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <span className={`font-medium ${
                          formData.vehicleType === type.id ? "text-primary" : "text-foreground"
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Glass Type */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                    Quelle vitre est endommagée ?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {glassTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => updateFormData("glassType", type.id)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                          formData.glassType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <type.icon className={`w-8 h-8 ${
                          formData.glassType === type.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <span className={`font-medium text-center ${
                          formData.glassType === type.id ? "text-primary" : "text-foreground"
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Vehicle Brand */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                    Quelle est la marque de votre véhicule ?
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
                    {vehicleBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => updateFormData("vehicleBrand", brand)}
                        className={`p-4 rounded-xl border-2 font-medium transition-all ${
                          formData.vehicleBrand === brand
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 text-foreground"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Location */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                    Où souhaitez-vous l'intervention ?
                  </h3>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Ville ou code postal"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      className="pl-12 h-14 text-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Ex: Marseille, 13001, Aix-en-Provence...
                  </p>
                </motion.div>
              )}

              {/* Step 5: Contact Info */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                    Vos coordonnées
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="pl-12 h-14 text-lg"
                      />
                    </div>
                    <Input
                      type="tel"
                      placeholder="Téléphone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="h-14 text-lg"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="h-14 text-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Vos données sont protégées et ne seront jamais partagées.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
              
              {step < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gradient-cta text-primary-foreground gap-2 shadow-cta"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="gradient-cta text-primary-foreground gap-2 shadow-cta"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticForm;
