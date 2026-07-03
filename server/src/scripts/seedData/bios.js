/**
 * bios.js — Realistic bio templates for room-seekers and roommate-seekers.
 * Templates use {city}, {locality}, {budget}, {occupation} as placeholders.
 */

// ─── Room Seeker Bios (searchingFor = "room") ─────────────────────────────

export const ROOM_SEEKER_BIOS = [
  "Hi! I'm a {occupation} relocating to {city} for work. Looking for a decent place near {locality} within ₹{budget}/month. I'm clean, quiet, and very particular about maintaining the house. I keep odd hours sometimes but I'm super respectful of shared spaces.",
  "Shifting to {city} next month. Working as a {occupation} — office is near {locality}. Need a furnished room, ideally with a working AC and good WiFi. Budget is around ₹{budget}. No smoking, no drama. Let's keep things simple.",
  "Moving to {city} for my new job. {occupation} by profession, pretty easy-going as a person. Looking for a room in {locality} or nearby areas. Budget: ₹{budget}/month. I cook sometimes, don't party at home, and sleep by midnight. 😊",
  "First-time tenant in {city}! Just got placed as a {occupation} here. Need a small room to settle in near {locality} side. Budget around ₹{budget}. I'm vegetarian, don't smoke, and I like keeping the kitchen clean.",
  "Looking for a place to rent in {city}. I'm a {occupation} working in the {locality} area. Comfortable budget around ₹{budget}/month. Non-smoker, early riser. Have been renting for 3 years, references available.",
  "Searching for a room in {city}, preferably {locality}. I'm a {occupation} and my schedule is mostly 9-6. Budget: ₹{budget}. I prefer quiet neighbourhoods. I've been living on rent for years and I'm a responsible tenant.",
  "New to {city}! Just joined as a {occupation}. Looking for accommodation near {locality} within ₹{budget}/month. I travel light, keep my space tidy, and respect boundaries. Looking for a comfortable, clean room.",
  "Just got an internship in {city} starting next month. Looking for affordable accommodation near {locality}. Budget: ₹{budget}/month. I'm a student, very clean, vegetarian. Would appreciate a friendly setup.",
  "Preparing for competitive exams in {city}. Need a quiet room near {locality} — study environment is important to me. Budget: ₹{budget}/month. I'm a serious, focused person and I need minimal disturbance.",
  "Working professional seeking accommodation in {city}. Job location is near {locality}. Budget: ₹{budget}/month. Been on rent in two cities already — very self-sufficient. No pets, no smokers around me please.",
  "Hi, I'm a {occupation} moving to {city} this month. Budget around ₹{budget}. Prefer a room near {locality}. I work late but I'm quiet and clean. Happy to share flat with responsible people.",
  "Looking for rental accommodation in {city} near {locality}. I'm a {occupation}, easy-going and tidy. Budget: ₹{budget}. I cook my own food, don't host parties and keep to myself mostly.",
  "Transferred to {city} office next month. {occupation} by profession. Searching for a comfortable room around {locality}. Budget: ₹{budget}. Non-smoker, non-drinker. Would prefer a peaceful setup.",
  "New in {city} for my MBA studies. Searching for a room near {locality}. Budget around ₹{budget}/month. Looking for a clean, safe, and affordable room in a good locality. Flexible on furnishing.",
  "Recently joined startup in {city}. Looking for housing near {locality}, budget ₹{budget}. Startup life means occasional late nights but I'm very respectful. Open to sharing with working professionals.",
  "Freelancer setting up base in {city}. Work from home so I need decent internet. Looking near {locality}, budget ₹{budget}. I'm disciplined, quiet and keep my space very organised.",
  "Design professional relocating to {city}. Budget ₹{budget}. Preferably near {locality}. I work from office 5 days a week, don't smoke, and I'm pretty low-maintenance as a tenant.",
  "UPSC aspirant moving to {city} for coaching. Need a quiet room near {locality} area. Budget ₹{budget}/month. Study is my priority — looking for a calm, non-disruptive environment.",
  "Nurse working at a hospital near {locality}, {city}. Shifts can be irregular but I'm very disciplined and clean. Looking for a room within ₹{budget}. Prefer female-only setup.",
  "Bank employee transferred to {city}. Looking for accommodation near {locality}. Budget ₹{budget}. No drama, very punctual, tidy person. References from previous landlord available.",
  "Teacher posting here — moving to {city} for a new school. Looking for decent room near {locality}. Budget: ₹{budget}. I keep a simple, disciplined lifestyle. Vegetarian, no smoke.",
  "Sales professional always on the go! Based out of {city} now. Need a room near {locality}. Budget ₹{budget}/month. I'm often travelling so the flat will mostly be empty. Very low maintenance.",
  "MBA student moving to {city} for internship. Looking for a furnished room near {locality}. Budget ₹{budget}. I'm 22, clean, non-smoker. Would prefer shared accommodation with friendly people.",
  "Graphic designer, remote worker, moving to {city} for better internet and quality of life. Looking near {locality}. Budget ₹{budget}. Need reliable WiFi more than anything else!",
];

