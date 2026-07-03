"use client";

import React from "react";

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    /* 
      This wrapper overrides colors and style tokens specifically for the auth flow 
      to ensure it matches the clean, light, FlatMate style.
    */
    <div className="flatmate-theme min-h-screen bg-[--color-flatmate-bg] text-[--color-flatmate-text] flex flex-col font-body antialiased selection:bg-emerald-200">
      {children}
    </div>
  );
}
