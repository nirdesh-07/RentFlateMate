"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, User, LogOut, ArrowRight, Home, Settings, MessageSquare, Heart, Sparkles, Check, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { avatars } from "@/components/auth/avatar-selector";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";
import { listings, Listing } from "@/lib/mock-data";
import { fetchSeekers, SeekerProfile } from "@/lib/api";

interface RoommateMatch {
  seeker: SeekerProfile;
  score: number;
  explanation: string;
}

function getRoommateMatches(
  currentUser: { gender: string; city: string; preferences: string[] },
  seekersList: SeekerProfile[]
): RoommateMatch[] {
  const userGender = (currentUser.gender || 'male').toLowerCase();
  const userPrefs = currentUser.preferences || [];

  return seekersList
    .map((seeker) => {
      // 1. Gender criteria check
      const seekerGender = (seeker.gender || 'male').toLowerCase();
      const seekerPref = (seeker.lookingForGender || 'any').toLowerCase();
      
      // If seeker limits their matching to a specific gender, and user does not match it:
      if (seekerPref !== 'any' && seekerPref !== userGender) {
        return null;
      }
      
      let baseScore = 45; // Base score for compatible gender
      const factors: string[] = [];

      // Budget match
      baseScore += 20;
      factors.push("Budgets align within reasonable parameters.");

      // Lifestyle traits overlap
      let traitScore = 0;

      if (userPrefs.includes("Non Smoker")) {
        if (!seeker.smoking) {
          traitScore += 12;
          factors.push("Both prefer a smoke-free environment.");
        } else {
          traitScore -= 8;
          factors.push("Note: Seeker listed smoking as acceptable.");
        }
      }

      if (userPrefs.includes("Vegan") || userPrefs.includes("Vegetarian")) {
        if (seeker.foodPreference === 'veg') {
          traitScore += 10;
          factors.push("Mutual vegetarian preferences.");
        }
      }

      if (userPrefs.includes("Pet Lover")) {
        if (seeker.pets) {
          traitScore += 10;
          factors.push("Both are pet-friendly.");
        }
      }

      const bioText = (seeker.bio || '').toLowerCase();
      if (userPrefs.includes("Night Owl")) {
        if (bioText.includes("night") || bioText.includes("late") || bioText.includes("nocturnal")) {
          traitScore += 10;
          factors.push("Shared nocturnal schedules.");
        }
      } else if (userPrefs.includes("Early Bird")) {
        if (bioText.includes("morning") || bioText.includes("early") || bioText.includes("sunrise")) {
          traitScore += 10;
          factors.push("Shared morning schedules.");
        }
      }

      let prefMatches = 0;
      userPrefs.forEach(pref => {
        if (bioText.includes(pref.toLowerCase())) {
          prefMatches++;
        }
      });
      if (prefMatches > 0) {
        traitScore += Math.min(10, prefMatches * 5);
        factors.push(`Shared interests in ${userPrefs.filter(p => bioText.includes(p.toLowerCase())).join(", ")}.`);
      }

      const totalScore = Math.min(100, Math.max(10, baseScore + traitScore));
      const explanation = factors.length > 0 ? factors.join(" ") : "Matched location and lifestyle factors.";

      return {
        seeker,
        score: totalScore,
        explanation
      };
    })
    .filter((m): m is RoommateMatch => m !== null)
    .sort((a, b) => b.score - a.score);
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, personalDetails, preferences, logout } = useAuth();
  const [matchedListings, setMatchedListings] = useState<Listing[]>([]);
  const [roommateMatches, setRoommateMatches] = useState<RoommateMatch[]>([]);
  const [activeDashboardTab, setActiveDashboardTab] = useState<"roommates" | "rooms">("roommates");
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Active call modal state
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; phone: string } | null>(null);

  // Connection modal state
  const [connectModal, setConnectModal] = useState<{ open: boolean; seekerName: string }>({
    open: false,
    seekerName: "",
  });
  const [connectMessage, setConnectMessage] = useState("");
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Protect route: Redirect to login if not authenticated
  useEffect(() => {
    const isStoredAuth = localStorage.getItem("rm_auth_authenticated") === "true";
    if (!isAuthenticated && !isStoredAuth) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Compute matched listings & seekers based on user's city and preferences
  useEffect(() => {
    if (!personalDetails) return;

    const loadDashboardData = async () => {
      setLoadingMatches(true);
      try {
        // 1. Listings filtering
        let listingsFiltered = listings.filter(
          (item) => item.city.toLowerCase() === personalDetails.city.toLowerCase()
        );
        if (listingsFiltered.length === 0) {
          listingsFiltered = [...listings];
        }
        listingsFiltered.sort((a, b) => b.score - a.score);
        setMatchedListings(listingsFiltered);

        // 2. Fetch Roommate Seekers in the same city
        const seekersRes = await fetchSeekers({
          city: personalDetails.city || undefined,
          searchingFor: "roommate"
        }).catch(() => null);

        let rawSeekers: SeekerProfile[] = [];
        if (seekersRes && seekersRes.data && seekersRes.data.length > 0) {
          rawSeekers = seekersRes.data;
        } else {
          // Dynamic fallback seed data for realistic co-living seekers
          rawSeekers = [
            {
              _id: "s_demo_1",
              userId: { _id: "u_demo_1", name: "Aarav Sharma", email: "aarav@example.com", profilePic: null },
              name: "Aarav Sharma",
              gender: "male",
              age: 24,
              occupation: "working professional",
              searchingFor: "roommate",
              city: personalDetails.city || "Bengaluru",
              locality: "HSR Layout",
              preferredAreas: ["HSR Layout", "Koramangala"],
              budget: 15000,
              moveInDate: null,
              lookingForGender: "any",
              roomTypePreference: "any",
              foodPreference: "any",
              smoking: false,
              drinking: false,
              pets: true,
              bio: "Tech grad working at a startup in HSR. Non-smoker, early bird, love playing board games on weekends and keeping the house clean.",
              profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
              isActive: true,
              createdAt: "",
              updatedAt: ""
            },
            {
              _id: "s_demo_2",
              userId: { _id: "u_demo_2", name: "Neha Gupta", email: "neha@example.com", profilePic: null },
              name: "Neha Gupta",
              gender: "female",
              age: 22,
              occupation: "student",
              searchingFor: "roommate",
              city: personalDetails.city || "Bengaluru",
              locality: "Indiranagar",
              preferredAreas: ["Indiranagar", "Domlur"],
              budget: 12000,
              moveInDate: null,
              lookingForGender: "female",
              roomTypePreference: "any",
              foodPreference: "veg",
              smoking: false,
              drinking: false,
              pets: false,
              bio: "Studious UPSC aspirant looking for a quiet shared flat. Non-alcoholic, vegan, sleep early and stay focused.",
              profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
              isActive: true,
              createdAt: "",
              updatedAt: ""
            },
            {
              _id: "s_demo_3",
              userId: { _id: "u_demo_3", name: "Rohan Das", email: "rohan@example.com", profilePic: null },
              name: "Rohan Das",
              gender: "male",
              age: 26,
              occupation: "freelancer",
              searchingFor: "roommate",
              city: personalDetails.city || "Bengaluru",
              locality: "Koramangala",
              preferredAreas: ["Koramangala", "HSR Layout"],
              budget: 20000,
              moveInDate: null,
              lookingForGender: "any",
              roomTypePreference: "any",
              foodPreference: "any",
              smoking: true,
              drinking: true,
              pets: true,
              bio: "Freelancer designer looking for flatmate. Night owl, pet lover, music producer. Let's make a creative house vibe!",
              profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
              isActive: true,
              createdAt: "",
              updatedAt: ""
            },
            {
              _id: "s_demo_4",
              userId: { _id: "u_demo_4", name: "Pooja Iyer", email: "pooja@example.com", profilePic: null },
              name: "Pooja Iyer",
              gender: "female",
              age: 23,
              occupation: "student",
              searchingFor: "roommate",
              city: personalDetails.city || "Bengaluru",
              locality: "HSR Layout",
              preferredAreas: ["HSR Layout", "Sarjapur"],
              budget: 14000,
              moveInDate: null,
              lookingForGender: "female",
              roomTypePreference: "any",
              foodPreference: "veg",
              smoking: false,
              drinking: false,
              pets: true,
              bio: "Doing MBA. Vegan, non-smoker, early bird. Looking for a neat flatmate in Indiranagar/HSR. Love cooking!",
              profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
              isActive: true,
              createdAt: "",
              updatedAt: ""
            }
          ];
        }

        // Calculate and sort compatibility matches
        const matches = getRoommateMatches(
          {
            gender: personalDetails.gender,
            city: personalDetails.city,
            preferences: preferences || []
          },
          rawSeekers
        );
        setRoommateMatches(matches);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoadingMatches(false);
      }
    };

    loadDashboardData();
  }, [personalDetails, preferences]);

  if (!personalDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base text-ink font-body">
        <svg className="animate-spin h-8 w-8 text-violet-soft" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const selectedAvatar = avatars.find((av) => av.url === personalDetails.avatarUrl);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSendConnection = async () => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSending(false);
    setConnectSuccess(true);
    setConnectMessage("");
    setTimeout(() => {
      setConnectModal({ open: false, seekerName: "" });
      setConnectSuccess(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-base text-ink font-body pb-24">
      {/* Dashboard Inner Header */}
      <header className="border-b border-glass-border bg-base-elevated/40 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-coral flex text-white font-extrabold text-lg shadow-md shadow-violet-500/20">
              R
            </span>
            <span className="font-display font-bold text-lg hidden sm:inline">
              RentFlatemate
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-muted hover:text-ink hover:bg-white/5 px-4 py-2 rounded-full border border-glass-border transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-6xl px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Profile details */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass rounded-3xl p-6 relative overflow-hidden">
            {/* Background radial glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              {/* Profile Avatar rendering */}
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-violet/40 bg-slate-800 p-0.5 mb-4 shadow-lg shadow-violet-950/20">
                {selectedAvatar ? (
                  selectedAvatar.svg
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={personalDetails.avatarUrl}
                    alt={personalDetails.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                )}
              </div>

              <h2 className="font-display text-xl font-bold text-ink">
                {personalDetails.name}
              </h2>
              
              <span className="text-xs font-bold text-violet-soft bg-violet/10 border border-violet/20 rounded-full px-3 py-1 mt-2">
                {personalDetails.whoYouAre}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-3">
                <MapPin className="h-3.5 w-3.5" />
                <span>{personalDetails.city}</span>
              </div>
            </div>

            {/* Profile Statistics/Info Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-glass-border text-center text-xs">
              <div className="bg-white/[0.02] border border-glass-border rounded-xl p-2.5">
                <p className="text-ink-muted">Gender</p>
                <p className="font-bold text-sm text-ink mt-0.5">{personalDetails.gender}</p>
              </div>
              <div className="bg-white/[0.02] border border-glass-border rounded-xl p-2.5">
                <p className="text-ink-muted">Verification</p>
                <p className="font-bold text-sm text-emerald mt-0.5">Verified</p>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="mt-6 pt-6 border-t border-glass-border">
              <h3 className="text-sm font-semibold text-ink mb-3">My Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-ink-muted bg-white/5 border border-glass-border px-2.5 py-1 rounded-lg"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-sm font-semibold text-ink mb-4">Activity Status</h3>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-muted">
                  <Heart className="h-4 w-4 text-coral" />
                  <span>Favorited Rooms</span>
                </div>
                <span className="font-bold text-ink bg-white/5 px-2 py-0.5 rounded">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-muted">
                  <MessageSquare className="h-4 w-4 text-violet-soft" />
                  <span>Chats Initiated</span>
                </div>
                <span className="font-bold text-ink bg-white/5 px-2 py-0.5 rounded">0</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: Tab Selector and Tab Content */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          {/* Dashboard Tab navigation */}
          <div className="flex border-b border-glass-border mb-2 gap-8">
            <button
              onClick={() => setActiveDashboardTab("roommates")}
              className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeDashboardTab === "roommates"
                  ? "border-violet text-violet font-extrabold"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              <User className="h-4 w-4" />
              Roommate Matches
            </button>
            <button
              onClick={() => setActiveDashboardTab("rooms")}
              className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeDashboardTab === "rooms"
                  ? "border-violet text-violet font-extrabold"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              <Home className="h-4 w-4" />
              Compatible Rooms
            </button>
          </div>

          {loadingMatches ? (
            <div className="py-20 flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-violet" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : activeDashboardTab === "roommates" ? (
            // Tab Content: Roommates
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
                  <Sparkles className="h-5.5 w-5.5 text-violet animate-pulse" />
                  Your Best Roommate Matches
                </h1>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  Lifestyle and compatibility-scored roommates in <span className="text-violet-soft font-semibold">{personalDetails.city}</span>.
                </p>
              </div>

              {/* Best fit spotlight banner */}
              {roommateMatches.length > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-violet/10 via-coral/5 to-emerald/5 border border-violet/15 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-violet/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                    <div className="relative shrink-0">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-violet/30 bg-slate-800 p-0.5 shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={roommateMatches[0].seeker.profilePic || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"}
                          alt={roommateMatches[0].seeker.name}
                          className="h-full w-full object-cover rounded-full"
                        />
                      </div>
                      <span className="absolute -top-1 -right-1 bg-violet text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                        Best Fit
                      </span>
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="font-display font-bold text-lg text-ink">
                        {roommateMatches[0].seeker.name}, {roommateMatches[0].seeker.age}
                      </h3>
                      <p className="text-xs text-violet-soft font-bold capitalize mt-0.5">
                        {roommateMatches[0].seeker.occupation} • Prefers {roommateMatches[0].seeker.locality || "HSR Layout"}
                      </p>
                      <p className="text-xs text-ink-muted mt-2 max-w-md italic leading-relaxed">
                        "{roommateMatches[0].seeker.bio}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 shrink-0 relative z-10">
                    <CompatibilityRing score={roommateMatches[0].score} size={64} strokeWidth={6} />
                    <button
                      onClick={() => setConnectModal({ open: true, seekerName: roommateMatches[0].seeker.name })}
                      className="px-5 py-2 bg-violet hover:bg-violet-soft text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-md shadow-violet-500/10"
                    >
                      Connect Now
                    </button>
                  </div>
                </div>
              )}

              {/* Grid list of other roommates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roommateMatches.slice(1).map((match, idx) => (
                  <motion.div
                    key={match.seeker._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="glass rounded-3xl p-5 flex flex-col justify-between border border-glass-border hover:border-violet/20 hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden border border-glass-border bg-slate-800 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={match.seeker.profilePic || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"}
                              alt={match.seeker.name}
                              className="h-full w-full object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-base text-ink line-clamp-1">
                              {match.seeker.name}, {match.seeker.age}
                            </h4>
                            <p className="text-xs text-ink-muted capitalize">
                              {match.seeker.occupation}
                            </p>
                          </div>
                        </div>
                        <CompatibilityRing score={match.score} size={48} strokeWidth={5} />
                      </div>

                      <p className="text-xs text-ink-muted mt-3 line-clamp-2 italic">
                        "{match.seeker.bio}"
                      </p>

                      <div className="mt-4 p-3 bg-violet/[0.03] dark:bg-white/[0.01] rounded-xl border border-violet/10 text-[11px] text-ink-muted leading-relaxed">
                        <span className="font-bold text-violet-soft block mb-0.5">Compatibility insight:</span>
                        {match.explanation}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-glass-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-ink-muted block uppercase tracking-wider font-semibold">Budget Limit</span>
                        <span className="font-data font-bold text-emerald text-sm">
                          ₹{match.seeker.budget.toLocaleString("en-IN")}/mo
                        </span>
                      </div>
                      <button
                        onClick={() => setConnectModal({ open: true, seekerName: match.seeker.name })}
                        className="px-4 py-1.5 bg-white/5 hover:bg-violet hover:text-white border border-glass-border hover:border-violet text-ink text-xs font-semibold rounded-full transition-colors cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {roommateMatches.length === 0 && (
                <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                  <User className="h-10 w-10 text-ink-faint mb-3" />
                  <p className="font-bold text-ink">No roommates found in your city</p>
                  <p className="text-sm text-ink-muted mt-1">
                    Try updating your preferences to expand matching possibilities!
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Tab Content: Rooms (Matched Listings)
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  Compatible Rooms
                </h1>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  AI compatibility matches in <span className="text-violet-soft font-semibold">{personalDetails.city}</span> based on your budget & locality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedListings.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="glass rounded-3xl overflow-hidden flex flex-col justify-between group border border-glass-border hover:border-white/10 hover:shadow-lg transition-all"
                  >
                    {/* Image & compatibility score ring overlay */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Compatibility ring overlay */}
                      <div className="absolute top-4 right-4 bg-slate-950/70 p-1.5 rounded-full backdrop-blur-md">
                        <CompatibilityRing score={item.score} size={64} strokeWidth={6} />
                      </div>

                      <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-md">
                        {item.roomType}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-bold text-base leading-snug text-ink line-clamp-1 group-hover:text-violet-soft transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span>{item.locality}, {item.city}</span>
                        </p>
                        <p className="text-xs text-ink-faint mt-3 line-clamp-2 italic">
                          "{item.scoreExplanation}"
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-glass-border flex items-center justify-between">
                        <div>
                          <span className="text-xs text-ink-muted block">Monthly Rent</span>
                          <span className="font-data font-bold text-lg text-emerald">
                            ₹{item.rent.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <button className="h-9 w-9 rounded-full bg-white/5 border border-glass-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-violet hover:border-violet transition-colors group-hover:translate-x-0.5 duration-200">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {matchedListings.length === 0 && (
                <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                  <Home className="h-10 w-10 text-ink-faint mb-3" />
                  <p className="font-bold text-ink">No properties found in your city</p>
                  <p className="text-sm text-ink-muted mt-1">
                    We'll expand support to {personalDetails.city} soon! Check other locations in the mean time.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

      </main>

      {/* Call Modal */}
      {activeCallContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-base-elevated border border-slate-100 dark:border-glass-border rounded-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="h-12 w-12 rounded-full bg-violet/10 flex items-center justify-center mx-auto text-violet text-xl mb-4">
              📞
            </div>
            <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">Contact Info</h3>
            <p className="text-xs text-slate-500 dark:text-ink-muted mt-1">Get in touch with {activeCallContact.name}</p>
            <div className="bg-slate-50 dark:bg-base border border-slate-100 dark:border-glass-border py-3 px-4 rounded-xl font-bold font-data text-base text-slate-700 dark:text-white mt-4 tracking-wider select-all">
              {activeCallContact.phone}
            </div>
            <button
              onClick={() => setActiveCallContact(null)}
              className="w-full mt-6 h-11 bg-slate-900 hover:bg-slate-800 dark:bg-violet dark:hover:bg-violet/90 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Connection Modal */}
      {connectModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-base-elevated border border-slate-100 dark:border-glass-border rounded-3xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            {connectSuccess ? (
              <div className="py-6">
                <div className="h-16 w-16 bg-emerald/10 text-emerald text-3xl rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  ✨
                </div>
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-xl">Request Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-ink-muted mt-2">
                  We've sent your request to <span className="font-bold text-violet">{connectModal.seekerName}</span>. Chat will open once they accept.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">Connect with {connectModal.seekerName}</h3>
                <p className="text-xs text-slate-500 dark:text-ink-muted mt-1">
                  Start a match request to introduce yourself and verify schedule compatibility!
                </p>

                <textarea
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  placeholder={`Hi ${connectModal.seekerName}! I saw we have compatible lifestyle preferences in HSR Layout...`}
                  className="w-full mt-4 h-24 p-3 border border-slate-200 dark:border-glass-border rounded-2xl text-sm bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet"
                />

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setConnectModal({ open: false, seekerName: "" })}
                    className="flex-1 h-11 border border-slate-200 dark:border-glass-border hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-ink-muted rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendConnection}
                    disabled={isSending}
                    className="flex-1 h-11 bg-violet hover:bg-violet-soft text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSending ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
