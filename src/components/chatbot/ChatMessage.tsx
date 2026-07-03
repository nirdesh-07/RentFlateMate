"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "bot";
  text: string;
}

/** Converts simple markdown-ish formatting to JSX: **bold**, \n newlines */
function renderText(text: string) {
  // Split on double-newline for paragraph breaks, single newline for line breaks
  return text.split("\n").map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={j} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      )
    );
    return (
      <React.Fragment key={i}>
        {rendered}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export function ChatMessage({ role, text }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm shadow-md mt-0.5">
          🤖
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-violet-600 text-white rounded-tr-sm ml-auto"
            : "bg-white/[0.07] border border-white/10 text-slate-200 rounded-tl-sm"
        }`}
      >
        {renderText(text)}
      </div>
    </motion.div>
  );
}
