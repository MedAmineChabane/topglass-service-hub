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
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import carIllustration from "@/assets/car-illustration.png";
import GlassServiceIcon from "@/components/illustrations/GlassServiceIcon";
import BodyworkServiceIcon from "@/components/illustrations/BodyworkServiceIcon";
import { GlassSelector, type GlassZone, glassZones } from "@/components/GlassSelector";

// UUID v4 helper (fallback if crypto.randomUUID isn't available in some browsers)
const generateUUID = (): string => {
  // Modern browsers
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    return (globalThis.crypto as Crypto).randomUUID();
  }

  // Fallback v4 using getRandomValues
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// Normalise le téléphone au format 0XXXXXXXXX
const normalizePhone = (phone: string): string => {
  // Supprimer tout sauf les chiffres et le +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Convertir +33 en 0
  if (cleaned.startsWith('+33')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('33') && cleaned.length > 10) {
    cleaned = '0' + cleaned.slice(2);
  }
  
  // Garder uniquement les chiffres et limiter à 10
  return cleaned.replace(/\D/g, '').slice(0, 10);
};

// Normalise l'immatriculation au format AA-123-BB
const normalizeRegistration = (reg: string): string => {
  // Supprimer tout sauf lettres et chiffres
  const cleaned = reg.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Si 7 caractères ou plus, formater avec tirets
  if (cleaned.length >= 7) {
    const letters1 = cleaned.slice(0, 2);
    const numbers = cleaned.slice(2, 5);
    const letters2 = cleaned.slice(5, 7);
    return `${letters1}-${numbers}-${letters2}`;
  }
  
  return cleaned.toUpperCase();
};

// Validation du format téléphone français (10 chiffres commençant par 0)
const isValidPhone = (phone: string): boolean => {
  return /^0[1-9][0-9]{8}$/.test(phone);
};

// Validation du format immatriculation française (AA-123-BB)
const isValidRegistration = (reg: string): boolean => {
  return /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(reg);
};

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

