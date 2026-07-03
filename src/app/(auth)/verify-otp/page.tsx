"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Logo } from "@/components/auth/logo";
import { OTPInput } from "@/components/auth/otp-input";
import { PrimaryButton } from "@/components/auth/primary-button";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { phoneNumber, setIsNewUser, login } = useAuth();
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // If there is no phone number in context, redirect back to login
  useEffect(() => {
    if (!phoneNumber) {
      router.replace("/login");
    }
  }, [phoneNumber, router]);

  // Resend Timer Countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(phoneNumber, otp);
      if (res.success) {
        setIsNewUser(res.isNewUser);
        
        if (res.isNewUser) {
          // New User: Proceed to Personal Details
          router.push("/signup/personal-details");
        } else {
          // Existing User: Mark authenticated and go to Dashboard
          login();
          router.push("/dashboard");
        }
      } else {
        setError(res.message || "Invalid OTP code. Please check and try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setError("");
    setIsLoading(true);
    try {
      const res = await authService.sendOtp(phoneNumber);
      if (res.success) {
        setResendTimer(30);
        setOtp("");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err: any) {
      setError("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 min-h-screen bg-[--color-flatmate-bg]">
      {/* Top right close button */}
      <Link
        href="/"
        className="absolute top-6 right-6 h-10 w-10 border border-[--color-flatmate-border] hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-700 transition-colors"
      >
        <X className="h-5 w-5" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] bg-white rounded-3xl border border-[--color-flatmate-border] p-8 sm:p-10 shadow-xl shadow-slate-100/50"
      >
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6 font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit number
        </Link>

        {/* Logo */}
        <div className="mb-6">
          <Logo size="md" />
        </div>

        {/* Text Headers */}
        <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
          Verify OTP
        </h1>
        <p className="text-sm text-slate-500 mb-2 leading-relaxed">
          Sent to <span className="font-bold text-slate-800">{formatPhoneNumber(phoneNumber)}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <OTPInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              setError("");
            }}
            error={error}
          />

          {/* Resend Timer Text */}
          <div className="text-center text-sm font-medium">
            {resendTimer > 0 ? (
              <span className="text-slate-400">
                Resend OTP in <span className="text-slate-600 font-bold">{`00:${resendTimer < 10 ? `0${resendTimer}` : resendTimer}`}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[--color-flatmate-green] font-bold hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>

          <PrimaryButton
            type="submit"
            variant="navy"
            isLoading={isLoading}
            disabled={otp.length !== 6}
          >
            Verify OTP
          </PrimaryButton>
        </form>
      </motion.div>
    </div>
  );
}
