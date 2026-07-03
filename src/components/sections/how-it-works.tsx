"use client";

import { motion } from "framer-motion";
import { UserCircle, Sparkles, MessageCircle } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: UserCircle,
    title: "Build your profile",
    body: "Tenants set budget, location, and lifestyle preferences. Owners list their room with photos, rent, and house rules.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "AI scores the match",
    body: "Every listing gets a 0–100 compatibility score against your profile, with a plain-language explanation of why.",
  },
  {
    n: "03",
    icon: MessageCircle,
    title: "Request, accept, chat",
    body: "Send interest on a strong match. Once the owner accepts, real-time chat unlocks instantly — no waiting.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="text-xs uppercase tracking-wider text-coral-soft mb-2">The process</p>
        <h2 className="font-display text-3xl font-bold">Three steps, in order, every time</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-violet/40 via-coral/40 to-emerald/40" />
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative glass rounded-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-data text-3xl font-semibold text-ink-faint">{s.n}</span>
              <span className="h-10 w-10 rounded-full bg-gradient-to-br from-violet to-coral flex items-center justify-center">
                <s.icon className="h-5 w-5 text-white" />
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
