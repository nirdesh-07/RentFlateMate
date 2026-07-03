"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/auth/logo";
import { PreferenceCard } from "@/components/auth/preference-card";
import { PrimaryButton } from "@/components/auth/primary-button";
import { authService } from "@/services/auth";

const PREFERENCE_OPTIONS = [
  { id: "night_owl", label: "Night Owl" },
  { id: "early_bird", label: "Early Bird" },
  { id: "studious", label: "Studious" },
  { id: "fitness_freak", label: "Fitness Freak" },
  { id: "sporty", label: "Sporty" },
  { id: "wanderer", label: "Wanderer" },
  { id: "party_lover", label: "Party Lover" },
  { id: "pet_lover", label: "Pet Lover" },
  { id: "vegan", label: "Vegan" },
  { id: "non_alcoholic", label: "Non Alcoholic" },
  { id: "music_lover", label: "Music Lover" },
  { id: "non_smoker", label: "Non Smoker" },
];

export default function PreferenceSelectionPage() {
  const router = useRouter();
  const { phoneNumber, personalDetails, setPreferences, login } = useAuth();
  
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Redirect to login if user bypasses entry pages
  useEffect(() => {
    if (!phoneNumber || !personalDetails) {
      router.replace("/login");
    }
  }, [phoneNumber, personalDetails, router]);

  const handleTogglePref = (id: string) => {
    setError("");
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selectedPrefs.length === 0) {
      setError("Please select at least one trait to help matches find you!");
      return;
    }

    setIsLoading(true);
    try {
      // Find full labels for preferences
      const fullPrefLabels = selectedPrefs.map(
        (id) => PREFERENCE_OPTIONS.find((opt) => opt.id === id)?.label || id
      );

      // Save preferences to context state
      setPreferences(fullPrefLabels);

      // Call API registration service
      const res = await authService.registerProfile(phoneNumber, {
        name: personalDetails!.name,
        whoYouAre: personalDetails!.whoYouAre,
        gender: personalDetails!.gender,
        city: personalDetails!.city,
        avatarUrl: personalDetails!.avatarUrl,
        preferences: fullPrefLabels,
      });

      if (res.success) {
        // Start animation loader
        setIsAnalyzing(true);
        setAnalysisStep(0);
        
        const stepsCount = 5;
        for (let i = 0; i < stepsCount; i++) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          setAnalysisStep((prev) => prev + 1);
        }

        // Mark as fully logged-in and redirect to Dashboard/Home
        login();
        router.push("/dashboard");
      } else {
        setError(res.message || "Failed to save preferences. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAnalyzing) {
    const steps = [
      "Analyzing lifestyle preferences...",
      "Evaluating gender & budget criteria...",
      "Computing compatibility scores...",
      "Syncing seekers in " + (personalDetails?.city || "your city") + "...",
      "Matching complete! Opening dashboard...",
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 min-h-screen bg-[--color-flatmate-bg]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px] bg-white rounded-3xl border border-[--color-flatmate-border] p-8 sm:p-10 shadow-xl shadow-slate-100/50 text-center flex flex-col items-center justify-center"
        >
          {/* Pulsing/rotating compatibility-like visual */}
          <div className="relative h-28 w-28 mb-8 flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-violet/20 animate-spin" style={{ animationDuration: '8s' }} />
            {/* Middle ring */}
            <div className="absolute inset-2 rounded-full border-4 border-violet animate-pulse" />
            {/* Inner heart/sparkle */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-violet to-coral flex items-center justify-center shadow-lg shadow-violet-500/20 text-white text-xl">
              ✨
            </div>
          </div>

          <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-2">
            AI Roommate Matcher
          </h2>
          <p className="text-sm text-slate-500 max-w-[280px] leading-relaxed mb-6">
            We are analyzing seeker profiles to identify your ideal co-living match.
          </p>

          {/* Loader bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-violet via-coral to-emerald"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, (analysisStep / 4) * 100)}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Dynamic Step Text */}
          <motion.p
            key={analysisStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-violet"
          >
            {steps[Math.min(analysisStep, steps.length - 1)]}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 min-h-screen bg-[--color-flatmate-bg]">
      {/* Top right close button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 right-6 h-10 w-10 border border-[--color-flatmate-border] hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[620px] bg-white rounded-3xl border border-[--color-flatmate-border] p-8 sm:p-10 shadow-xl shadow-slate-100/50 mt-6"
      >
        {/* Header navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer font-semibold"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          
          <span className="text-xs font-bold text-[--color-flatmate-green] bg-emerald-50 px-3 py-1 rounded-full">
            Step 2 of 2
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
          What type of flatmate do you like?
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Select the lifestyle habits and characteristics you prefer. We'll prioritize rooms and profiles matching these.
        </p>

        {/* Grid of Circular Selectable Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 my-6">
          {PREFERENCE_OPTIONS.map((opt) => (
            <PreferenceCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              isSelected={selectedPrefs.includes(opt.id)}
              onToggle={handleTogglePref}
            />
          ))}
        </div>

        {error && (
          <span className="text-xs text-red-500 mt-2 mb-4 block text-center font-medium">
            {error}
          </span>
        )}

        {/* Continue Button Centered */}
        <div className="flex justify-center mt-6">
          <PrimaryButton
            onClick={handleContinue}
            variant="green"
            className="max-w-[280px]"
            isLoading={isLoading}
          >
            Finish Setup
          </PrimaryButton>
        </div>
      </motion.div>
    </div>
  );
}
