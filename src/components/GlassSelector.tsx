import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type GlassZone = 
  | "pare-brise"
  | "lunette-arriere"
  | "vitre-avant-gauche"
  | "vitre-avant-droite"
  | "vitre-arriere-gauche"
  | "vitre-arriere-droite"
  | "toit-panoramique";

interface GlassZoneConfig {
  id: GlassZone;
  label: string;
  shortLabel: string;
}

const glassZones: GlassZoneConfig[] = [
  { id: "pare-brise", label: "Pare-brise", shortLabel: "Pare-brise" },
  { id: "lunette-arriere", label: "Lunette Arrière", shortLabel: "Lunette" },
  { id: "vitre-avant-gauche", label: "Vitre Avant Gauche", shortLabel: "Av. G" },
  { id: "vitre-avant-droite", label: "Vitre Avant Droite", shortLabel: "Av. D" },
  { id: "vitre-arriere-gauche", label: "Vitre Arrière Gauche", shortLabel: "Ar. G" },
  { id: "vitre-arriere-droite", label: "Vitre Arrière Droite", shortLabel: "Ar. D" },
  { id: "toit-panoramique", label: "Toit Panoramique", shortLabel: "Toit" },
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Cliquez sur les zones endommagées (sélection multiple possible)
      </p>
      
      {/* Car Top-Down View */}
      <div className="relative mx-auto w-full max-w-xs aspect-[2/3]">
        {/* Car body outline */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-[40%_40%_35%_35%/15%_15%_20%_20%] border-2 border-gray-300 shadow-lg">
          {/* Hood gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[15%] bg-gradient-to-b from-gray-300/50 to-transparent rounded-t-full" />
          {/* Trunk gradient */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[12%] bg-gradient-to-t from-gray-300/50 to-transparent rounded-b-full" />
        </div>

        {/* Pare-brise (Front windshield) - Top area */}
        <motion.button
          onClick={() => toggleZone("pare-brise")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute top-[8%] left-1/2 -translate-x-1/2 w-[65%] h-[12%] rounded-[50%_50%_40%_40%/100%_100%_50%_50%] transition-all duration-200 border-2 flex items-center justify-center text-xs font-semibold",
            isSelected("pare-brise")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Pare-brise
        </motion.button>

        {/* Toit Panoramique (Panoramic roof) - Center */}
        <motion.button
          onClick={() => toggleZone("toit-panoramique")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute top-[28%] left-1/2 -translate-x-1/2 w-[50%] h-[25%] rounded-lg transition-all duration-200 border-2 flex items-center justify-center text-xs font-semibold",
            isSelected("toit-panoramique")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Toit<br />Panoramique
        </motion.button>

        {/* Vitre Avant Gauche (Front left window) */}
        <motion.button
          onClick={() => toggleZone("vitre-avant-gauche")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute top-[22%] left-[5%] w-[18%] h-[18%] rounded-[20%_40%_40%_20%/30%_30%_30%_30%] transition-all duration-200 border-2 flex items-center justify-center text-[10px] font-semibold leading-tight text-center",
            isSelected("vitre-avant-gauche")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Av.<br />G
        </motion.button>

        {/* Vitre Avant Droite (Front right window) */}
        <motion.button
          onClick={() => toggleZone("vitre-avant-droite")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute top-[22%] right-[5%] w-[18%] h-[18%] rounded-[40%_20%_20%_40%/30%_30%_30%_30%] transition-all duration-200 border-2 flex items-center justify-center text-[10px] font-semibold leading-tight text-center",
            isSelected("vitre-avant-droite")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Av.<br />D
        </motion.button>

        {/* Vitre Arrière Gauche (Rear left window) */}
        <motion.button
          onClick={() => toggleZone("vitre-arriere-gauche")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute top-[45%] left-[5%] w-[18%] h-[18%] rounded-[20%_40%_40%_20%/30%_30%_30%_30%] transition-all duration-200 border-2 flex items-center justify-center text-[10px] font-semibold leading-tight text-center",
            isSelected("vitre-arriere-gauche")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Ar.<br />G
        </motion.button>

        {/* Vitre Arrière Droite (Rear right window) */}
        <motion.button
          onClick={() => toggleZone("vitre-arriere-droite")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute top-[45%] right-[5%] w-[18%] h-[18%] rounded-[40%_20%_20%_40%/30%_30%_30%_30%] transition-all duration-200 border-2 flex items-center justify-center text-[10px] font-semibold leading-tight text-center",
            isSelected("vitre-arriere-droite")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Ar.<br />D
        </motion.button>

        {/* Lunette Arrière (Rear windshield) - Bottom area */}
        <motion.button
          onClick={() => toggleZone("lunette-arriere")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[55%] h-[10%] rounded-[40%_40%_50%_50%/50%_50%_100%_100%] transition-all duration-200 border-2 flex items-center justify-center text-xs font-semibold",
            isSelected("lunette-arriere")
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-sky-100/80 border-sky-300 text-sky-700 hover:bg-sky-200/90"
          )}
        >
          Lunette
        </motion.button>

        {/* Wheels - decorative */}
        <div className="absolute top-[18%] left-[-2%] w-[12%] h-[20%] bg-gray-800 rounded-[40%] border-2 border-gray-600" />
        <div className="absolute top-[18%] right-[-2%] w-[12%] h-[20%] bg-gray-800 rounded-[40%] border-2 border-gray-600" />
        <div className="absolute bottom-[22%] left-[-2%] w-[12%] h-[20%] bg-gray-800 rounded-[40%] border-2 border-gray-600" />
        <div className="absolute bottom-[22%] right-[-2%] w-[12%] h-[20%] bg-gray-800 rounded-[40%] border-2 border-gray-600" />
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

      {/* Legend for mobile */}
      <div className="grid grid-cols-2 gap-2 text-xs md:hidden">
        {glassZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => toggleZone(zone.id)}
            className={cn(
              "py-2 px-3 rounded-lg border-2 transition-all text-left",
              isSelected(zone.id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white border-gray-200 text-muted-foreground hover:border-primary/50"
            )}
          >
            {zone.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { GlassSelector, glassZones };
export type { GlassZoneConfig };
