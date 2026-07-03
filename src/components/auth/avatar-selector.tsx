"use client";

import React from "react";

interface AvatarSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

// 6 custom SVG avatars that look modern, premium, and unique.
// Each SVG contains a stylized face representation.
export const avatars = [
  {
    id: "avatar_1",
    url: "/avatars/avatar_1.svg",
    color: "bg-blue-100 text-blue-600",
    svg: (
      <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#E0F2FE" />
        <circle cx="50" cy="40" r="18" fill="#0284C7" />
        <path d="M18 82C18 64.3269 32.3269 50 50 50C67.6731 50 82 64.3269 82 82" fill="#0284C7" />
        <circle cx="43" cy="40" r="2.5" fill="#FFFFFF" />
        <circle cx="57" cy="40" r="2.5" fill="#FFFFFF" />
        <path d="M47 48C47 48 48.5 50 50 50C51.5 50 53 48 53 48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "avatar_2",
    url: "/avatars/avatar_2.svg",
    color: "bg-pink-100 text-pink-600",
    svg: (
      <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#FCE7F3" />
        <circle cx="50" cy="38" r="16" fill="#DB2777" />
        <path d="M20 80C20 65.6406 33.4315 54 50 54C66.5685 54 80 65.6406 80 80" fill="#DB2777" />
        <path d="M38 32C42 24 58 24 62 32" stroke="#DB2777" strokeWidth="4" strokeLinecap="round" />
        <circle cx="44" cy="38" r="2.5" fill="#FFFFFF" />
        <circle cx="56" cy="38" r="2.5" fill="#FFFFFF" />
        <path d="M47 45.5C47 45.5 48.5 47 50 47C51.5 47 53 45.5 53 45.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "avatar_3",
    url: "/avatars/avatar_3.svg",
    color: "bg-amber-100 text-amber-600",
    svg: (
      <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#FEF3C7" />
        <circle cx="50" cy="39" r="17" fill="#D97706" />
        <path d="M19 81C19 64.9837 32.8792 52 50 52C67.1208 52 81 64.9837 81 81" fill="#D97706" />
        <circle cx="44" cy="39" r="2.5" fill="#FFFFFF" />
        <circle cx="56" cy="39" r="2.5" fill="#FFFFFF" />
        <path d="M40 31L60 31" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        <path d="M47 46C47 46 48.5 48 50 48C51.5 48 53 46 53 46" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "avatar_4",
    url: "/avatars/avatar_4.svg",
    color: "bg-purple-100 text-purple-600",
    svg: (
      <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#F3E8FF" />
        <circle cx="50" cy="41" r="17" fill="#9333EA" />
        <path d="M21 83C21 66.4315 33.9837 53 50 53C66.0163 53 79 66.4315 79 83" fill="#9333EA" />
        <path d="M30 40C30 25 70 25 70 40" stroke="#9333EA" strokeWidth="4" strokeLinecap="round" />
        <circle cx="43" cy="41" r="2" fill="#FFFFFF" />
        <circle cx="57" cy="41" r="2" fill="#FFFFFF" />
        <path d="M46 48C48 50 52 50 54 48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "avatar_5",
    url: "/avatars/avatar_5.svg",
    color: "bg-emerald-100 text-emerald-600",
    svg: (
      <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#D1FAE5" />
        <circle cx="50" cy="40" r="18" fill="#059669" />
        <path d="M18 82C18 64.3269 32.3269 50 50 50C67.6731 50 82 64.3269 82 82" fill="#059669" />
        <circle cx="43" cy="38" r="2.5" fill="#FFFFFF" />
        <circle cx="57" cy="38" r="2.5" fill="#FFFFFF" />
        <path d="M46 47C48 45 52 45 54 47" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "avatar_6",
    url: "/avatars/avatar_6.svg",
    color: "bg-violet-100 text-violet-600",
    svg: (
      <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#EDE9FE" />
        <circle cx="50" cy="39" r="17" fill="#4F46E5" />
        <path d="M19 81C19 64.9837 32.8792 52 50 52C67.1208 52 81 64.9837 81 81" fill="#4F46E5" />
        <path d="M33 33L42 37L50 33L58 37L67 33" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="40" r="2.5" fill="#FFFFFF" />
        <circle cx="56" cy="40" r="2.5" fill="#FFFFFF" />
        <path d="M47 46.5C47 46.5 48.5 48 50 48C51.5 48 53 46.5 53 46.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
  return (
    <div className="w-full font-body">
      <label className="text-sm font-semibold text-slate-800 mb-2.5 block">
        Choose Avatar
      </label>
      <div className="grid grid-cols-6 gap-3">
        {avatars.map((av) => {
          const isSelected = value === av.url;
          return (
            <button
              key={av.id}
              type="button"
              onClick={() => onChange(av.url)}
              className={`aspect-square w-full rounded-2xl p-1 cursor-pointer transition-all duration-200 focus:outline-none ${
                isSelected
                  ? "ring-2 ring-[--color-flatmate-green] ring-offset-2 scale-105"
                  : "border border-[--color-flatmate-border] hover:border-slate-300 hover:scale-102"
              }`}
            >
              <div className="w-full h-full rounded-xl overflow-hidden">
                {av.svg}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
