"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { usePathname } from "next/navigation";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/listings", label: "Browse rooms" },
      { href: "/register", label: "Post a listing" },
      { href: "/#how-it-works", label: "How matching works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/safety", label: "Safety" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp" ||
    pathname?.startsWith("/signup");

  if (isAuthPage) return null;
  return (
    <footer className="border-t border-glass-border mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet to-coral">
              <KeyRound className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            RentFlatemate
          </div>
          <p className="mt-3 text-sm text-ink-muted max-w-xs">
            We score compatibility before you ever send a message, so every conversation starts
            with a reason to keep talking.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold mb-3">{col.title}</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-glass-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-ink-faint flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} RentFlatemate. All rights reserved.</span>
          <span>Made for people who hate scrolling through 200 listings.</span>
        </div>
      </div>
    </footer>
  );
}
