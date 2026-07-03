"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Fixed portal container — always bottom-right, above everything
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        title={isOpen ? "Close FlatmateBot" : "Chat with FlatmateBot"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative h-14 w-14 rounded-full shadow-xl cursor-pointer flex items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        style={{
          background: "linear-gradient(135deg, #7c6bff 0%, #6355e8 50%, #4f3fc7 100%)",
          boxShadow: "0 8px 32px rgba(124, 107, 255, 0.45), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Pulse ring (only when closed) */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-violet-500/40 animate-ping" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="relative z-10"
            >
              <X className="h-6 w-6 text-white" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="robot"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 text-2xl leading-none select-none"
              role="img"
              aria-label="FlatmateBot Assistant"
            >
              🤖
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip label — shows on hover when closed */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-[68px] right-0 pointer-events-none"
        >
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            <span className="text-emerald-400">●</span>
            Ask FlatmateBot
          </div>
        </motion.div>
      )}
    </div>
  );
}
