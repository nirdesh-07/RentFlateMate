"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Dropdown({ label, options, error, className = "", ...props }: DropdownProps) {
  return (
    <div className={`w-full font-body ${className}`}>
      <label className="text-sm font-semibold text-slate-800 mb-2 block">
        {label}
      </label>
      <div className="relative">
        <select
          className={`w-full h-[56px] px-5 rounded-2xl border bg-white text-base text-slate-800 appearance-none outline-none cursor-pointer transition-all duration-200 ${
            error
              ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500"
              : "border-[--color-flatmate-border] focus:ring-1 focus:ring-[--color-flatmate-green] focus:border-[--color-flatmate-green] focus:shadow-[0_0_12px_rgba(29,191,115,0.15)]"
          }`}
          defaultValue=""
          {...props}
        >
          <option value="" disabled hidden>
            Select {label.toLowerCase()}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron icon */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
        </div>
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
