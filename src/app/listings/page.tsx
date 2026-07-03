"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Grid,
  Home,
  Users,
  Building,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  fetchListings,
  fetchSeekers,
  ApiListing,
  SeekerProfile,
  formatRent,
  formatBudget,
} from "@/lib/api";

type TabId = "all" | "rooms" | "roommates" | "pg";

const TABS = [
  { id: "all" as TabId, label: "All Listing", icon: Grid },
  { id: "rooms" as TabId, label: "Rooms", icon: Home },
  { id: "roommates" as TabId, label: "Roommates", icon: Users },
  { id: "pg" as TabId, label: "PG", icon: Building },
];

const CITIES = [
  "Delhi",
  "Kanpur",
  "Noida",
  "Gurgaon",
  "Lucknow",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Bangalore",
  "Prayagraj",
  "Varanasi",
  "Jaipur",
  "Indore",
  "Bhopal",
  "Ghaziabad",
];

// Unified Card Data Type for rendering
interface UnifiedCardData {
  id: string;
  nameOrTitle: string;
  image: string;
  city: string;
  locality: string;
  address?: string;
  rentOrBudget: number;
  lookingForGender: string;
  typeLabel: string;
  distanceText: string;
  phone?: string;
  cardType: "roommate" | "room" | "pg" | "listing";
  rawObject: ApiListing | SeekerProfile;
}

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [genderPref, setGenderPref] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [cards, setCards] = useState<UnifiedCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active call modal state
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; phone: string } | null>(null);

  // Local saved bookmarks state
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string) => {
    setSavedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    // Reset page on tab or filter change
    setPage(1);
  }, [activeTab, city, locality, genderPref, maxBudget]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let mergedData: UnifiedCardData[] = [];
        let total = 0;
        let pagesCount = 1;

        const limit = 12;

        if (activeTab === "all") {
          // Fetch both listings and seekers
          const [listingsRes, seekersRes] = await Promise.all([
            fetchListings({
              city: city || undefined,
              locality: locality || undefined,
              maxRent: maxBudget ? Number(maxBudget) : undefined,
              genderPreference: genderPref || undefined,
              page,
              limit: 6,
            }).catch(() => null),
            fetchSeekers({
              city: city || undefined,
              locality: locality || undefined,
              maxBudget: maxBudget ? Number(maxBudget) : undefined,
              lookingForGender: genderPref || undefined,
              page,
              limit: 6,
            }).catch(() => null),
          ]);

          const apiListings: ApiListing[] = listingsRes?.data ?? [];
          const seekers: SeekerProfile[] = seekersRes?.data ?? [];

          // Map to unified format
          const mappedListings: UnifiedCardData[] = apiListings.map((l: ApiListing, index: number) => ({
            id: l._id,
            nameOrTitle: l.title,
            image: l.images?.[0] ?? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
            city: l.city,
            locality: l.locality,
            address: l.address,
            rentOrBudget: l.rent,
            lookingForGender: l.genderPreference,
            typeLabel: l.listingType === "pg" ? "PG" : l.listingType === "shared-flat" ? "Shared Flat" : "Room",
            distanceText: `${((index * 0.3) + 0.8).toFixed(1)} km from search area`,
            phone: l.ownerId?.email ? "+91 98765 43210" : undefined, // fallback phone
            cardType: l.listingType === "pg" ? "pg" : "listing",
            rawObject: l,
          }));

          const mappedSeekers: UnifiedCardData[] = seekers.map((s: SeekerProfile, index: number) => ({
            id: s._id,
            nameOrTitle: `${s.name}, ${s.age}`,
            image: s.profilePic ?? (s.gender === "female" 
              ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
              : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"),
            city: s.city,
            locality: s.locality,
            rentOrBudget: s.budget,
            lookingForGender: s.lookingForGender,
            typeLabel: s.searchingFor === "room" ? "Searching Room" : "Looking for Roommate",
            distanceText: `${((index * 0.4) + 1.2).toFixed(1)} km from preferred areas`,
            phone: "+91 99887 76655", // fallback seeker phone
            cardType: s.searchingFor === "room" ? "room" : "roommate",
            rawObject: s,
          }));

          // Alternate them or merge them
          mergedData = [];
          const maxLen = Math.max(mappedListings.length, mappedSeekers.length);
          for (let i = 0; i < maxLen; i++) {
            if (i < mappedListings.length) mergedData.push(mappedListings[i]);
            if (i < mappedSeekers.length) mergedData.push(mappedSeekers[i]);
          }

          total = (listingsRes?.total ?? 0) + (seekersRes?.total ?? 0);
          pagesCount = Math.max(listingsRes?.pages ?? 1, seekersRes?.pages ?? 1);

        } else if (activeTab === "rooms") {
          // Fetch room listings (not PG) and room-seekers
          const [listingsRes, seekersRes] = await Promise.all([
            fetchListings({
              city: city || undefined,
              locality: locality || undefined,
              maxRent: maxBudget ? Number(maxBudget) : undefined,
              genderPreference: genderPref || undefined,
              page,
              limit: 6,
            }).catch(() => null),
            fetchSeekers({
              searchingFor: "room",
              city: city || undefined,
              locality: locality || undefined,
              maxBudget: maxBudget ? Number(maxBudget) : undefined,
              lookingForGender: genderPref || undefined,
              page,
              limit: 6,
            }).catch(() => null),
          ]);

          const apiListings: ApiListing[] = (listingsRes?.data ?? []).filter((l: ApiListing) => l.listingType !== "pg");
          const seekers: SeekerProfile[] = seekersRes?.data ?? [];

          const mappedListings: UnifiedCardData[] = apiListings.map((l: ApiListing, index: number) => ({
            id: l._id,
            nameOrTitle: l.title,
            image: l.images?.[0] ?? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
            city: l.city,
            locality: l.locality,
            address: l.address,
            rentOrBudget: l.rent,
            lookingForGender: l.genderPreference,
            typeLabel: l.listingType === "shared-flat" ? "Shared Flat" : "Room",
            distanceText: `${((index * 0.3) + 0.9).toFixed(1)} km from search area`,
            phone: "+91 98765 43210",
            cardType: "listing",
            rawObject: l,
          }));

          const mappedSeekers: UnifiedCardData[] = seekers.map((s: SeekerProfile, index: number) => ({
            id: s._id,
            nameOrTitle: `${s.name}, ${s.age}`,
            image: s.profilePic ?? (s.gender === "female" 
              ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
              : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"),
            city: s.city,
            locality: s.locality,
            rentOrBudget: s.budget,
            lookingForGender: s.lookingForGender,
            typeLabel: "Searching Room",
            distanceText: `${((index * 0.4) + 1.1).toFixed(1)} km from preferred areas`,
            phone: "+91 99887 76655",
            cardType: "room",
            rawObject: s,
          }));

          mergedData = [];
          const maxLen = Math.max(mappedListings.length, mappedSeekers.length);
          for (let i = 0; i < maxLen; i++) {
            if (i < mappedListings.length) mergedData.push(mappedListings[i]);
            if (i < mappedSeekers.length) mergedData.push(mappedSeekers[i]);
          }

          total = mappedListings.length + (seekersRes?.total ?? 0);
          pagesCount = Math.max(listingsRes?.pages ?? 1, seekersRes?.pages ?? 1);

        } else if (activeTab === "roommates") {
          // Seeker profiles looking for roommate
          const res = await fetchSeekers({
            searchingFor: "roommate",
            city: city || undefined,
            locality: locality || undefined,
            maxBudget: maxBudget ? Number(maxBudget) : undefined,
            lookingForGender: genderPref || undefined,
            page,
            limit,
          });

          mergedData = (res.data ?? []).map((s: SeekerProfile, index: number) => ({
            id: s._id,
            nameOrTitle: `${s.name}, ${s.age}`,
            image: s.profilePic ?? (s.gender === "female" 
              ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
              : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"),
            city: s.city,
            locality: s.locality,
            rentOrBudget: s.budget,
            lookingForGender: s.lookingForGender,
            typeLabel: "Looking for Roommate",
            distanceText: `${((index * 0.4) + 1.0).toFixed(1)} km from preferred areas`,
            phone: "+91 99887 76655",
            cardType: "roommate",
            rawObject: s,
          }));

          total = res.total ?? 0;
          pagesCount = res.pages ?? 1;

        } else if (activeTab === "pg") {
          // Listing of type PG
          const res = await fetchListings({
            listingType: "pg",
            city: city || undefined,
            locality: locality || undefined,
            maxRent: maxBudget ? Number(maxBudget) : undefined,
            genderPreference: genderPref || undefined,
            page,
            limit,
          });

          mergedData = (res.data ?? []).map((l: ApiListing, index: number) => ({
            id: l._id,
            nameOrTitle: l.title,
            image: l.images?.[0] ?? "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
            city: l.city,
            locality: l.locality,
            address: l.address,
            rentOrBudget: l.rent,
            lookingForGender: l.genderPreference,
            typeLabel: "PG / Co-Living",
            distanceText: `${((index * 0.25) + 0.7).toFixed(1)} km from search area`,
            phone: "+91 98765 43210",
            cardType: "pg",
            rawObject: l,
          }));

          total = res.total ?? 0;
          pagesCount = res.pages ?? 1;
        }

        setCards(mergedData);
        setTotalCount(total);
        setTotalPages(pagesCount);
      } catch (err: any) {
        console.error("Failed to load discovery listings:", err);
        setError(err.message ?? "Failed to query the database server.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, city, locality, genderPref, maxBudget, page]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-base text-slate-800 dark:text-ink pb-24 animate-in fade-in duration-300">
      {/* Search Header Banner */}
      <section className="relative bg-white dark:bg-base-elevated border-b border-slate-150 dark:border-glass-border py-10 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Sparkles className="h-5.5 w-5.5 text-violet animate-pulse" />
                RentFlatemate Discovery
              </h1>
              <p className="text-sm text-slate-500 dark:text-ink-muted mt-1">
                Find compatible roommates, rooms, and shared apartments across top cities.
              </p>
            </div>
            {totalCount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet/10 text-violet dark:text-violet-soft font-semibold text-xs rounded-full border border-violet/20 self-start md:self-center">
                {totalCount.toLocaleString()} Matches Found
              </div>
            )}
          </div>

          {/* Top Filter Bar */}
          <div className="bg-slate-50 dark:bg-base p-4 rounded-2xl border border-slate-200 dark:border-glass-border grid grid-cols-1 md:grid-cols-4 gap-3 shadow-xs">
            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-ink-faint" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 h-11 rounded-xl border border-slate-200 dark:border-glass-border bg-white dark:bg-white/[0.03] text-sm text-slate-700 dark:text-ink outline-none transition-colors focus:border-violet"
              >
                <option value="" className="text-slate-500 bg-white dark:bg-base-elevated">Select City (All)</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-base-elevated">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Locality Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-ink-faint" />
              <input
                placeholder="Preferred locality (e.g. Kakadeo)"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full pl-9 pr-3 h-11 rounded-xl border border-slate-200 dark:border-glass-border bg-white dark:bg-white/[0.03] text-sm text-slate-700 dark:text-ink placeholder:text-slate-400 dark:placeholder:text-ink-faint outline-none transition-colors focus:border-violet"
              />
            </div>

            {/* Gender Preference */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-ink-faint" />
              <select
                value={genderPref}
                onChange={(e) => setGenderPref(e.target.value)}
                className="w-full pl-9 pr-3 h-11 rounded-xl border border-slate-200 dark:border-glass-border bg-white dark:bg-white/[0.03] text-sm text-slate-700 dark:text-ink outline-none transition-colors focus:border-violet"
              >
                <option value="" className="bg-white dark:bg-base-elevated">Gender Preference (All)</option>
                <option value="any" className="bg-white dark:bg-base-elevated">Any</option>
                <option value="male" className="bg-white dark:bg-base-elevated">Male</option>
                <option value="female" className="bg-white dark:bg-base-elevated">Female</option>
              </select>
            </div>

            {/* Max Budget */}
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-xs font-semibold text-slate-400 dark:text-ink-faint">₹</span>
              <input
                type="number"
                placeholder="Max Budget"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full pl-7 pr-3 h-11 rounded-xl border border-slate-200 dark:border-glass-border bg-white dark:bg-white/[0.03] text-sm text-slate-700 dark:text-ink placeholder:text-slate-400 dark:placeholder:text-ink-faint outline-none transition-colors focus:border-violet"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="mx-auto max-w-6xl px-6 mt-8">
        {/* Category Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-glass-border mb-8 overflow-x-auto scrollbar-none gap-8">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "border-violet text-violet dark:text-violet-soft font-bold"
                    : "border-transparent text-slate-500 dark:text-ink-muted hover:text-slate-800 dark:hover:text-ink"
                )}
              >
                <TabIcon className={cn("h-4 w-4", isActive ? "text-violet dark:text-violet-soft" : "text-slate-400")} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-base-elevated h-52 rounded-2xl border border-slate-100 dark:border-glass-border animate-pulse flex"
              >
                <div className="w-44 bg-slate-200 dark:bg-white/5 h-full rounded-l-2xl shrink-0" />
                <div className="p-5 flex-1 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="h-8 bg-slate-200 dark:bg-white/5 rounded" />
                    <div className="h-8 bg-slate-200 dark:bg-white/5 rounded" />
                    <div className="h-8 bg-slate-200 dark:bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center">
            <h3 className="font-semibold text-lg">Server Connection Required</h3>
            <p className="text-sm mt-1 text-slate-500 dark:text-ink-muted">
              Make sure your backend server is running on port 5000 (`npm run dev` inside server/).
            </p>
            <p className="text-xs mt-3 bg-white/5 p-2 rounded text-slate-400">Error info: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cards.length === 0 && (
          <div className="bg-white dark:bg-base-elevated border border-slate-100 dark:border-glass-border rounded-card p-16 text-center">
            <p className="font-display text-lg font-semibold mb-2">No matching listings found</p>
            <p className="text-sm text-slate-500 dark:text-ink-muted">
              Try adjusting your city filter, raising your budget, or choosing a different tab.
            </p>
          </div>
        )}

        {/* Main Grid: 2 columns on desktop */}
        {!loading && !error && cards.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card) => {
                const isSaved = !!savedIds[card.id];
                return (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-base-elevated rounded-2xl border border-slate-150 dark:border-glass-border shadow-xs flex flex-col sm:flex-row overflow-hidden hover:border-slate-300 dark:hover:border-white/20 hover:shadow-sm transition-all"
                  >
                    {/* Left Section: Image Block */}
                    <div className="relative w-full sm:w-44 h-48 sm:h-auto overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-white/5">
                      <Image
                        src={card.image}
                        alt={card.nameOrTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        className="object-cover"
                        priority={false}
                      />
                    </div>

                    {/* Right Section: Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Title / Name */}
                        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                          {card.nameOrTitle}
                        </h3>

                        {/* Locality */}
                        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-ink-faint mt-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-ink-faint" />
                          <span className="truncate">
                            {card.locality}, {card.city}
                          </span>
                        </div>

                        {/* Details grid: Rent, Looking For, Category Type */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                          {/* Column 1: Rent */}
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-ink-faint font-bold">
                              Rent
                            </div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                              {formatBudget(card.rentOrBudget)}
                            </div>
                          </div>

                          {/* Column 2: Looking For */}
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-ink-faint font-bold">
                              Looking For
                            </div>
                            <div className="text-sm font-semibold text-slate-600 dark:text-ink-muted mt-0.5 capitalize">
                              {card.lookingForGender === "any" ? "Any" : card.lookingForGender}
                            </div>
                          </div>

                          {/* Column 3: Type */}
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-ink-faint font-bold">
                              Looking For
                            </div>
                            <div className="text-sm font-semibold text-slate-600 dark:text-ink-muted mt-0.5 truncate capitalize">
                              {card.typeLabel}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: divider, distance and actions */}
                      <div className="mt-5 pt-3 border-t border-dashed border-slate-150 dark:border-white/10 flex items-center justify-between">
                        <div className="text-xs text-slate-400 dark:text-ink-faint font-medium">
                          {card.distanceText}
                        </div>

                        {/* Circular Action Icons */}
                        <div className="flex items-center gap-1.5">
                          {/* Heart Icon */}
                          <button
                            onClick={() => toggleSave(card.id)}
                            className={cn(
                              "h-8 w-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer",
                              isSaved
                                ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-500/10 dark:border-red-500/20"
                                : "border-slate-200 dark:border-glass-border text-slate-500 dark:text-ink-muted hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                            title={isSaved ? "Saved" : "Save"}
                          >
                            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                          </button>

                          {/* Chat Icon */}
                          <Link
                            href="/chat"
                            className="h-8 w-8 rounded-full border border-slate-200 dark:border-glass-border flex items-center justify-center text-slate-500 dark:text-ink-muted hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            title="Chat"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Link>

                          {/* Call Icon */}
                          {card.phone && (
                            <button
                              onClick={() => setActiveCallContact({ name: card.nameOrTitle, phone: card.phone! })}
                              className="h-8 w-8 rounded-full border border-slate-200 dark:border-glass-border flex items-center justify-center text-slate-500 dark:text-ink-muted hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                              title="Call"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-glass-border rounded-xl text-sm font-semibold text-slate-600 dark:text-ink hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="text-sm font-medium text-slate-500 dark:text-ink-muted">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-glass-border rounded-xl text-sm font-semibold text-slate-600 dark:text-ink hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

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
    </main>
  );
}