// ─── Roommate Seeker Bios (searchingFor = "roommate") ─────────────────────

export const ROOMMATE_SEEKER_BIOS = [
  "We have a nice 2BHK in {locality}, {city} and one room is vacant. Looking for a responsible {lookingFor} flatmate. Rent is ₹{budget}/month per person. We're a friendly bunch — working professionals, quiet evenings.",
  "Shared flat in {locality}, {city}. One of us just moved out so we have a room available. Looking for a {lookingFor} flatmate. Budget: ₹{budget}/month. No smoking inside. Weekends are chill.",
  "Hi! I'm a {occupation} living alone in a 2BHK in {locality}. Looking for a {lookingFor} flatmate to share expenses. Rent per person would be ₹{budget}/month. Clean, simple living preferred.",
  "I stay near {locality} in {city} and looking for a co-tenant. Already have the flat. Budget share: ₹{budget}/month each. Looking for someone with similar working hours and habits. {lookingFor} preferred.",
  "1 room available in our shared 3BHK in {locality}, {city}. 2 of us stay here, both working professionals. Looking for a {lookingFor} flatmate within ₹{budget}/month. Vegetarians preferred but not a strict rule.",
  "Looking for a flatmate! I have a 2-room set in {locality}, {city}. Need someone to split rent. Looking for a {lookingFor} person, budget ₹{budget}/month each. I work from office, clean, quiet evenings.",
  "Moving to {city} next month and looking for a flatmate to share accommodation near {locality}. Budget ₹{budget}/month per person. Prefer a {lookingFor} flatmate who is clean and responsible.",
  "Room available in our PG-style shared flat in {locality}. Looking for a {lookingFor} person to share. Monthly share: ₹{budget}. Kitchen, WiFi included. Currently 2 occupants.",
  "Searching for a roommate in {city}. I have a 1BHK in {locality} and looking to split. Rent would be ₹{budget}/month each. I'm a {occupation} — I respect everyone's space and time.",
  "I'm a {occupation} living in {locality}, {city}. My previous flatmate left and I need a new one. ₹{budget}/month for the spare room. Looking for a {lookingFor} person — should be clean and working.",
  "Hello! Two working girls looking for a third flatmate for our 3BHK in {locality}, {city}. Rent per person: ₹{budget}. Looking for a {lookingFor} person who is friendly and responsible.",
  "Flat in {locality} with one vacancy. 2 {occupation}s currently staying. Monthly cost: ₹{budget}/person. Looking for a {lookingFor} person. We cook together sometimes, respect each other's privacy.",
  "Need a roommate for my 2BHK in {locality}, {city}. Looking for a {lookingFor} who doesn't smoke and is relatively clean. Rent: ₹{budget}/month. I work 9-6 so flat is usually free during the day.",
  "Shifting to {locality}, {city} and looking for someone to co-share a 2BHK. Budget: ₹{budget}/month per person. Prefer a {lookingFor} person — same field or different doesn't matter, just compatible.",
  "PG/shared flat vacancy in {locality}. Looking for a {lookingFor} person for one of our 3 rooms. Monthly rent: ₹{budget}. We're a mix of students and working professionals.",
];

/** Fill placeholders in a bio template */
export const fillBio = (template, data) => {
  return template
    .replace(/{city}/g, data.city || '')
    .replace(/{locality}/g, data.locality || '')
    .replace(/{budget}/g, String(data.budget || ''))
    .replace(/{occupation}/g, data.occupation || 'professional')
    .replace(/{lookingFor}/g, data.lookingForGender || 'flatmate');
};
