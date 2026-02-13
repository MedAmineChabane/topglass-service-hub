import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type GlassZone = 
  | "pare-brise"
  | "lunette-arriere"
  | "vitre-avant-gauche"
  | "vitre-avant-droite"
  | "vitre-arriere-gauche"
  | "vitre-arriere-droite"
  | "toit-panoramique"
  | "deflecteur-avant-gauche"
  | "deflecteur-avant-droite"
  | "deflecteur-arriere-gauche"
  | "deflecteur-arriere-droite"
  | "phare-avant-gauche"
  | "phare-avant-droite"
  | "feu-arriere-gauche"
  | "feu-arriere-droite";

interface GlassZoneConfig {
  id: GlassZone;
  label: string;
  shortLabel: string;
  category: "vitrage" | "optique";
}

const glassZones: GlassZoneConfig[] = [
  { id: "pare-brise", label: "Pare-brise", shortLabel: "Pare-brise", category: "vitrage" },
  { id: "lunette-arriere", label: "Lunette Arrière", shortLabel: "Lunette", category: "vitrage" },
  { id: "vitre-avant-gauche", label: "Vitre Avant Gauche", shortLabel: "Av. G", category: "vitrage" },
  { id: "vitre-avant-droite", label: "Vitre Avant Droite", shortLabel: "Av. D", category: "vitrage" },
  { id: "vitre-arriere-gauche", label: "Vitre Arrière Gauche", shortLabel: "Ar. G", category: "vitrage" },
  { id: "vitre-arriere-droite", label: "Vitre Arrière Droite", shortLabel: "Ar. D", category: "vitrage" },
  { id: "toit-panoramique", label: "Toit Panoramique", shortLabel: "Toit", category: "vitrage" },
  { id: "deflecteur-avant-gauche", label: "Déflecteur Avant Gauche", shortLabel: "Défl. Av. G", category: "vitrage" },
  { id: "deflecteur-avant-droite", label: "Déflecteur Avant Droite", shortLabel: "Défl. Av. D", category: "vitrage" },
  { id: "deflecteur-arriere-gauche", label: "Déflecteur Arrière Gauche", shortLabel: "Défl. Ar. G", category: "vitrage" },
  { id: "deflecteur-arriere-droite", label: "Déflecteur Arrière Droite", shortLabel: "Défl. Ar. D", category: "vitrage" },
  { id: "phare-avant-gauche", label: "Phare Avant Gauche", shortLabel: "Ph. Av. G", category: "optique" },
  { id: "phare-avant-droite", label: "Phare Avant Droite", shortLabel: "Ph. Av. D", category: "optique" },
  { id: "feu-arriere-gauche", label: "Feu Arrière Gauche", shortLabel: "Feu Ar. G", category: "optique" },
  { id: "feu-arriere-droite", label: "Feu Arrière Droite", shortLabel: "Feu Ar. D", category: "optique" },
];

interface GlassSelectorProps {
  selectedZones: GlassZone[];
  onSelectionChange: (zones: GlassZone[]) => void;
}

