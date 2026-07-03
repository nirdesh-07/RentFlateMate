"use client";

import { motion } from "framer-motion";
import { Search, MapPin, IndianRupee, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-aurora">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-pill px-4 py-1.5 text-xs text-ink-muted mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            AI-scored matches, not endless scrolling
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            Find a room, <span className="text-gradient">find a flatmate</span> who actually fits.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-ink-muted text-lg max-w-xl"
          >
            Every listing gets a compatibility score against your profile, budget, and lifestyle —
            before you ever send a message. List a room or find one in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 glass-strong rounded-2xl p-3 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <Input placeholder="City or locality" className="pl-10 border-none bg-transparent h-12" />
            </div>
            <div className="relative flex-1">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <Input placeholder="Max budget" className="pl-10 border-none bg-transparent h-12" />
            </div>
            <Link href="/listings" className="sm:w-auto w-full">
              <Button size="lg" className="w-full sm:w-auto h-12">
                <Search className="h-4 w-4" />
                Search rooms
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 flex items-center gap-6 text-sm text-ink-faint"
          >
            <span>12,400+ listings</span>
            <span className="h-1 w-1 rounded-full bg-ink-faint" />
            <span>38 cities</span>
            <span className="h-1 w-1 rounded-full bg-ink-faint" />
            <Link href="/register" className="text-violet-soft hover:underline inline-flex items-center gap-1">
              List your room <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden md:block"
        >
          <div className="glass-strong rounded-card p-6 rotate-2 shadow-glow-violet">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-ink-faint">HSR Layout, Bengaluru</p>
                <p className="font-display font-semibold">Sunlit 2BHK, balcony</p>
              </div>
              <CompatibilityRing score={92} size={64} strokeWidth={6} />
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              "Budget and locality match closely; move-in date aligns within your window."
            </p>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 glass-strong rounded-2xl p-4 -rotate-3 shadow-glow-coral w-48"
          >
            <div className="flex items-center gap-3">
              <CompatibilityRing score={65} size={44} strokeWidth={4} />
              <div>
                <p className="text-xs font-medium">Andheri West</p>
                <p className="text-[11px] text-ink-faint">Rent above budget</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
