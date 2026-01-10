import React, { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const SplineBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Gradient fallback - visible during loading */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 gradient-hero"
          />
        )}
      </AnimatePresence>

      {/* Spline 3D Scene */}
      <Suspense fallback={null}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <Spline
            scene="https://prod.spline.design/O6EFeeZrk3xyQ0-u/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </motion.div>
      </Suspense>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/70 pointer-events-none" />
    </div>
  );
};

export default SplineBackground;
