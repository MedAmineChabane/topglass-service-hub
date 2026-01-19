import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Wrench,
  ImageIcon,
  User,
  Euro,
  ArrowLeft,
  CheckCircle,
  Loader2,
  X,
  Phone,
  Mail,
  MapPin,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarIllustration from "@/components/illustrations/CarIllustration";
import GlassServiceIcon from "@/components/illustrations/GlassServiceIcon";
import BodyworkServiceIcon from "@/components/illustrations/BodyworkServiceIcon";

// Step configuration
const steps = [
  { id: 1, label: "Votre immatriculation", icon: Car },
  { id: 2, label: "Votre besoin", icon: Wrench },
  { id: 3, label: "Vos dégâts", icon: ImageIcon },
  { id: 4, label: "Vos coordonnées", icon: User },
  { id: 5, label: "Notre proposition", icon: Euro },
];

// Vehicle brands and models
const vehicleBrands = [
  "RENAULT", "PEUGEOT", "CITROËN", "VOLKSWAGEN", "TOYOTA",
  "FORD", "BMW", "MERCEDES", "AUDI", "FIAT", "OPEL", "NISSAN",
  "HYUNDAI", "KIA", "DACIA", "TESLA", "AUTRE"
];

const vehicleModels: Record<string, string[]> = {
  "RENAULT": ["CLIO", "MEGANE", "CAPTUR", "SCENIC", "TWINGO", "KADJAR", "ARKANA", "ZOE", "AUTRE"],
  "PEUGEOT": ["208", "308", "2008", "3008", "5008", "508", "PARTNER", "AUTRE"],
  "CITROËN": ["C3", "C4", "C5", "BERLINGO", "C3 AIRCROSS", "C5 AIRCROSS", "AUTRE"],
  "VOLKSWAGEN": ["GOLF", "POLO", "TIGUAN", "PASSAT", "T-ROC", "ID.3", "ID.4", "AUTRE"],
  "TOYOTA": ["YARIS", "COROLLA", "C-HR", "RAV4", "AYGO", "CAMRY", "AUTRE"],
  "FORD": ["FIESTA", "FOCUS", "PUMA", "KUGA", "MONDEO", "AUTRE"],
  "BMW": ["SÉRIE 1", "SÉRIE 3", "SÉRIE 5", "X1", "X3", "X5", "AUTRE"],
  "MERCEDES": ["CLASSE A", "CLASSE C", "CLASSE E", "GLA", "GLC", "AUTRE"],
  "AUDI": ["A1", "A3", "A4", "Q2", "Q3", "Q5", "AUTRE"],
  "FIAT": ["500", "PANDA", "TIPO", "500X", "AUTRE"],
  "OPEL": ["CORSA", "ASTRA", "CROSSLAND", "MOKKA", "AUTRE"],
  "NISSAN": ["MICRA", "QASHQAI", "JUKE", "LEAF", "AUTRE"],
  "HYUNDAI": ["I10", "I20", "I30", "TUCSON", "KONA", "AUTRE"],
  "KIA": ["PICANTO", "RIO", "CEED", "SPORTAGE", "NIRO", "AUTRE"],
  "DACIA": ["SANDERO", "DUSTER", "LOGAN", "SPRING", "AUTRE"],
  "TESLA": ["MODEL 3", "MODEL Y", "MODEL S", "MODEL X", "AUTRE"],
  "AUTRE": ["AUTRE"],
};

const vehicleTypes = [
  "BERLINE, 5 portes",
  "BERLINE, 4 portes",
  "BERLINE, 3 portes",
  "BREAK",
  "COUPÉ",
  "CABRIOLET",
  "SUV",
  "MONOSPACE",
  "UTILITAIRE",
  "AUTRE",
];

const situationOptions = [
  "Faire marcher mon assurance",
  "Je ne sais pas encore (J'ai besoin d'un devis et de conseil)",
  "Financer ces travaux moi-même",
];

const contactPreferences = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Appel" },
];

