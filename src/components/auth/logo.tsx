import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-body font-bold text-slate-800 focus:outline-none ${className}`}
    >
      {/* Visual House/Heart/Key logo icon in FlatMate Green */}
      <div
        className={`flex items-center justify-center rounded-xl bg-[--color-flatmate-green] text-white shadow-md shadow-emerald-200/50 ${
          isSm ? "h-8 w-8 text-sm" : isLg ? "h-12 w-12 text-2xl" : "h-10 w-10 text-xl"
        }`}
      >
        <svg
          className="h-1/2 w-1/2 fill-none stroke-current"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M2.25 12l8.954-8.955a1.25 1.25 0 011.792 0L21.75 12M13.5 9.375h.008v.008h-.008V9.375zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
      </div>
      <span
        className={`tracking-tight text-slate-900 select-none ${
          isSm ? "text-base" : isLg ? "text-2xl" : "text-xl font-extrabold"
        }`}
      >
        Flat<span className="text-[--color-flatmate-green]">Mate</span>
      </span>
    </Link>
  );
}
