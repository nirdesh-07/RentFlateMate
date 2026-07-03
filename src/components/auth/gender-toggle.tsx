"use client";

import React from "react";
import { motion } from "framer-motion";

interface GenderToggleProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function GenderToggle({ value, onChange, error }: GenderToggleProps) {
  const options = [
    {
      id: "male",
      label: "Male",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 11.517 1.28l-.558.277M12 13.5V18M12 6h.008v.008H12V6z"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: "female",
      label: "Female",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 13.5v5.25m-3.75-3h7.5"
          />
          <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full font-body">
      <label className="text-sm font-semibold text-slate-800 mb-2 block">Gender</label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = value?.toLowerCase() === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.label)}
              className={`flex items-center justify-center gap-2 h-14 border rounded-2xl cursor-pointer transition-all duration-200 outline-none ${
                isSelected
                  ? "border-[--color-flatmate-green] bg-emerald-50/50 text-[--color-flatmate-green] font-semibold"
                  : "border-[--color-flatmate-border] bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
