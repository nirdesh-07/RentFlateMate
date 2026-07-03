"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "@/components/auth/logo";
import { PhoneInput } from "@/components/auth/phone-input";
import { PrimaryButton } from "@/components/auth/primary-button";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setPhoneNumber } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number
    if (!phone) {
      setError("Mobile number is required");
      return;
    }
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.sendOtp(phone);
      if (res.success) {
        setPhoneNumber(phone);
        // Navigate to OTP verification page
        router.push("/verify-otp");
      } else {
        setError(res.message || "Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex min-h-screen bg-[--color-flatmate-bg] text-[--color-flatmate-text] font-body selection:bg-emerald-100">
      
      {/* Left Side: Modern custom SVG illustration (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-[#F6FBFF] items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-blue-100/50 rounded-full blur-2xl" />
        <div className="absolute bottom-[15%] right-[5%] w-48 h-48 bg-emerald-100/40 rounded-full blur-3xl" />
        
        {/* Aesthetic FlatMate match illustration */}
        <div className="w-[65%] max-w-[450px] relative z-10">
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xl">
            {/* Floor/ground line */}
            <path d="M50 420H450" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
            
            {/* Apartment Building/Room background shape */}
            <rect x="100" y="80" width="300" height="340" rx="32" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="130" y="110" width="240" height="180" rx="20" fill="#F8FAFC" />
            
            {/* Warm window looking out to the city */}
            <rect x="210" y="130" width="80" height="100" rx="10" fill="#E0F2FE" />
            <line x1="250" y1="130" x2="250" y2="230" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="210" y1="180" x2="290" y2="180" stroke="#FFFFFF" strokeWidth="3" />
            
            {/* Cozy indoor plant */}
            <rect x="330" y="360" width="20" height="60" rx="4" fill="#A1A1AA" />
            <path d="M315 360C315 340 330 330 340 330C350 330 365 340 365 360H315Z" fill="#10B981" />
            <path d="M325 345C325 330 335 320 340 320C345 320 355 330 355 345H325Z" fill="#047857" />

            {/* Cozy Sofa */}
            <path d="M140 380C140 360 150 350 170 350H330C350 350 360 360 360 380V400H140V380Z" fill="#F3F4F6" />
            <rect x="160" y="370" width="180" height="15" rx="6" fill="#E5E7EB" />
            <rect x="180" y="320" width="40" height="40" rx="8" fill="#F87171" />
            
            {/* Two People matching over cards */}
            {/* Person Left */}
            <circle cx="180" cy="240" r="28" fill="#93C5FD" />
            <path d="M140 310C140 280 160 270 180 270C200 270 220 280 220 310V340H140V310Z" fill="#3B82F6" />
            
            {/* Person Right */}
            <circle cx="320" cy="230" r="28" fill="#FCA5A5" />
            <path d="M280 300C280 270 300 260 320 260C340 260 360 270 360 300V340H280V300Z" fill="#EF4444" />

            {/* Glowing Match Indicator / Compatibility heart speech bubble */}
            <rect x="210" y="240" width="80" height="42" rx="21" fill="#1DBF73" />
            <path d="M250 282L245 289C244.5 290 243.5 290 243 289L238 282H210V240H290V282H250Z" fill="#1DBF73" />
            <path d="M241.6 254C239.5 251.8 236 251.8 233.9 254C231.8 256.2 231.8 259.7 233.9 261.9L245 273L256.1 261.9C258.2 259.7 258.2 256.2 256.1 254C254 251.8 250.5 251.8 248.4 254L245 257.4L241.6 254Z" fill="#FFFFFF" />
            
            {/* Connected sparkles / lines representing matching */}
            <circle cx="210" cy="140" r="3" fill="#FCD34D" />
            <circle cx="290" cy="150" r="4" fill="#FCD34D" />
            <circle cx="330" cy="110" r="3" fill="#10B981" />
          </svg>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-12 md:p-16 relative bg-white">
        
        {/* Top Right Close Button */}
        <Link 
          href="/" 
          className="absolute top-6 right-6 h-10 w-10 border border-[--color-flatmate-border] hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </Link>

        {/* Brand Logo */}
        <div className="mt-4">
          <Logo size="md" />
        </div>

        {/* Form Container */}
        <div className="max-w-[380px] w-full mx-auto my-auto py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-[32px] leading-tight font-extrabold text-slate-900 tracking-tight mb-2">
              Enter Mobile Number
            </h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              We will send an SMS with a 5-digit verification code on this number.
            </p>

            <form onSubmit={handleGetOtp} className="flex flex-col gap-5">
              <PhoneInput
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  setError("");
                }}
                error={error}
                disabled={isLoading}
              />

              <PrimaryButton
                type="submit"
                variant="navy"
                isLoading={isLoading}
                disabled={phone.length !== 10}
              >
                Get OTP
              </PrimaryButton>
            </form>
          </motion.div>
        </div>

        {/* Bottom Help Options */}
        <div className="text-center md:text-left text-sm text-slate-500 flex flex-col sm:flex-row gap-2 justify-between items-center border-t border-[--color-flatmate-border] pt-6">
          <span>Having trouble?</span>
          <Link href="/feedback" className="text-[--color-flatmate-green] font-semibold hover:underline">
            Give Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}
