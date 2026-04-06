"use client";

import { motion } from "framer-motion";
import React from "react";

export const SelectionGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-3">
      <div className="w-8 h-[1px] bg-red-800" />
      {label}
      <div className="h-[1px] bg-neutral-900 flex-1" />
    </label>
    {children}
  </div>
);

export const OptionCard = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-4 p-6 rounded-sm border transition-all duration-500 ${
      active 
        ? "bg-gradient-to-b from-red-950 to-black border-amber-500/40 shadow-[0_0_30px_rgba(220,38,38,0.15)]" 
        : "bg-black border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900/50"
    }`}
  >
    <span className={`text-3xl transition-all duration-500 ${active ? "drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-110" : "grayscale opacity-50"}`}>
      {icon}
    </span>
    <span className={`font-serif tracking-widest text-[11px] uppercase ${active ? "text-amber-500" : "text-neutral-500"}`}>
      {label}
    </span>
  </motion.button>
);

export const Chip = ({ label, active, onClick }: { label: string | number; active: boolean; onClick: () => void }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
      active 
        ? "bg-red-950 text-amber-500 border-red-800 shadow-md shadow-red-900/20" 
        : "bg-transparent border-neutral-900 text-neutral-600 hover:border-neutral-700 hover:text-neutral-400"
    }`}
  >
    {label}
  </motion.button>
);
