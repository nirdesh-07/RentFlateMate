"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface PrimaryButtonProps extends HTMLMotionProps<"button"> {
  variant?: "navy" | "green";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function PrimaryButton({
  variant = "navy",
  isLoading = false,
  fullWidth = true,
  className = "",
  disabled,
  children,
  ...props
}: PrimaryButtonProps) {
  // Styles based on theme requirements: Navy (#1F2937) and Green (#1DBF73)
  const baseStyle =
    "relative flex items-center justify-center font-body text-sm font-semibold transition-colors duration-200 select-none outline-none disabled:opacity-50 disabled:cursor-not-allowed h-[52px] px-6";
  
  const variantStyles = {
    navy: "bg-[--color-flatmate-navy] hover:bg-slate-700 active:bg-slate-900 text-white rounded-full",
    green: "bg-[--color-flatmate-green] hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-100",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.015 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.985 } : {}}
      className={`${baseStyle} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          {/* Spinner icon */}
          <svg
            className="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
