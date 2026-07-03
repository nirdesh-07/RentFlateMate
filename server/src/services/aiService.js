import { GoogleGenAI } from '@google/genai';
import Listing from '../models/Listing.js';

// ────────────────────────────────────────────────
// PLATFORM KNOWLEDGE  (used for app_help intent)
// ────────────────────────────────────────────────
const PLATFORM_CONTEXT = `
You are FlatmateBot, the friendly AI assistant for RentFlatemate — a platform that helps people find rooms, flats, and compatible flatmates across Indian cities.

Platform features:
- Tenants can browse room listings and filter by city, rent, room type, and furnished status.
- Owners can post rooms/flats with details like rent, locality, amenities, room type.
- Tenants send an "interest request" to the owner of a listing.
- Owners can accept or reject interest requests.
- After an interest is accepted, a private chat opens between tenant and owner.
- The "Compatibility Score" (0–100) shows how well a listing matches a tenant's preferences (budget, city, room type, gender preference).
- Users register/login using email and password; OTP verification is available.
- The platform is currently available in: Bengaluru, Pune, Mumbai, Hyderabad, Delhi NCR, Chennai.
- All interactions are on the web platform at http://localhost:3000.

Answer only questions related to the platform, room finding, or flatmate matching. Keep answers short and friendly.
`;

// ────────────────────────────────────────────────
// INTENT DETECTION (rule-based, fast)
// ────────────────────────────────────────────────
const LISTING_KEYWORDS = [
  'room', 'flat', 'listing', 'rent', 'house', 'apartment', 'pg', 'bhk', 'rk',
  'studio', 'furnished', 'unfurnished', 'locality', 'near', 'city', 'under',
  'budget', 'flatmate', 'looking for', 'find', 'show', 'available', 'deposit',
  'bedroom', 'accommodation', '₹', 'rs', 'inr', 'kanpur', 'lucknow', 'delhi',
  'bengaluru', 'bangalore', 'pune', 'mumbai', 'hyderabad', 'chennai',
];

const APP_HELP_KEYWORDS = [
  'how do i', 'how to', 'how can i', 'steps to', 'guide',
  'contact owner', 'post listing', 'post a room', 'add listing',
  'compatibility score', 'compatibility', 'interest request', 'send interest',
  'chat with owner', 'accept', 'reject', 'login', 'register', 'sign up',
  'profile', 'account', 'notification', 'match', 'matching', 'what is',
  'what does', 'how does', 'explain',
];

export const detectIntent = (message) => {
  const lower = message.toLowerCase();

  // Check app-help first (more specific)
  const isAppHelp = APP_HELP_KEYWORDS.some((kw) => lower.includes(kw));
  if (isAppHelp) return 'app_help';

  // Check listing search
  const isListing = LISTING_KEYWORDS.some((kw) => lower.includes(kw));
  if (isListing) return 'listing_search';

  return 'general_guidance';
};

// ────────────────────────────────────────────────
// FILTER EXTRACTION from natural language
// ────────────────────────────────────────────────
const CITY_MAP = {
  kanpur: 'Kanpur',
  lucknow: 'Lucknow',
  bengaluru: 'Bengaluru',
  bangalore: 'Bengaluru',
  pune: 'Pune',
  mumbai: 'Mumbai',
  hyderabad: 'Hyderabad',
  delhi: 'Delhi NCR',
  'delhi ncr': 'Delhi NCR',
  chennai: 'Chennai',
};

const ROOM_TYPE_MAP = {
  '1rk': '1RK',
  '1bhk': '1BHK',
  '2bhk': '2BHK',
  '3bhk': '3BHK',
  '4bhk': '4BHK',
  'pg': 'PG',
  studio: 'Studio',
  'independent house': 'Independent House',
};

