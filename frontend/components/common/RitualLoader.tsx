"use client";

import { motion } from "framer-motion";

export default function RitualLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-[4px] border-gray-100 border-t-blue-500 rounded-full"
      />
      <motion.div 
        className="absolute w-16 h-16 bg-blue-500/20 rounded-full blur-xl"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