const GlassSelector = ({ selectedZones, onSelectionChange }: GlassSelectorProps) => {
  const toggleZone = (zone: GlassZone) => {
    if (selectedZones.includes(zone)) {
      onSelectionChange(selectedZones.filter((z) => z !== zone));
    } else {
      onSelectionChange([...selectedZones, zone]);
    }
  };

  const isSelected = (zone: GlassZone) => selectedZones.includes(zone);

  // Style helpers for zones
  const getZoneStyle = (zone: GlassZone) => {
    const config = glassZones.find((z) => z.id === zone);
    const isOptique = config?.category === "optique";
    
    if (isSelected(zone)) {
      return "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30";
    }
    
    if (isOptique) {
      return "bg-amber-100/60 border-amber-300/80 text-amber-700 hover:bg-amber-200/70";
    }
    
    return "bg-sky-200/50 border-sky-400/60 text-sky-800 hover:bg-sky-300/60";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Cliquez sur les zones endommagées (sélection multiple possible)
      </p>
      
      {/* Car Top-Down View - More realistic shape */}
      <div className="relative mx-auto w-full max-w-[280px] aspect-[1/1.6]">
        {/* Car body outline - smoother, more realistic */}
        <div 
          className="absolute inset-[8%] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border-2 border-slate-300/80 shadow-xl"
          style={{
            borderRadius: "45% 45% 40% 40% / 20% 20% 18% 18%",
          }}
        >
          {/* Hood highlight */}
          <div 
            className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[60%] h-[12%] bg-gradient-to-b from-white/60 to-transparent"
            style={{ borderRadius: "50% 50% 30% 30% / 100% 100% 30% 30%" }}
          />
          {/* Center line accent */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[2px] h-[70%] bg-slate-300/50" />
          {/* Trunk highlight */}
          <div 
            className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[55%] h-[10%] bg-gradient-to-t from-white/40 to-transparent"
            style={{ borderRadius: "30% 30% 50% 50% / 30% 30% 100% 100%" }}
          />
        </div>

        {/* Front Headlights */}
        <motion.button
          onClick={() => toggleZone("phare-avant-gauche")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[10%] left-[12%] w-[14%] h-[6%] transition-all duration-200 border-2 flex items-center justify-center text-[8px] font-bold z-10",
            getZoneStyle("phare-avant-gauche")
          )}
          style={{ borderRadius: "40% 60% 60% 40% / 50% 50% 50% 50%" }}
        >
          💡
        </motion.button>

        <motion.button
          onClick={() => toggleZone("phare-avant-droite")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[10%] right-[12%] w-[14%] h-[6%] transition-all duration-200 border-2 flex items-center justify-center text-[8px] font-bold z-10",
            getZoneStyle("phare-avant-droite")
          )}
          style={{ borderRadius: "60% 40% 40% 60% / 50% 50% 50% 50%" }}
        >
          💡
        </motion.button>

        {/* Pare-brise (Front windshield) - wrapper for proper centering */}
        <div className="absolute top-[17%] left-0 right-0 flex justify-center z-10 pointer-events-none">
          <motion.button
            onClick={() => toggleZone("pare-brise")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-[58%] h-full transition-all duration-200 border-2 flex items-center justify-center text-xs font-semibold pointer-events-auto",
              getZoneStyle("pare-brise")
            )}
            style={{ 
              aspectRatio: "5.3/1",
              borderRadius: "50% 50% 35% 35% / 80% 80% 40% 40%" 
            }}
          >
            Pare-brise
          </motion.button>
        </div>

        {/* Vitre Avant Gauche (Front left window) */}
        <motion.button
          onClick={() => toggleZone("vitre-avant-gauche")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "absolute top-[29%] left-[12%] w-[12%] h-[14%] transition-all duration-200 border-2 flex items-center justify-center text-[9px] font-semibold leading-tight text-center z-10",
            getZoneStyle("vitre-avant-gauche")
          )}
          style={{ borderRadius: "30% 50% 50% 30% / 40% 40% 40% 40%" }}
        >
          Av.<br />G
        </motion.button>

        {/* Vitre Avant Droite (Front right window) */}
        <motion.button
          onClick={() => toggleZone("vitre-avant-droite")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "absolute top-[29%] right-[12%] w-[12%] h-[14%] transition-all duration-200 border-2 flex items-center justify-center text-[9px] font-semibold leading-tight text-center z-10",
            getZoneStyle("vitre-avant-droite")
          )}
          style={{ borderRadius: "50% 30% 30% 50% / 40% 40% 40% 40%" }}
        >
          Av.<br />D
        </motion.button>

        {/* Déflecteur Avant Gauche (Front left quarter window) */}
        <motion.button
          onClick={() => toggleZone("deflecteur-avant-gauche")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[28%] left-[12%] w-[8%] h-[5%] transition-all duration-200 border-2 flex items-center justify-center text-[6px] font-bold z-10",
            getZoneStyle("deflecteur-avant-gauche")
          )}
          style={{ borderRadius: "30% 50% 50% 30% / 50% 50% 50% 50%" }}
        >
          ▲
        </motion.button>

        {/* Déflecteur Avant Droite (Front right quarter window) */}
        <motion.button
          onClick={() => toggleZone("deflecteur-avant-droite")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[28%] right-[12%] w-[8%] h-[5%] transition-all duration-200 border-2 flex items-center justify-center text-[6px] font-bold z-10",
            getZoneStyle("deflecteur-avant-droite")
          )}
          style={{ borderRadius: "50% 30% 30% 50% / 50% 50% 50% 50%" }}
        >
          ▲
        </motion.button>

        {/* Toit Panoramique (Panoramic roof) - wrapper for proper centering */}
        <div className="absolute top-[34%] left-0 right-0 flex justify-center z-10 pointer-events-none">
          <motion.button
            onClick={() => toggleZone("toit-panoramique")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-[42%] rounded-xl transition-all duration-200 border-2 flex items-center justify-center text-[10px] font-semibold pointer-events-auto",
              getZoneStyle("toit-panoramique")
            )}
            style={{ aspectRatio: "2.1/1" }}
          >
            Toit<br />Pano.
          </motion.button>
        </div>

        {/* Vitre Arrière Gauche (Rear left window) */}
        <motion.button
          onClick={() => toggleZone("vitre-arriere-gauche")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "absolute top-[53%] left-[12%] w-[12%] h-[14%] transition-all duration-200 border-2 flex items-center justify-center text-[9px] font-semibold leading-tight text-center z-10",
            getZoneStyle("vitre-arriere-gauche")
          )}
          style={{ borderRadius: "30% 50% 50% 30% / 40% 40% 40% 40%" }}
        >
          Ar.<br />G
        </motion.button>

        {/* Vitre Arrière Droite (Rear right window) */}
        <motion.button
          onClick={() => toggleZone("vitre-arriere-droite")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "absolute top-[53%] right-[12%] w-[12%] h-[14%] transition-all duration-200 border-2 flex items-center justify-center text-[9px] font-semibold leading-tight text-center z-10",
            getZoneStyle("vitre-arriere-droite")
          )}
          style={{ borderRadius: "50% 30% 30% 50% / 40% 40% 40% 40%" }}
        >
          Ar.<br />D
        </motion.button>

        {/* Déflecteur Arrière Gauche (Rear left quarter window) */}
        <motion.button
          onClick={() => toggleZone("deflecteur-arriere-gauche")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[65%] left-[12%] w-[8%] h-[5%] transition-all duration-200 border-2 flex items-center justify-center text-[6px] font-bold z-10",
            getZoneStyle("deflecteur-arriere-gauche")
          )}
          style={{ borderRadius: "30% 50% 50% 30% / 50% 50% 50% 50%" }}
        >
          ▼
        </motion.button>

        {/* Déflecteur Arrière Droite (Rear right quarter window) */}
        <motion.button
          onClick={() => toggleZone("deflecteur-arriere-droite")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[65%] right-[12%] w-[8%] h-[5%] transition-all duration-200 border-2 flex items-center justify-center text-[6px] font-bold z-10",
            getZoneStyle("deflecteur-arriere-droite")
          )}
          style={{ borderRadius: "50% 30% 30% 50% / 50% 50% 50% 50%" }}
        >
          ▼
        </motion.button>

        {/* Lunette Arrière (Rear windshield) - wrapper for proper centering */}
        <div className="absolute top-[70%] left-0 right-0 flex justify-center z-10 pointer-events-none">
          <motion.button
            onClick={() => toggleZone("lunette-arriere")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-[50%] transition-all duration-200 border-2 flex items-center justify-center text-xs font-semibold pointer-events-auto",
              getZoneStyle("lunette-arriere")
            )}
            style={{ 
              aspectRatio: "5.5/1",
              borderRadius: "35% 35% 50% 50% / 40% 40% 80% 80%" 
            }}
          >
            Lunette
          </motion.button>
        </div>

        {/* Rear Taillights */}
        <motion.button
          onClick={() => toggleZone("feu-arriere-gauche")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[78%] left-[12%] w-[14%] h-[5%] transition-all duration-200 border-2 flex items-center justify-center text-[8px] font-bold z-10",
            getZoneStyle("feu-arriere-gauche")
          )}
          style={{ borderRadius: "40% 60% 60% 40% / 50% 50% 50% 50%" }}
        >
          🔴
        </motion.button>

        <motion.button
          onClick={() => toggleZone("feu-arriere-droite")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute top-[78%] right-[12%] w-[14%] h-[5%] transition-all duration-200 border-2 flex items-center justify-center text-[8px] font-bold z-10",
            getZoneStyle("feu-arriere-droite")
          )}
          style={{ borderRadius: "60% 40% 40% 60% / 50% 50% 50% 50%" }}
        >
          🔴
        </motion.button>

        {/* Wheels - properly centered with realistic styling */}
        <div 
          className="absolute top-[26%] left-[2%] w-[10%] h-[16%] bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 shadow-md"
          style={{ borderRadius: "45%" }}
        >
          <div className="absolute inset-[20%] bg-gray-500 rounded-full" />
        </div>
        <div 
          className="absolute top-[26%] right-[2%] w-[10%] h-[16%] bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 shadow-md"
          style={{ borderRadius: "45%" }}
        >
          <div className="absolute inset-[20%] bg-gray-500 rounded-full" />
        </div>
        <div 
          className="absolute top-[56%] left-[2%] w-[10%] h-[16%] bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 shadow-md"
          style={{ borderRadius: "45%" }}
        >
          <div className="absolute inset-[20%] bg-gray-500 rounded-full" />
        </div>
        <div 
          className="absolute top-[56%] right-[2%] w-[10%] h-[16%] bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 shadow-md"
          style={{ borderRadius: "45%" }}
        >
          <div className="absolute inset-[20%] bg-gray-500 rounded-full" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-sky-200/50 border border-sky-400/60" />
          <span>Vitrages</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100/60 border border-amber-300/80" />
          <span>Optiques</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary border border-primary" />
          <span>Sélectionné</span>
        </div>
      </div>

      {/* Selected zones summary */}
      {selectedZones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-lg p-3"
        >
          <p className="text-sm font-medium text-foreground mb-2">
            Zones sélectionnées ({selectedZones.length}) :
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedZones.map((zone) => {
              const config = glassZones.find((z) => z.id === zone);
              return (
                <span
                  key={zone}
                  className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                >
                  {config?.label}
                  <button
                    onClick={() => toggleZone(zone)}
                    className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Checkbox list - synchronized with visual schema */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Ou cochez dans la liste :</p>
        
        {/* Vitrages */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Vitrages</p>
          <div className="grid grid-cols-2 gap-2">
            {glassZones.filter(z => z.category === "vitrage").map((zone) => (
              <label
                key={zone.id}
                className={cn(
                  "flex items-center gap-2 py-2 px-3 rounded-lg border-2 transition-all cursor-pointer text-sm",
                  isSelected(zone.id)
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-white border-gray-200 text-muted-foreground hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={isSelected(zone.id)}
                  onCheckedChange={() => toggleZone(zone.id)}
                  className="data-[state=checked]:bg-primary"
                />
                {zone.label}
              </label>
            ))}
          </div>
        </div>

        {/* Optiques */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Optiques</p>
          <div className="grid grid-cols-2 gap-2">
            {glassZones.filter(z => z.category === "optique").map((zone) => (
              <label
                key={zone.id}
                className={cn(
                  "flex items-center gap-2 py-2 px-3 rounded-lg border-2 transition-all cursor-pointer text-sm",
                  isSelected(zone.id)
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-white border-gray-200 text-muted-foreground hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={isSelected(zone.id)}
                  onCheckedChange={() => toggleZone(zone.id)}
                  className="data-[state=checked]:bg-primary"
                />
                {zone.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { GlassSelector, glassZones };
export type { GlassZoneConfig };
