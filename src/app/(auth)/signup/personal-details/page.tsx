"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { X, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/auth/logo";
import { Dropdown } from "@/components/auth/dropdown";
import { GenderToggle } from "@/components/auth/gender-toggle";
import { AvatarSelector } from "@/components/auth/avatar-selector";
import { ImageUploader } from "@/components/auth/image-uploader";
import { PrimaryButton } from "@/components/auth/primary-button";

interface PersonalDetailsFormInputs {
  name: string;
  whoYouAre: string;
  gender: string;
  city: string;
  avatarUrl: string;
}

export default function PersonalDetailsPage() {
  const router = useRouter();
  const { phoneNumber, setPersonalDetails } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsFormInputs>({
    defaultValues: {
      name: "",
      whoYouAre: "",
      gender: "",
      city: "",
      avatarUrl: "",
    },
  });

  // Watch avatarUrl to keep uploader and avatar selector in sync
  const avatarUrlValue = watch("avatarUrl");

  // Redirect to login if user bypasses entry pages
  useEffect(() => {
    if (!phoneNumber) {
      router.replace("/login");
    }
  }, [phoneNumber, router]);

  const onSubmit = async (data: PersonalDetailsFormInputs) => {
    // Save to global context state
    setPersonalDetails({
      name: data.name,
      whoYouAre: data.whoYouAre,
      gender: data.gender,
      city: data.city,
      avatarUrl: data.avatarUrl,
    });

    // Proceed to preference selection step
    router.push("/signup/preference");
  };

  const whoYouAreOptions = [
    { value: "Looking for Flat", label: "Looking for Flat" },
    { value: "Looking for Flatmate", label: "Looking for Flatmate" },
    { value: "Property Owner", label: "Property Owner" },
    { value: "Broker", label: "Broker" },
  ];

  const cityOptions = [
    { value: "Bengaluru", label: "Bengaluru" },
    { value: "Pune", label: "Pune" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Delhi NCR", label: "Delhi NCR" },
    { value: "Chennai", label: "Chennai" },
  ];

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
        className="w-full max-w-[500px] bg-white rounded-3xl border border-[--color-flatmate-border] p-8 sm:p-10 shadow-xl shadow-slate-100/50 mt-6"
      >
        {/* Progress Bar Indicator */}
        <div className="flex items-center justify-between mb-6">
          <Logo size="sm" />
          <span className="text-xs font-bold text-[--color-flatmate-green] bg-emerald-50 px-3 py-1 rounded-full">
            Step 1 of 2
          </span>
        </div>

        <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
          Personal Details
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Create your profile to start finding compatible rooms and flatmates.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Name Field */}
          <div className="w-full">
            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full h-[56px] pl-14 pr-5 rounded-2xl border bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-[--color-flatmate-border] focus:ring-1 focus:ring-[--color-flatmate-green] focus:border-[--color-flatmate-green]"
                }`}
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
            </div>
            {errors.name && (
              <span className="text-xs text-red-500 mt-1 block font-medium">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Who You Are Dropdown */}
          <Controller
            name="whoYouAre"
            control={control}
            rules={{ required: "Please select who you are" }}
            render={({ field }) => (
              <Dropdown
                label="Who You Are"
                options={whoYouAreOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.whoYouAre?.message}
              />
            )}
          />

          {/* Gender Selector */}
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Please select your gender" }}
            render={({ field }) => (
              <GenderToggle
                value={field.value}
                onChange={field.onChange}
                error={errors.gender?.message}
              />
            )}
          />

          {/* City Dropdown */}
          <Controller
            name="city"
            control={control}
            rules={{ required: "Please select your city" }}
            render={({ field }) => (
              <Dropdown
                label="City"
                options={cityOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.city?.message}
              />
            )}
          />

          {/* Avatar Selector and Custom Drag/Drop Uploader Section */}
          <div className="border-t border-[--color-flatmate-border] pt-6 flex flex-col gap-5">
            <Controller
              name="avatarUrl"
              control={control}
              rules={{ required: "Please upload a photo or choose an avatar" }}
              render={({ field }) => (
                <>
                  <ImageUploader
                    value={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  />
                  
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <AvatarSelector
                    value={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  />
                </>
              )}
            />
            {errors.avatarUrl && (
              <span className="text-xs text-red-500 mt-1 block font-medium text-center">
                {errors.avatarUrl.message}
              </span>
            )}
          </div>

          {/* Register Submit Button */}
          <PrimaryButton
            type="submit"
            variant="green"
            className="mt-4"
            isLoading={isSubmitting}
          >
            Continue
          </PrimaryButton>
        </form>
      </motion.div>
    </div>
  );
}
