"use client";

import React, { useRef, useState, useEffect } from "react";

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function OTPInput({ value, onChange, error }: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Keep digits in sync with parent value string
  useEffect(() => {
    const newDigits = Array(6).fill("");
    for (let i = 0; i < Math.min(value.length, 6); i++) {
      newDigits[i] = value[i];
    }
    setDigits(newDigits);
  }, [value]);

  // Autofocus the first box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (val: string, index: number) => {
    // Only accept numbers
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      // If cleared, update digit and propagate empty value
      const updated = [...digits];
      updated[index] = "";
      setDigits(updated);
      onChange(updated.join(""));
      return;
    }

    const singleChar = cleaned[cleaned.length - 1]; // get the last character entered
    const updated = [...digits];
    updated[index] = singleChar;
    setDigits(updated);
    
    const combinedVal = updated.join("");
    onChange(combinedVal);

    // Auto-focus next box if not the last one
    if (index < 5 && singleChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const updated = [...digits];
      
      // If the current field has text, clear it
      if (digits[index]) {
        updated[index] = "";
        setDigits(updated);
        onChange(updated.join(""));
      } else if (index > 0) {
        // If the current field is empty and we press backspace, go to previous and clear it
        updated[index - 1] = "";
        setDigits(updated);
        onChange(updated.join(""));
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    // Match only numeric characters
    const numericPaste = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (numericPaste.length > 0) {
      const updated = Array(6).fill("");
      for (let i = 0; i < numericPaste.length; i++) {
        updated[i] = numericPaste[i];
      }
      setDigits(updated);
      onChange(updated.join(""));

      // Focus the last populated field or the 6th field
      const targetFocusIndex = Math.min(numericPaste.length, 5);
      inputRefs.current[targetFocusIndex]?.focus();
    }
  };

  return (
    <div className="w-full font-body">
      <div className="flex justify-between gap-2.5 sm:gap-4 my-6">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className={`w-[48px] h-[52px] sm:w-[56px] sm:h-[56px] text-center text-xl font-bold bg-white text-slate-800 border rounded-2xl outline-none transition-all duration-200 ${
              error
                ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                : digit
                ? "border-[--color-flatmate-green] focus:ring-1 focus:ring-[--color-flatmate-green] focus:border-[--color-flatmate-green] shadow-[0_0_8px_rgba(29,191,115,0.08)]"
                : "border-[--color-flatmate-border] focus:ring-1 focus:ring-[--color-flatmate-green] focus:border-[--color-flatmate-green]"
            }`}
          />
        ))}
      </div>
      
      {error && (
        <span className="text-xs text-red-500 mt-1 block text-center font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