const Devis = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Step 1 - Immatriculation
    immatriculation: "",
    // Step 1 modal - Vehicle confirmation
    vehicleBrand: "",
    vehicleModel: "",
    vehicleType: "",
    // Step 2 - Besoin
    serviceType: "vitrage" as "carrosserie" | "vitrage",
    // Step 3 - Dégâts
    photos: [] as File[],
    situation: "",
    description: "",
    insuranceName: "",
    // Step 4 - Coordonnées
    civility: "" as "Mme" | "M" | "",
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    location: "",
    contactPreference: "",
    consent: false,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImmatriculationSubmit = () => {
    if (formData.immatriculation.length >= 7) {
      setShowVehicleModal(true);
    }
  };

  const handleVehicleConfirm = () => {
    setShowVehicleModal(false);
    setStep(2);
  };

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 5)
      }));
    }
  }, []);

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.immatriculation.length >= 7 && 
               formData.vehicleBrand !== "" && 
               formData.vehicleModel !== "" && 
               formData.vehicleType !== "";
      case 2:
        return true; // serviceType always has a default value
      case 3:
        return formData.situation !== "" && formData.description.length >= 10;
      case 4:
        return formData.civility && 
               formData.lastName && 
               formData.firstName && 
               formData.email && 
               formData.phone && 
               formData.location && 
               formData.contactPreference &&
               formData.consent;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        vehicle_type: `${formData.vehicleBrand} ${formData.vehicleModel} - ${formData.vehicleType}`,
        glass_type: formData.serviceType,
        vehicle_brand: formData.vehicleBrand,
        location: formData.location,
        name: `${formData.civility} ${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
      });

      if (error) throw error;

      setStep(5);
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
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      {/* Progress Bar */}
      <div className="bg-[#2a2a2a] pt-20 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 md:gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                      s.id <= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-[#4a4a4a] text-gray-400"
                    }`}
                  >
                    <s.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className={`hidden md:block text-xs mt-2 text-center max-w-[100px] ${
                    s.id <= step ? "text-white" : "text-gray-400"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-1 mx-1 md:mx-2 mt-[-20px] md:mt-0 ${
                      s.id < step ? "bg-primary" : "bg-[#4a4a4a]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Immatriculation */}
          {step === 1 && !showVehicleModal && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 uppercase italic">
                  Quelle est l'immatriculation<br />de votre véhicule ?
                </h1>
                <p className="text-muted-foreground text-lg">
                  Renseignez votre plaque d'immatriculation<br />
                  afin que nous puissions identifier<br />
                  votre type de véhicule.
                </p>
              </div>

              <div className="flex flex-col items-center">
                {/* Car illustration améliorée */}
                <div className="relative w-full max-w-lg">
                  <CarIllustration className="mb-8" highlightWindshield={true} />

                  {/* License plate input */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-xl mx-auto max-w-sm"
                  >
                    <div className="bg-blue-700 text-white px-4 py-5 flex flex-col items-center justify-center">
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full" />
                        ))}
                      </div>
                      <span className="text-lg font-bold">F</span>
                    </div>
                    <Input
                      value={formData.immatriculation}
                      onChange={(e) => updateFormData("immatriculation", e.target.value.toUpperCase())}
                      placeholder="AB-123-CD"
                      className="border-0 text-center text-2xl font-bold tracking-widest flex-1 h-16 focus-visible:ring-0 bg-transparent"
                      maxLength={9}
                    />
                    <Button
                      onClick={handleImmatriculationSubmit}
                      disabled={formData.immatriculation.length < 7}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-16 px-8 text-lg font-bold"
                    >
                      OK
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Vehicle Confirmation Modal */}
          {showVehicleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowVehicleModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display font-semibold text-xl">Est-ce bien ce véhicule ?</h2>
                  <button onClick={() => setShowVehicleModal(false)}>
                    <X className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Marque</label>
                    <Select
                      value={formData.vehicleBrand}
                      onValueChange={(value) => {
                        updateFormData("vehicleBrand", value);
                        updateFormData("vehicleModel", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une marque" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Modèle</label>
                    <Select
                      value={formData.vehicleModel}
                      onValueChange={(value) => updateFormData("vehicleModel", value)}
                      disabled={!formData.vehicleBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.vehicleBrand &&
                          vehicleModels[formData.vehicleBrand]?.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Véhicule</label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => updateFormData("vehicleType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleVehicleConfirm}
                  disabled={!formData.vehicleBrand || !formData.vehicleModel || !formData.vehicleType}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
                >
                  VALIDER
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Type de besoin */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="mb-6 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-6 uppercase italic">
                  Quelle est<br />votre situation ?
                </h1>
                <p className="text-muted-foreground text-lg">
                  Décrivez au mieux vos dégâts et votre couverture d'assurance 
                  (tous risques, au tiers, avec ou sans franchise...). 
                  Plus vous êtes précis, plus nous pourrons vous proposer un devis adapté.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Quel est le type de demande ?</h3>
                  <div className="flex gap-6">
                    <button
                      onClick={() => updateFormData("serviceType", "carrosserie")}
                      className={`flex flex-col items-center gap-3 p-8 rounded-2xl transition-all transform hover:scale-105 ${
                        formData.serviceType === "carrosserie"
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-white border-2 border-gray-200 hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      <BodyworkServiceIcon isSelected={formData.serviceType === "carrosserie"} />
                      <span className="font-semibold text-sm uppercase tracking-wide">Carrosserie</span>
                    </button>
                    <button
                      onClick={() => updateFormData("serviceType", "vitrage")}
                      className={`flex flex-col items-center gap-3 p-8 rounded-2xl transition-all transform hover:scale-105 ${
                        formData.serviceType === "vitrage"
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-white border-2 border-gray-200 hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      <GlassServiceIcon isSelected={formData.serviceType === "vitrage"} />
                      <span className="font-semibold text-sm uppercase tracking-wide">Vitrage</span>
                    </button>
                  </div>
                </div>

                <Button
                  onClick={nextStep}
                  disabled={!formData.serviceType}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
                >
                  SUIVANT
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Dégâts */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="mb-6 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-6 uppercase italic">
                  Quelle est<br />votre situation ?
                </h1>
                <p className="text-muted-foreground text-lg">
                  Décrivez au mieux vos dégâts et votre couverture d'assurance. 
                  Plus vous êtes précis, plus le professionnel près de chez vous 
                  pourra vous proposer un devis adapté à votre réparation.
                </p>
              </div>

              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Importez les photos de votre sinistre*</h3>
                  <a href="#" className="text-primary text-sm underline mb-4 block">
                    Comment prendre les photos ?
                  </a>
                  <div className="flex gap-4 flex-wrap">
                    <label className="w-40 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-white">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Situation */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quelle est votre situation ?</h3>
                  <Select
                    value={formData.situation}
                    onValueChange={(value) => updateFormData("situation", value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Qu'envisagez-vous pour vos réparations ?" />
                    </SelectTrigger>
                    <SelectContent>
                      {situationOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dites-nous en plus sur votre sinistre</h3>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Décrivez les dégâts, les circonstances..."
                    className="bg-white min-h-[120px]"
                  />
                </div>

                {/* Insurance */}
                {formData.situation === "Faire marcher mon assurance" && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Quel est le nom de votre assurance ?</h3>
                    <Input
                      value={formData.insuranceName}
                      onChange={(e) => updateFormData("insuranceName", e.target.value)}
                      placeholder="Entrez le nom de votre assurance"
                      className="bg-white h-12"
                    />
                  </div>
                )}

                <Button
                  onClick={nextStep}
                  disabled={!formData.situation || formData.description.length < 10}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
                >
                  SUIVANT
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Coordonnées */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="mb-6 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-6 uppercase italic">
                  Vous y êtes presque !
                </h1>
                <p className="text-muted-foreground text-lg">
                  Laissez-nous vos coordonnées ❤️ ! L'équipe Topglass étudie 
                  votre demande, puis trouve un professionnel proche de chez vous 
                  pour établir un devis.
                </p>
              </div>

              <div className="space-y-4">
                {/* Civility */}
                <div className="flex gap-4">
                  <button
                    onClick={() => updateFormData("civility", "Mme")}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.civility === "Mme"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 bg-white hover:border-primary/50"
                    }`}
                  >
                    Mme
                  </button>
                  <button
                    onClick={() => updateFormData("civility", "M")}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.civility === "M"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 bg-white hover:border-primary/50"
                    }`}
                  >
                    M
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      placeholder="NOM"
                      className="pl-10 bg-white h-12 border-0 border-b-2 border-gray-200 rounded-none"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      placeholder="PRÉNOM"
                      className="pl-10 bg-white h-12 border-0 border-b-2 border-gray-200 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="TÉLÉPHONE"
                      className="pl-10 bg-white h-12 border-0 border-b-2 border-gray-200 rounded-none"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      placeholder="LOCALISATION"
                      className="pl-10 bg-white h-12 border-0 border-b-2 border-gray-200 rounded-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="EMAIL"
                    className="pl-10 bg-white h-12 border-0 border-b-2 border-gray-200 rounded-none"
                  />
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => updateFormData("consent", checked)}
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    En soumettant ce formulaire, je consens au traitement des informations 
                    saisies afin de traiter ma demande.
                  </label>
                </div>

                {/* Contact Preference */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Comment souhaitez-vous être recontacté par notre équipe ?
                  </p>
                  <Select
                    value={formData.contactPreference}
                    onValueChange={(value) => updateFormData("contactPreference", value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choisissez..." />
                    </SelectTrigger>
                    <SelectContent>
                      {contactPreferences.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "VALIDER"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center max-w-3xl mx-auto py-12"
            >
              <div className="w-20 h-20 gradient-cta rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              
              <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 uppercase">
                Merci !
              </h1>
              
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                Votre demande de devis a bien été prise en compte
              </h2>
              
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                L'équipe Topglass prend en charge votre demande et revient vers vous 
                pour vous proposer un professionnel qui s'occupera de votre devis. 
                Si certaines informations manquent pour le bon suivi de votre dossier, 
                nous vous contacterons. Et si vous avez des questions, nous sommes 
                joignables au <span className="font-bold text-foreground">01 23 45 67 89</span> !
              </p>

              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="px-8"
              >
                Retour à l'accueil
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Devis;
