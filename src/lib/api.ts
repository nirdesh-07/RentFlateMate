/**
 * api.ts
 * ─────────────────────────────────────────────────────────────────
 * Typed API helpers that talk to the Express backend.
 * All functions return the parsed JSON directly — errors throw so
 * React Query / try-catch can handle them.
 * ─────────────────────────────────────────────────────────────────
 */

import type { ApiListing, SeekerProfile, PaginatedResponse, CityStats } from './mock-data';
export type { ApiListing, SeekerProfile, PaginatedResponse, CityStats };

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? `API error ${res.status}`);
  }
  return json as T;
}

// ── Listings ─────────────────────────────────────────────────────

export interface ListingFilters {
  city?: string;
  locality?: string;
  minRent?: number;
  maxRent?: number;
  roomType?: string;
  genderPreference?: string;
  furnished?: string;
  listingType?: string;
  page?: number;
  limit?: number;
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function fetchListings(
  filters: ListingFilters = {}
): Promise<PaginatedResponse<ApiListing>> {
  const query = buildQuery(filters as Record<string, string | number | boolean | undefined>);
  return apiFetch<PaginatedResponse<ApiListing>>(`/listings${query}`);
}

export async function fetchListingById(id: string): Promise<{ success: boolean; data: ApiListing }> {
  return apiFetch(`/listings/${id}`);
}

// ── Seeker Profiles ───────────────────────────────────────────────

export interface SeekerFilters {
  searchingFor?: 'room' | 'roommate';
  city?: string;
  locality?: string;
  gender?: string;
  lookingForGender?: string;
  minBudget?: number;
  maxBudget?: number;
  occupation?: string;
  page?: number;
  limit?: number;
}

export async function fetchSeekers(
  filters: SeekerFilters = {}
): Promise<PaginatedResponse<SeekerProfile>> {
  const query = buildQuery(filters as Record<string, string | number | boolean | undefined>);
  return apiFetch<PaginatedResponse<SeekerProfile>>(`/seekers${query}`);
}

export async function fetchSeekerById(
  id: string
): Promise<{ success: boolean; data: SeekerProfile }> {
  return apiFetch(`/seekers/${id}`);
}

export async function fetchSeekerCityStats(): Promise<{ success: boolean; data: CityStats[] }> {
  return apiFetch('/seekers/stats/cities');
}

// ── Helpers for UI labels ─────────────────────────────────────────

export const GENDER_LABEL: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  any: 'Any',
  other: 'Other',
};

export const SEARCHING_FOR_LABEL: Record<string, string> = {
  room: 'Searching For Place',
  roommate: 'Looking for Roommate',
};

export const FURNISHED_LABEL: Record<string, string> = {
  unfurnished: 'Unfurnished',
  'semi-furnished': 'Semi-Furnished',
  'fully-furnished': 'Fully Furnished',
};

export const LISTING_TYPE_LABEL: Record<string, string> = {
  room: 'Room',
  pg: 'PG',
  'shared-flat': 'Shared Flat',
  studio: 'Studio',
  '1BHK': '1 BHK',
  '2BHK': '2 BHK',
  '3BHK': '3 BHK',
};

/** Format rent as ₹12,000/mo */
export const formatRent = (rent: number) =>
  `₹${rent.toLocaleString('en-IN')}/mo`;

/** Format budget as ₹12,000 */
export const formatBudget = (budget: number) =>
  `₹${budget.toLocaleString('en-IN')}`;
