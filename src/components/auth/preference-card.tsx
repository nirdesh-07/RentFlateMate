"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  BookOpen,
  Dumbbell,
  Trophy,
  Compass,
  Sparkles,
  Leaf,
  Music,
  WineOff,
  Ban,
} from "lucide-react";

interface PreferenceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

// Icon helper function based on the preferences list
function getPrefIcon(label: string) {
  const size = "h-6 w-6";
  const name = label.toLowerCase();

  // Custom Pet Lover SVG path (Paw) since PawPrint is not always in older lucide packs
  const PawIcon = () => (
    <svg
      className={`${size}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 4 1-.5 3-2 3-4 0-1.66-1.34-3-3-3zm-4.5-3.5c-.83 0-1.5.67-1.5 1.5 0 .7.4 1.3 1 1.5s1.3-.1 1.5-.7c.2-.5.1-1.1-.3-1.4-.2-.5-.5-.9-.7-.9zm9 0c-.2 0-.5.4-.7.9-.4.3-.5.9-.3 1.4.2.6.9.9 1.5.7s1-.8 1-1.5c0-.83-.67-1.5-1.5-1.5zm-8.5-3c-.83 0-1.5.67-1.5 1.5 0 .6.3 1.1.8 1.4.5.3 1.2.2 1.5-.3.3-.5.2-1.2-.3-1.5-.2-.1-.3-.1-.5-.1zm8 0c-.2 0-.3 0-.5.1-.5.3-.6 1-.3 1.5.3.5 1 .6 1.5.3.5-.3.8-.8.8-1.4 0-.83-.67-1.5-1.5-1.5z" />
    </svg>
  );

  if (name.includes("owl")) return <Moon className={size} />;
  if (name.includes("bird")) return <Sun className={size} />;
  if (name.includes("studious")) return <BookOpen className={size} />;
  if (name.includes("fitness")) return <Dumbbell className={size} />;
  if (name.includes("sporty")) return <Trophy className={size} />;
  if (name.includes("wanderer")) return <Compass className={size} />;
  if (name.includes("party")) return <Sparkles className={size} />;
  if (name.includes("pet")) return <PawIcon />;
  if (name.includes("vegan")) return <Leaf className={size} />;
  if (name.includes("alcoholic")) return <WineOff className={size} />;
  if (name.includes("music")) return <Music className={size} />;
  if (name.includes("smoker")) return <Ban className={size} />;

  return <Sparkles className={size} />;
}

export function PreferenceCard({ id, label, isSelected, onToggle }: PreferenceCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(id)}
      className={`aspect-square w-full rounded-full flex flex-col items-center justify-center p-4 cursor-pointer border text-center transition-all duration-200 outline-none select-none ${
        isSelected
          ? "border-[--color-flatmate-green] bg-emerald-50 text-[--color-flatmate-green] font-semibold shadow-md shadow-emerald-100"
          : "border-[--color-flatmate-border] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
      }`}
    >
      <div className={`mb-2.5 transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
        {getPrefIcon(label)}
      </div>
      <span className="text-xs sm:text-sm leading-tight px-1 font-medium">{label}</span>
    </motion.button>
  );
}