const frenchCities = [
  "Marseille",
  "Paris",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Montpellier",
  "Strasbourg",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Toulon",
  "Le Havre",
  "Saint-Étienne",
  "Grenoble",
  "Dijon",
  "Angers",
  "Nîmes",
  "Aix-en-Provence",
  "Clermont-Ferrand",
  "Le Mans",
  "Brest",
  "Tours",
  "Amiens",
  "Limoges",
  "Perpignan",
  "Metz",
  "Besançon",
  "Orléans",
  "Rouen",
  "Caen",
  "Nancy",
  "Avignon",
  "Cannes",
  "Antibes",
  "Autre",
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
    vin: "", // Numéro VIN (optionnel)
    carteGriseFile: null as File | null, // Photo carte grise
    serviceType: "vitrage" as "carrosserie" | "vitrage",
    selectedGlassZones: [] as GlassZone[], // Zones de vitrage sélectionnées
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
        const normalizedReg = normalizeRegistration(formData.immatriculation);
        return isValidRegistration(normalizedReg) && 
               formData.vehicleBrand !== "" && 
               formData.vehicleModel !== "" && 
               formData.vehicleType !== "";
      case 2:
        return true; // serviceType always has a default value
      case 3:
        return true; // Cette étape est optionnelle
      case 4:
        const normalizedPhone = normalizePhone(formData.phone);
        return formData.civility && 
               formData.lastName && 
               formData.firstName && 
               formData.email && 
               isValidPhone(normalizedPhone) && 
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
      // Check rate limit before submitting
      const rateLimitResponse = await supabase.functions.invoke('check-rate-limit', {
        body: { endpoint: 'leads-submit' }
      });

      if (rateLimitResponse.error) {
        console.error('Rate limit check failed:', rateLimitResponse.error);
        // Continue if rate limit check fails (fail open)
      } else if (!rateLimitResponse.data?.allowed) {
        toast({
          title: "Trop de demandes",
          description: rateLimitResponse.data?.message || "Veuillez réessayer dans quelques minutes.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Normalize data before submission
      const normalizedPhone = normalizePhone(formData.phone);
      const normalizedRegistration = normalizeRegistration(formData.immatriculation);

      // Final validation check
      if (!isValidPhone(normalizedPhone)) {
        toast({
          title: "Numéro de téléphone invalide",
          description: "Le numéro doit être au format français (10 chiffres commençant par 0)",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!isValidRegistration(normalizedRegistration)) {
        toast({
          title: "Immatriculation invalide",
          description: "L'immatriculation doit être au format AA-123-BB",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // IMPORTANT (root cause fix):
      // Ne pas faire `.select('id')` après l'insert: cela force un RETURNING/SELECT
      // qui est bloqué par RLS pour les utilisateurs anonymes.
      // On génère donc l'id côté client et on insère sans SELECT.
      const leadId = generateUUID();

      // Build notes with glass zones and VIN if provided
      const glassZonesText = formData.selectedGlassZones.length > 0
        ? `Zones de vitrage: ${formData.selectedGlassZones.map(z => glassZones.find(gz => gz.id === z)?.label).join(', ')}`
        : '';
      const vinText = formData.vin ? `VIN: ${formData.vin}` : '';
      const noteParts = [formData.description, glassZonesText, vinText].filter(Boolean);
      const fullNotes = noteParts.length > 0 ? noteParts.join(' | ') : null;

      // Create the lead (no select)
      const { error: leadError } = await supabase.from("leads").insert({
        id: leadId,
        vehicle_type: `${formData.vehicleBrand} ${formData.vehicleModel} - ${formData.vehicleType}`,
        glass_type: formData.serviceType,
        vehicle_brand: formData.vehicleBrand,
        location: formData.location,
        name: `${formData.civility} ${formData.firstName} ${formData.lastName}`,
        phone: normalizedPhone,
        email: formData.email,
        notes: fullNotes,
        registration_plate: normalizedRegistration,
      });

      if (leadError) throw leadError;

      // Upload photos via edge function (rate-limited and validated)
      if (formData.photos.length > 0) {
        for (const photo of formData.photos) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', photo);
          uploadFormData.append('leadId', leadId);

          const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-lead-photo', {
            body: uploadFormData,
          });

          if (uploadError) {
            console.warn('Upload warning:', uploadError);
          } else if (uploadData?.error) {
            console.warn('Upload warning:', uploadData.error);
          }
        }
      }

      // Upload carte grise file if provided
      if (formData.carteGriseFile) {
        const carteGriseFormData = new FormData();
        carteGriseFormData.append('file', formData.carteGriseFile);
        carteGriseFormData.append('leadId', leadId);

        const { data: cgData, error: cgError } = await supabase.functions.invoke('upload-lead-photo', {
          body: carteGriseFormData,
        });

        if (cgError) {
          console.warn('Carte grise upload warning:', cgError);
        } else if (cgData?.error) {
          console.warn('Carte grise upload warning:', cgData.error);
        }
      }

      // Send email notification to TopGlass team
      try {
        const { error: notificationError } = await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadId,
            name: `${formData.civility} ${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: normalizedPhone,
            vehicleBrand: formData.vehicleBrand,
            vehicleModel: formData.vehicleModel,
            vehicleType: formData.vehicleType,
            registrationPlate: normalizedRegistration,
            vin: formData.vin || undefined,
            location: formData.location,
            serviceType: formData.serviceType,
            selectedGlassZones: formData.selectedGlassZones.length > 0 
              ? formData.selectedGlassZones.map(z => glassZones.find(gz => gz.id === z)?.label).filter(Boolean)
              : undefined,
            description: formData.description || undefined,
          },
        });

        if (notificationError) {
          console.warn('Email notification warning:', notificationError);
        }
      } catch (notifErr) {
        console.warn('Email notification failed (non-blocking):', notifErr);
      }

      setStep(5);
    } catch (error) {
      console.error('Lead submission failed:', error);

      const err = error as any;
      const message =
        typeof err?.message === "string"
          ? err.message
          : typeof err?.error_description === "string"
            ? err.error_description
            : "Une erreur est survenue. Veuillez réessayer.";
      const details = typeof err?.details === "string" ? err.details : undefined;
      const code = typeof err?.code === "string" ? err.code : undefined;

      toast({
        title: "Erreur",
        description: [message, code ? `Code: ${code}` : null, details ? `Détails: ${details}` : null]
          .filter(Boolean)
          .join(" — "),
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
      <Header minimal />

      {/* Progress Bar */}
      <div className="bg-[#2a2a2a] pt-8 pb-4">
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
                {/* Car illustration */}
                <div className="relative w-full max-w-lg">
                  <img src={carIllustration} alt="Illustration voiture" className="w-full mb-8" />

                  {/* License plate input */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="mx-auto max-w-sm"
                  >
                    <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">
                      Immatriculation
                    </label>
                    <div className="flex items-center bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-xl">
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
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                          updateFormData("immatriculation", value);
                        }}
                        onBlur={() => {
                          // Auto-format on blur
                          const normalized = normalizeRegistration(formData.immatriculation);
                          if (normalized !== formData.immatriculation) {
                            updateFormData("immatriculation", normalized);
                          }
                        }}
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
                    </div>
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

                  {/* VIN or Carte Grise - Conditional validation */}
                  <div className="border-2 border-destructive/50 rounded-lg p-4 bg-destructive/5 space-y-4">
                    <p className="text-sm font-bold text-destructive flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Identification du véhicule (VIN ou Carte Grise obligatoire)
                    </p>

                    {/* Option A: VIN */}
                    <div>
                      <label className="text-sm font-semibold text-destructive/80 mb-1 block">
                        Option A — Numéro VIN (Case E carte grise)
                      </label>
                      <Input
                        value={formData.vin}
                        onChange={(e) => updateFormData("vin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="Ex: VF1RFB00123456789"
                        className="font-mono text-sm border-destructive/40 focus-visible:ring-destructive/30"
                        maxLength={17}
                      />
                      <p className="text-xs text-destructive/60 mt-1">17 caractères alphanumériques</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-destructive/20" />
                      <span className="text-xs font-bold text-destructive/60 uppercase">ou</span>
                      <div className="h-px flex-1 bg-destructive/20" />
                    </div>

                    {/* Option B: Carte Grise Upload */}
                    <div>
                      <label className="text-sm font-semibold text-destructive/80 mb-1 block">
                        Option B — Photo de la carte grise
                      </label>
                      {formData.carteGriseFile ? (
                        <div className="flex items-center gap-3 bg-white rounded-lg border border-destructive/30 p-3">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                          <span className="text-sm text-foreground truncate flex-1">{formData.carteGriseFile.name}</span>
                          <button
                            onClick={() => updateFormData("carteGriseFile", null)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-destructive/30 rounded-lg cursor-pointer hover:border-destructive/50 hover:bg-destructive/5 transition-colors bg-white">
                          <Upload className="w-6 h-6 text-destructive/50" />
                          <span className="text-sm text-destructive/70 font-medium">Importer une photo de la carte grise</span>
                          <span className="text-xs text-muted-foreground">.jpg, .png ou .pdf</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) updateFormData("carteGriseFile", file);
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Validation message */}
                    {!formData.vin && !formData.carteGriseFile && (
                      <p className="text-xs text-destructive font-medium">
                        ⚠ Veuillez renseigner le VIN ou importer la carte grise pour continuer.
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleVehicleConfirm}
                  disabled={!formData.vehicleBrand || !formData.vehicleModel || !formData.vehicleType || (!formData.vin && !formData.carteGriseFile)}
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

                {/* Glass Zone Selector - Only for vitrage service */}
                {formData.serviceType === "vitrage" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
                  >
                    <h3 className="font-semibold text-lg mb-4 text-center">
                      Quels vitrages sont concernés ?
                    </h3>
                    <GlassSelector
                      selectedZones={formData.selectedGlassZones}
                      onSelectionChange={(zones) => updateFormData("selectedGlassZones", zones)}
                    />
                  </motion.div>
                )}

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
                        accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
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

                {/* Description - Optional */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Dites-nous en plus sur votre sinistre
                    <span className="text-muted-foreground text-sm font-normal ml-2">(optionnel)</span>
                  </h3>
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
              <div className="lg:pr-8">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="mb-6 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
                  
                  <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 uppercase italic">
                    Plus qu'une étape !
                  </h1>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg md:text-xl">
                      Renseignez vos coordonnées pour recevoir votre <span className="text-primary font-semibold">devis personnalisé gratuit</span>.
                    </p>
                    
                    <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Notre équipe analyse votre demande et vous recontacte sous <span className="font-semibold text-foreground">24h maximum</span>.
                      </p>
                    </div>
                  </div>
                </div>
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
                  <div className="space-y-1">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        onBlur={() => {
                          // Auto-normalize on blur
                          const normalized = normalizePhone(formData.phone);
                          if (normalized !== formData.phone) {
                            updateFormData("phone", normalized);
                          }
                        }}
                        placeholder="TÉLÉPHONE"
                        className={`pl-10 bg-white h-12 border-0 border-b-2 rounded-none ${
                          formData.phone && !isValidPhone(normalizePhone(formData.phone))
                            ? "border-destructive"
                            : "border-gray-200"
                        }`}
                      />
                    </div>
                    {formData.phone && !isValidPhone(normalizePhone(formData.phone)) && (
                      <p className="text-xs text-destructive">
                        Format attendu : 06 12 34 56 78
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                    <Select
                      value={formData.location}
                      onValueChange={(value) => updateFormData("location", value)}
                    >
                      <SelectTrigger className="pl-10 bg-white h-12 border-0 border-b-2 border-gray-200 rounded-none text-left">
                        <SelectValue placeholder="LOCALISATION" />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-[300px]">
                        {frenchCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

          {/* Step 5: Confirmation avec récapitulatif */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto py-8"
            >
              {/* Header de confirmation */}
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 gradient-cta rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-primary-foreground" />
                </motion.div>
                
                <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 uppercase italic">
                  Demande envoyée !
                </h1>
                
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Notre équipe analyse votre demande et vous recontacte sous <span className="font-bold text-primary">24h maximum</span>.
                </p>
              </div>

              {/* Récapitulatif */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
              >
                <div className="bg-[#2a2a2a] px-6 py-4">
                  <h2 className="text-white font-display font-semibold text-xl">
                    📋 Récapitulatif de votre demande
                  </h2>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Véhicule */}
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Véhicule</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-13">
                      <div>
                        <p className="text-sm text-muted-foreground">Immatriculation</p>
                        <p className="font-semibold text-foreground">{formData.immatriculation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Marque / Modèle</p>
                        <p className="font-semibold text-foreground">{formData.vehicleBrand} {formData.vehicleModel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-semibold text-foreground">{formData.vehicleType}</p>
                      </div>
                      {formData.vin && (
                        <div>
                          <p className="text-sm text-muted-foreground">Numéro VIN</p>
                          <p className="font-semibold text-foreground font-mono text-sm">{formData.vin}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service */}
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Service demandé</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-13">
                      <div>
                        <p className="text-sm text-muted-foreground">Type de service</p>
                        <p className="font-semibold text-foreground">
                          {formData.serviceType === "vitrage" ? "🔷 Vitrage" : "🔶 Carrosserie"}
                        </p>
                      </div>
                      {formData.situation && (
                        <div>
                          <p className="text-sm text-muted-foreground">Situation</p>
                          <p className="font-semibold text-foreground">{formData.situation}</p>
                        </div>
                      )}
                    </div>
                    {/* Selected glass zones */}
                    {formData.serviceType === "vitrage" && formData.selectedGlassZones.length > 0 && (
                      <div className="mt-4 pl-13">
                        <p className="text-sm text-muted-foreground mb-2">Zones de vitrage concernées</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedGlassZones.map((zone) => {
                            const config = glassZones.find((z) => z.id === zone);
                            return (
                              <span
                                key={zone}
                                className="inline-flex items-center bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-full font-medium"
                              >
                                {config?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {formData.description && (
                      <div className="mt-4 pl-13">
                        <p className="text-sm text-muted-foreground">Description des dégâts</p>
                        <p className="font-medium text-foreground bg-gray-50 p-3 rounded-lg mt-1">
                          {formData.description}
                        </p>
                      </div>
                    )}
                    {formData.photos.length > 0 && (
                      <div className="mt-4 pl-13">
                        <p className="text-sm text-muted-foreground mb-2">Photos jointes</p>
                        <div className="flex gap-2 flex-wrap">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{formData.photos.length} photo(s) envoyée(s)</p>
                      </div>
                    )}
                  </div>

                  {/* Coordonnées */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Vos coordonnées</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-13">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nom</p>
                          <p className="font-semibold text-foreground">{formData.civility} {formData.firstName} {formData.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p className="font-semibold text-foreground">{formData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold text-foreground">{formData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Ville</p>
                          <p className="font-semibold text-foreground">{formData.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pl-13">
                      <p className="text-sm text-muted-foreground">Préférence de contact</p>
                      <p className="font-semibold text-foreground">
                        {formData.contactPreference === "email" ? "📧 Par email" : "📞 Par téléphone"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Message et actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                  <p className="text-foreground">
                    Des questions ? Contactez-nous directement au{" "}
                    <a href="tel:0465849498" className="font-bold text-primary hover:underline">
                      04 65 84 94 98
                    </a>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.location.href = "/"}
                    variant="outline"
                    className="px-8"
                  >
                    Retour à l'accueil
                  </Button>
                  <Button
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        immatriculation: "",
                        vehicleBrand: "",
                        vehicleModel: "",
                        vehicleType: "",
                        vin: "",
                        carteGriseFile: null,
                        serviceType: "vitrage",
                        selectedGlassZones: [],
                        photos: [],
                        situation: "",
                        description: "",
                        insuranceName: "",
                        civility: "",
                        lastName: "",
                        firstName: "",
                        email: "",
                        phone: "",
                        location: "",
                        contactPreference: "",
                        consent: false,
                      });
                    }}
                    className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Nouvelle demande
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer hideCta />
    </div>
  );
};

export default Devis;