export const extractFilters = (message) => {
  const lower = message.toLowerCase();
  const filters = {};

  // City detection
  for (const [key, val] of Object.entries(CITY_MAP)) {
    if (lower.includes(key)) {
      filters.city = val;
      break;
    }
  }

  // Budget — "under X", "below X", "less than X", "upto X", "max X"
  const budgetMatch = lower.match(
    /(?:under|below|less than|upto|up to|max|within|budget\s*(?:of|is)?)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
  );
  if (budgetMatch) {
    filters.maxRent = Number(budgetMatch[1].replace(/,/g, ''));
  }

  // Also catch patterns like "8000 budget", "8k budget", "8000 rent"
  const altBudget = lower.match(/([\d,]+)\s*(?:k\b)?(?:\s*(?:budget|rent|per month|\/month|monthly))/i);
  if (!filters.maxRent && altBudget) {
    let val = Number(altBudget[1].replace(/,/g, ''));
    if (lower.includes('k') && val < 1000) val *= 1000; // "10k" → 10000
    filters.maxRent = val;
  }

  // Room type
  for (const [key, val] of Object.entries(ROOM_TYPE_MAP)) {
    if (lower.includes(key)) {
      filters.roomType = val;
      break;
    }
  }

  // Furnished
  if (lower.includes('fully furnished') || lower.includes('fully-furnished')) {
    filters.furnished = 'fully-furnished';
  } else if (lower.includes('semi furnished') || lower.includes('semi-furnished')) {
    filters.furnished = 'semi-furnished';
  } else if (lower.includes('furnished')) {
    // Match any furnished preference unless "unfurnished"
    if (!lower.includes('unfurnished')) {
      filters.furnished = { $in: ['fully-furnished', 'semi-furnished'] };
    } else {
      filters.furnished = 'unfurnished';
    }
  }

  // Gender preference
  if (lower.includes('female only') || lower.includes('girls only') || lower.includes('for girls')) {
    filters.genderPreference = 'female';
  } else if (lower.includes('male only') || lower.includes('boys only') || lower.includes('for boys')) {
    filters.genderPreference = 'male';
  }

  return filters;
};

// ────────────────────────────────────────────────
// LISTING SEARCH  (queries MongoDB)
// ────────────────────────────────────────────────
export const handleListingSearch = async (message) => {
  const filters = extractFilters(message);
  const query = { status: 'active' };

  if (filters.city) query.city = { $regex: new RegExp(`^${filters.city}$`, 'i') };
  if (filters.maxRent) query.rent = { $lte: filters.maxRent };
  if (filters.roomType) query.roomType = filters.roomType;
  if (filters.furnished) query.furnished = filters.furnished;
  if (filters.genderPreference) query.genderPreference = { $in: [filters.genderPreference, 'any'] };

  const listings = await Listing.find(query)
    .select('title city locality rent roomType furnished genderPreference amenities')
    .limit(5)
    .sort({ rent: 1 });

  if (listings.length === 0) {
    const hints = [];
    if (filters.city) hints.push(`city: ${filters.city}`);
    if (filters.maxRent) hints.push(`budget: ₹${filters.maxRent.toLocaleString('en-IN')}`);
    if (filters.roomType) hints.push(`type: ${filters.roomType}`);

    return `😔 I couldn't find any rooms${hints.length ? ` matching ${hints.join(', ')}` : ''}.\n\nYou could try:\n• Increasing your budget\n• Searching a nearby city\n• Removing room-type or furnished filters\n\nYou can also browse all listings on the **Listings** page!`;
  }

  const cityStr = filters.city ? ` in ${filters.city}` : '';
  const budgetStr = filters.maxRent ? ` under ₹${filters.maxRent.toLocaleString('en-IN')}` : '';
  const header = `🏠 Found **${listings.length}** room${listings.length > 1 ? 's' : ''}${cityStr}${budgetStr}:\n\n`;

  const items = listings.map((l, i) => {
    const furnLabel =
      l.furnished === 'fully-furnished'
        ? '✅ Fully Furnished'
        : l.furnished === 'semi-furnished'
        ? '🛋 Semi-Furnished'
        : '📦 Unfurnished';
    return `**${i + 1}. ${l.title}**\n   📍 ${l.locality}, ${l.city} · ${l.roomType} · ₹${l.rent.toLocaleString('en-IN')}/mo\n   ${furnLabel}`;
  }).join('\n\n');

  const footer = '\n\n👉 Go to the **Listings** page to view full details and send interest!';
  return header + items + footer;
};

