"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { usePathname } from "next/navigation";

const links = [
  { href: "/listings", label: "Browse rooms" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp" ||
    pathname?.startsWith("/signup");

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-6xl glass-strong rounded-pill px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet to-coral">
            <KeyRound className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          RentFlatemate
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Get started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden h-10 w-10 inline-flex items-center justify-center text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden mx-auto max-w-6xl mt-2 glass-strong rounded-3xl p-5 flex flex-col gap-4"
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink">
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-glass-border">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Get started
                </Button>
              </Link>
              <button onClick={toggle} aria-label="Toggle theme" className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink-muted">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
