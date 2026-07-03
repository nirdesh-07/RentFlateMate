"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="text-xs uppercase tracking-wider text-emerald mb-2">Real conversations</p>
        <h2 className="font-display text-3xl font-bold">People who matched, moved, and stayed</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-card p-6 flex flex-col"
          >
            <Quote className="h-6 w-6 text-violet-soft mb-4" />
            <p className="text-sm text-ink leading-relaxed flex-1">"{t.quote}"</p>
            <div className="mt-5 pt-4 border-t border-glass-border">
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-ink-faint">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
