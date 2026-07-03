/**
 * cities.js — City + locality data pool for seed generation.
 * Each city entry has:
 *   localities     — array of area names
 *   budgetRange    — [min, max] for realistic rent/budget in that city
 *   ownerBudgetMax — upper cap for listing rents
 */

export const CITIES = {
  Kanpur: {
    localities: [
      'Kakadeo', 'Swaroop Nagar', 'Kalyanpur', 'Govind Nagar',
      'Arya Nagar', 'Barra', 'Juhi', 'Kidwai Nagar', 'Vijay Nagar',
      'Harsh Nagar', 'Shyam Nagar', 'Civil Lines', 'Lakhanpur',
      'Panki', 'Ashok Nagar', 'Tilak Nagar',
    ],
    budgetRange: [4000, 11000],
    ownerBudgetMax: 14000,
  },
  Lucknow: {
    localities: [
      'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Hazratganj',
      'Mahanagar', 'Alambagh', 'Rajajipuram', 'Vikas Nagar',
      'Chinhat', 'Faizabad Road', 'Nishatganj', 'Jankipuram',
      'Kursi Road', 'Telibagh', 'Sushant Golf City',
    ],
    budgetRange: [5000, 14000],
    ownerBudgetMax: 18000,
  },
  Delhi: {
    localities: [
      'Mukherjee Nagar', 'Laxmi Nagar', 'Saket', 'Rohini',
      'Dwarka', 'Uttam Nagar', 'Karol Bagh', 'Janakpuri',
      'Malviya Nagar', 'Rajouri Garden', 'Pitampura', 'Patel Nagar',
      'Punjabi Bagh', 'Mayur Vihar', 'Preet Vihar', 'Vasant Kunj',
      'South Extension', 'Lajpat Nagar', 'Greater Kailash', 'Shahdara',
    ],
    budgetRange: [7000, 22000],
    ownerBudgetMax: 30000,
  },
  Noida: {
    localities: [
      'Sector 62', 'Sector 18', 'Sector 137', 'Sector 75',
      'Sector 50', 'Sector 44', 'Sector 11', 'Sector 15',
      'Sector 22', 'Sector 27', 'Sector 34', 'Sector 58',
      'Sector 63', 'Sector 76', 'Sector 100', 'Sector 120',
      'Sector 132', 'Sector 142', 'Greater Noida West',
    ],
    budgetRange: [7000, 20000],
    ownerBudgetMax: 28000,
  },
  Gurgaon: {
    localities: [
      'DLF Phase 1', 'DLF Phase 2', 'Sector 14', 'Sector 23',
      'Sector 45', 'Sohna Road', 'MG Road', 'Golf Course Road',
      'Huda City Centre', 'Sector 56', 'Ardee City', 'Palam Vihar',
      'Manesar', 'South City', 'Nirvana Country', 'Sector 79',
    ],
    budgetRange: [9000, 28000],
    ownerBudgetMax: 40000,
  },
  Prayagraj: {
    localities: [
      'Civil Lines', 'George Town', 'Allapur', 'Kydganj',
      'Lukerganj', 'Naini', 'Phaphamau', 'Jhunsi',
      'Mumfordganj', 'Ashok Nagar', 'Tagore Town', 'Kareli',
    ],
    budgetRange: [3500, 9000],
    ownerBudgetMax: 12000,
  },
  Varanasi: {
    localities: [
      'Lanka', 'Assi Ghat', 'BHU Area', 'Sigra',
      'Nadesar', 'Orderly Bazar', 'Sunder Nagar', 'Bhelupur',
      'Pandeypur', 'Shivpur', 'Babatpur', 'Rohania',
    ],
    budgetRange: [3500, 9000],
    ownerBudgetMax: 12000,
  },
  Bangalore: {
    localities: [
      'Koramangala', 'Whitefield', 'HSR Layout', 'Marathahalli',
      'Indiranagar', 'Jayanagar', 'Electronic City', 'BTM Layout',
      'Bellandur', 'Sarjapur', 'Bannerghatta Road', 'Hebbal',
      'Yelahanka', 'Banashankari', 'Kengeri', 'Vijayanagar',
      'Rajajinagar', 'Malleswaram', 'Basavanagudi', 'Bommanahalli',
    ],
    budgetRange: [9000, 28000],
    ownerBudgetMax: 40000,
  },
  Pune: {
    localities: [
      'Hinjewadi', 'Wakad', 'Viman Nagar', 'Kothrud',
      'Baner', 'Aundh', 'Hadapsar', 'Pimple Saudagar',
      'Shivajinagar', 'Kharadi', 'Wagholi', 'Pimpri',
      'Chinchwad', 'Kondhwa', 'Katraj', 'Bibwewadi',
      'Deccan', 'Camp', 'Wanowrie', 'Dhanori',
    ],
    budgetRange: [8000, 22000],
    ownerBudgetMax: 32000,
  },
  Hyderabad: {
    localities: [
      'Gachibowli', 'Hitech City', 'Madhapur', 'Kondapur',
      'Kukatpally', 'Banjara Hills', 'Jubilee Hills', 'Ameerpet',
      'SR Nagar', 'Dilsukhnagar', 'LB Nagar', 'Chanda Nagar',
      'Secunderabad', 'Begumpet', 'Tolichowki', 'Attapur',
      'Manikonda', 'Nallagandla', 'Miyapur', 'Kompally',
    ],
    budgetRange: [7000, 22000],
    ownerBudgetMax: 32000,
  },
  Mumbai: {
    localities: [
      'Andheri West', 'Andheri East', 'Bandra West', 'Borivali',
      'Malad', 'Goregaon', 'Kandivali', 'Ghatkopar',
      'Powai', 'Vikhroli', 'Kurla', 'Sion',
      'Dadar', 'Chembur', 'Mulund', 'Thane',
      'Navi Mumbai', 'Worli', 'Lower Parel', 'Byculla',
    ],
    budgetRange: [10000, 35000],
    ownerBudgetMax: 50000,
  },
  Jaipur: {
    localities: [
      'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Malviya Nagar',
      'Jagatpura', 'Sanganer', 'Tonk Road', 'Sitapura',
      'Shyam Nagar', 'Vidhyadhar Nagar', 'Ajmer Road', 'Sirsi Road',
    ],
    budgetRange: [5000, 13000],
    ownerBudgetMax: 18000,
  },
  Indore: {
    localities: [
      'Vijay Nagar', 'Palasia', 'AB Road', 'Scheme 78',
      'Bhawarkuan', 'LIG Colony', 'Nipania', 'Silicon City',
      'Bangali Square', 'South Tukoganj', 'Mhow Naka', 'Rajwada',
    ],
    budgetRange: [4500, 11000],
    ownerBudgetMax: 16000,
  },
  Bhopal: {
    localities: [
      'MP Nagar', 'Arera Colony', 'Shahpura', 'Kolar Road',
      'Hoshangabad Road', 'Govindpura', 'Danish Kunj', 'Misrod',
      'Bawadia Kalan', 'Ayodhya Nagar', 'Bittan Market', 'Tulsi Nagar',
    ],
    budgetRange: [4000, 10000],
    ownerBudgetMax: 14000,
  },
  Ghaziabad: {
    localities: [
      'Indirapuram', 'Vaishali', 'Rajnagar Extension', 'Kaushambi',
      'Crossing Republik', 'Mohan Nagar', 'Sanjay Nagar', 'Vasundhara',
      'Govindpuram', 'Dasna', 'Loni', 'Pratap Vihar',
    ],
    budgetRange: [6000, 16000],
    ownerBudgetMax: 22000,
  },
};

export const CITY_NAMES = Object.keys(CITIES);

/** Pick a random element from an array */
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Pick a random integer between min and max (inclusive) */
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Round to nearest N */
export const roundTo = (n, nearest = 500) => Math.round(n / nearest) * nearest;

/** Pick a city and one of its localities */
export const pickCityLocality = () => {
  const city = pick(CITY_NAMES);
  const locality = pick(CITIES[city].localities);
  return { city, locality };
};

/** Pick 1-3 preferred areas from a city */
export const pickPreferredAreas = (city, count = 2) => {
  const locs = [...CITIES[city].localities];
  const shuffled = locs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, locs.length));
};

/** Generate a realistic budget for a given city and occupation */
export const pickBudget = (city, occupation) => {
  const [min, max] = CITIES[city].budgetRange;
  let budget = randInt(min, max);

  // Students and UPSC aspirants tend to have lower budgets
  if (['student', 'UPSC aspirant', 'intern'].includes(occupation)) {
    budget = Math.min(budget, min + (max - min) * 0.55);
  }
  // High-income professions skew higher
  if (['banker', 'doctor', 'lawyer', 'engineer'].includes(occupation)) {
    budget = Math.max(budget, min + (max - min) * 0.45);
  }

  return roundTo(budget, 500);
};
