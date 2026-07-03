"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CompatibilityRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: boolean;
  className?: string;
}

/**
 * The recurring signature motif of RentFlatemate: a gradient ring that
 * visualizes the AI compatibility score. Used in the hero, listing cards,
 * and the tenant/owner dashboards so the score is always legible at a glance.
 */
export function CompatibilityRing({
  score,
  size = 96,
  strokeWidth = 8,
  label = true,
  className,
}: CompatibilityRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 80 ? "var(--color-emerald)" : clamped >= 55 ? "var(--color-violet-soft)" : "var(--color-coral)";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-gradient-${clamped}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-violet)" />
            <stop offset="55%" stopColor="var(--color-coral)" />
            <stop offset="100%" stopColor="var(--color-emerald)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-glass-border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-gradient-${clamped})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-data text-lg font-semibold leading-none" style={{ color: tone }}>
            {clamped}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-wider text-ink-muted">match</span>
        </div>
      )}
    </div>
  );
}
