"use client";

import React from "react";
import { Phone } from "lucide-react";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChange, error, className = "", ...props }: PhoneInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only numbers, limit to 10 digits
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(cleaned);
  };

  return (
    <div className={`w-full font-body ${className}`}>
      <div className="relative">
        {/* Left Side Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400">
          <Phone className="h-5 w-5" strokeWidth={2} />
        </div>

        {/* Numeric Input */}
        <input
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          placeholder="99999 99999"
          className={`w-full h-[56px] pl-14 pr-5 rounded-full border bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200 ${
            error
              ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500"
              : "border-[--color-flatmate-border] focus:ring-1 focus:ring-[--color-flatmate-green] focus:border-[--color-flatmate-green] focus:shadow-[0_0_12px_rgba(29,191,115,0.15)]"
          }`}
          {...props}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-500 mt-1.5 ml-4 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
