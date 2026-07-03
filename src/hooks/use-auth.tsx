"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface PersonalDetails {
  name: string;
  whoYouAre: string;
  gender: string;
  city: string;
  avatarUrl: string;
}

interface AuthContextType {
  phoneNumber: string;
  isNewUser: boolean;
  personalDetails: PersonalDetails | null;
  preferences: string[];
  isAuthenticated: boolean;
  setPhoneNumber: (phone: string) => void;
  setIsNewUser: (isNew: boolean) => void;
  setPersonalDetails: (details: PersonalDetails) => void;
  setPreferences: (prefs: string[]) => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [phoneNumber, setPhoneNumberState] = useState("");
  const [isNewUser, setIsNewUserState] = useState(false);
  const [personalDetails, setPersonalDetailsState] = useState<PersonalDetails | null>(null);
  const [preferences, setPreferencesState] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load any existing session from localStorage (for persistence)
  useEffect(() => {
    const storedPhone = localStorage.getItem("rm_auth_phone");
    const storedDetails = localStorage.getItem("rm_auth_details");
    const storedPrefs = localStorage.getItem("rm_auth_prefs");
    const storedAuth = localStorage.getItem("rm_auth_authenticated");

    if (storedPhone) setPhoneNumberState(storedPhone);
    if (storedDetails) setPersonalDetailsState(JSON.parse(storedDetails));
    if (storedPrefs) setPreferencesState(JSON.parse(storedPrefs));
    if (storedAuth === "true") setIsAuthenticated(true);
  }, []);

  const setPhoneNumber = (phone: string) => {
    setPhoneNumberState(phone);
    localStorage.setItem("rm_auth_phone", phone);
  };

  const setIsNewUser = (isNew: boolean) => {
    setIsNewUserState(isNew);
  };

  const setPersonalDetails = (details: PersonalDetails) => {
    setPersonalDetailsState(details);
    localStorage.setItem("rm_auth_details", JSON.stringify(details));
  };

  const setPreferences = (prefs: string[]) => {
    setPreferencesState(prefs);
    localStorage.setItem("rm_auth_prefs", JSON.stringify(prefs));
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("rm_auth_authenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumberState("");
    setIsNewUserState(false);
    setPersonalDetailsState(null);
    setPreferencesState([]);
    localStorage.removeItem("rm_auth_phone");
    localStorage.removeItem("rm_auth_details");
    localStorage.removeItem("rm_auth_prefs");
    localStorage.removeItem("rm_auth_authenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        isNewUser,
        personalDetails,
        preferences,
        isAuthenticated,
        setPhoneNumber,
        setIsNewUser,
        setPersonalDetails,
        setPreferences,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
