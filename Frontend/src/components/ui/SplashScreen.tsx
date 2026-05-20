"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap } from "lucide-react";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  // Lock scrolling while splash screen is visible
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [show]);

  useEffect(() => {
    // Dismiss the splash screen after the full animation sequence completes
    const timer = setTimeout(() => {
      setShow(false);
    }, 2800); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.05 }} // Fade out and slightly zoom in on exit
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          {/* Subtle geometric pattern background similar to the reference */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="geomGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0039a6" strokeWidth="2"/>
                  <path d="M 0 100 L 100 0" fill="none" stroke="#0039a6" strokeWidth="1"/>
                  <path d="M 0 0 L 100 100" fill="none" stroke="#0039a6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#geomGrid)" />
            </svg>
          </div>

          <motion.div
            className="flex flex-col items-center relative z-10"
            initial={{ y: 20 }} // Start slightly lower so it's visually centered before text appears
            animate={{ y: -20 }} // Slide up smoothly
            transition={{ delay: 1.0, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Step 1: Logo starts very small and scales up */}
            <motion.div 
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-24 h-24 bg-[#0039a6] rounded-2xl flex items-center justify-center shadow-xl"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Step 2: Text smoothly fades/slides in below the logo as it moves up */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-full mt-5 whitespace-nowrap"
            >
                <h1 className="text-3xl font-bold tracking-tight text-[#0039a6] font-sans">
                  TalentLMS
                </h1>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}