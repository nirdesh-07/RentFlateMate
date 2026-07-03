// ── Backend-matched API types ────────────────────────────────────────────────

export type SearchingFor = 'room' | 'roommate';
export type LookingForGender = 'male' | 'female' | 'any';
export type Gender = 'male' | 'female' | 'other';
export type Occupation =
  | 'student' | 'working professional' | 'intern' | 'freelancer'
  | 'startup employee' | 'UPSC aspirant' | 'MBA student' | 'designer'
  | 'teacher' | 'nurse' | 'banker' | 'sales employee' | 'engineer'
  | 'doctor' | 'lawyer' | 'other';

export interface SeekerProfile {
  _id: string;
  userId: { _id: string; name: string; email: string; profilePic: string | null };
  name: string;
  gender: Gender;
  age: number;
  occupation: Occupation;
  searchingFor: SearchingFor;
  city: string;
  locality: string;
  preferredAreas: string[];
  budget: number;
  moveInDate: string | null;
  lookingForGender: LookingForGender;
  roomTypePreference: string;
  foodPreference: 'veg' | 'non-veg' | 'any';
  smoking: boolean;
  drinking: boolean;
  pets: boolean;
  bio: string;
  profilePic: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ListingType = 'room' | 'pg' | 'shared-flat' | 'studio' | '1BHK' | '2BHK' | '3BHK';

// Extended API listing (from backend — superset of the old mock Listing)
export interface ApiListing {
  _id: string;
  ownerId: { _id: string; name: string; email: string; profilePic: string | null };
  title: string;
  description: string;
  city: string;
  locality: string;
  address: string;
  rent: number;
  deposit: number;
  availableFrom: string;
  roomType: '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'PG' | 'Studio' | 'Independent House';
  furnished: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  genderPreference: 'male' | 'female' | 'any';
  amenities: string[];
  images: string[];
  status: 'active' | 'filled' | 'inactive';
  listingType: ListingType;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

export interface CityStats {
  _id: string;
  total: number;
  roomSeekers: number;
  roommateSeekers: number;
}

// ── Legacy mock types (kept for backward compat with existing components) ────

export interface Listing {
  id: string;
  title: string;
  city: string;
  locality: string;
  rent: number;
  deposit: number;
  roomType: "Private Room" | "Shared Room" | "Entire Flat" | "PG";
  genderPreference: "Any" | "Male" | "Female";
  availableFrom: string;
  furnished: boolean;
  amenities: string[];
  score: number;
  scoreExplanation: string;
  image: string;
  occupancy: { current: number; max: number };
}

export const listings: Listing[] = [
  {
    id: "l1",
    title: "Sunlit 2BHK near tech park, balcony + workspace nook",
    city: "Bengaluru",
    locality: "HSR Layout",
    rent: 18500,
    deposit: 37000,
    roomType: "Private Room",
    genderPreference: "Any",
    availableFrom: "2026-07-15",
    furnished: true,
    amenities: ["Wifi", "Washing Machine", "Parking", "AC"],
    score: 92,
    scoreExplanation: "Budget and locality match closely; move-in date aligns within your window.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    occupancy: { current: 1, max: 2 },
  },
  {
    id: "l2",
    title: "Quiet PG for working professionals, home-cooked meals",
    city: "Pune",
    locality: "Kothrud",
    rent: 12000,
    deposit: 12000,
    roomType: "PG",
    genderPreference: "Female",
    availableFrom: "2026-08-01",
    furnished: true,
    amenities: ["Wifi", "Meals", "Housekeeping"],
    score: 78,
    scoreExplanation: "Strong budget fit; move-in date is two weeks past your preferred range.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    occupancy: { current: 2, max: 3 },
  },
  {
    id: "l3",
    title: "Spacious flat share, terrace garden, pet friendly",
    city: "Mumbai",
    locality: "Andheri West",
    rent: 24000,
    deposit: 48000,
    roomType: "Shared Room",
    genderPreference: "Any",
    availableFrom: "2026-07-05",
    furnished: false,
    amenities: ["Wifi", "Parking", "Pet Friendly"],
    score: 65,
    scoreExplanation: "Rent is above your stated budget by 12%; locality and timing match well.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    occupancy: { current: 1, max: 3 },
  },
  {
    id: "l4",
    title: "Modern studio, walk to metro, ideal for one tenant",
    city: "Hyderabad",
    locality: "Gachibowli",
    rent: 16000,
    deposit: 32000,
    roomType: "Entire Flat",
    genderPreference: "Any",
    availableFrom: "2026-07-20",
    furnished: true,
    amenities: ["Wifi", "AC", "Gym Access"],
    score: 88,
    scoreExplanation: "Excellent budget and location match; furnished status meets your preference.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    occupancy: { current: 0, max: 1 },
  },
];

export const testimonials = [
  {
    name: "Ayesha R.",
    role: "Tenant, Bengaluru",
    quote:
      "I stopped messaging twenty listings a day. The score told me which three were actually worth my time, and I moved in within a week.",
  },
  {
    name: "Vikram S.",
    role: "Owner, Pune",
    quote:
      "Posted my spare room on a Friday, had three serious, compatible requests by Sunday night, no back-and-forth about budget.",
  },
  {
    name: "Priya N.",
    role: "Tenant, Mumbai",
    quote:
      "The chat opening only after both sides accept saved me from the usual awkward negotiation. It just felt safer.",
  },
];

export const faqs = [
  {
    q: "How is the compatibility score calculated?",
    a: "Our AI model compares your profile (budget, location, move-in date, lifestyle) against a listing's details and returns a 0–100 score with a short explanation. If the AI service is unavailable, a transparent rule-based engine takes over automatically.",
  },
  {
    q: "Do I need to pay to browse listings?",
    a: "No. Browsing, creating a profile, and sending interest requests are all free. Owners can post listings at no cost as well.",
  },
  {
    q: "What happens after I show interest in a room?",
    a: "The owner is notified instantly and can accept or reject your request. Chat unlocks automatically the moment they accept.",
  },
  {
    q: "Can I update my profile after I've been matched?",
    a: "Yes, and your compatibility scores recalculate automatically whenever you update your profile or an owner updates their listing.",
  },
];