// ────────────────────────────────────────────────
// GEMINI CALL  (for app_help + general_guidance)
// ────────────────────────────────────────────────
let geminiClient = null;
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
};

export const callGemini = async (userMessage, intent) => {
  const ai = getGeminiClient();
  if (!ai) {
    // No API key — return smart fallback answers
    return fallbackAnswer(userMessage, intent);
  }

  const systemInstruction = intent === 'app_help'
    ? PLATFORM_CONTEXT + '\nAnswer this platform question clearly and briefly (2-4 sentences max).'
    : PLATFORM_CONTEXT + '\nProvide practical, friendly renting/flatmate advice (3-5 sentences max). Stay focused on the topic.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    });
    return response.text?.trim() || fallbackAnswer(userMessage, intent);
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return fallbackAnswer(userMessage, intent);
  }
};

// ────────────────────────────────────────────────
// OFFLINE FALLBACK ANSWERS (no API key / API down)
// ────────────────────────────────────────────────
const FALLBACK_QA = [
  {
    keywords: ['post', 'listing', 'add listing', 'post a room'],
    answer: '📋 To post a listing, log in as an **Owner**, go to your dashboard, and click **"Post a Room"**. Fill in details like rent, city, room type, and amenities.',
  },
  {
    keywords: ['contact', 'owner', 'message owner', 'chat with owner'],
    answer: '💬 You can chat with an owner after they **accept your interest request**. Send interest on a listing, and if the owner accepts, a private chat opens.',
  },
  {
    keywords: ['interest', 'send interest', 'request'],
    answer: '👋 Open any listing, scroll down, and tap **"Send Interest"**. The owner will be notified. Once they accept, you can chat directly!',
  },
  {
    keywords: ['compatibility score', 'compatibility', 'score'],
    answer: '🎯 The **Compatibility Score** (0–100) shows how well a listing matches your preferences — budget, city, room type, and gender preference. Higher = better match!',
  },
  {
    keywords: ['login', 'sign up', 'register', 'account'],
    answer: '🔑 Register with your email and password at **/register**. Use **/login** to sign in. OTP verification helps keep your account secure.',
  },
  {
    keywords: ['flatmate', 'roommate', 'match'],
    answer: '🤝 RentFlatemate uses your profile preferences to calculate compatibility with listings. Set your city, budget, and room type in your profile for the best matches!',
  },
];

const fallbackAnswer = (message, intent) => {
  const lower = message.toLowerCase();
  for (const qa of FALLBACK_QA) {
    if (qa.keywords.some((kw) => lower.includes(kw))) {
      return qa.answer;
    }
  }

  if (intent === 'app_help') {
    return '🤔 I can help with finding rooms, sending interest, chatting with owners, and understanding compatibility scores. What would you like to know?';
  }

  return '💡 Great question! For renting tips: always verify the owner\'s identity, check for hidden charges, and visit the property before paying any advance. Want more specific advice?';
};

// ────────────────────────────────────────────────
// MAIN ORCHESTRATOR
// ────────────────────────────────────────────────
export const processChat = async (userMessage) => {
  const message = userMessage?.trim();
  if (!message) return '👋 Hey! Ask me anything about finding rooms, posting listings, or how RentFlatemate works!';

  const intent = detectIntent(message);

  if (intent === 'listing_search') {
    return await handleListingSearch(message);
  }

  // app_help and general_guidance both go to Gemini (with different system prompts)
  return await callGemini(message, intent);
};
