// 🪐 Vedic Astrology constants — signs, planets, nakshatras, dashas

export type PlanetKey =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu'

export type SignNature = 'movable' | 'fixed' | 'dual'

export interface SignInfo {
  index: number // 0..11
  name: string
  sanskrit: string
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
  nature: SignNature
  ruler: PlanetKey
  symbol: string
}

export const SIGNS: SignInfo[] = [
  { index: 0, name: 'Aries', sanskrit: 'Mesha', element: 'Fire', nature: 'movable', ruler: 'Mars', symbol: '♈' },
  { index: 1, name: 'Taurus', sanskrit: 'Vrishabha', element: 'Earth', nature: 'fixed', ruler: 'Venus', symbol: '♉' },
  { index: 2, name: 'Gemini', sanskrit: 'Mithuna', element: 'Air', nature: 'dual', ruler: 'Mercury', symbol: '♊' },
  { index: 3, name: 'Cancer', sanskrit: 'Kataka', element: 'Water', nature: 'movable', ruler: 'Moon', symbol: '♋' },
  { index: 4, name: 'Leo', sanskrit: 'Simha', element: 'Fire', nature: 'fixed', ruler: 'Sun', symbol: '♌' },
  { index: 5, name: 'Virgo', sanskrit: 'Kanya', element: 'Earth', nature: 'dual', ruler: 'Mercury', symbol: '♍' },
  { index: 6, name: 'Libra', sanskrit: 'Tula', element: 'Air', nature: 'movable', ruler: 'Venus', symbol: '♎' },
  { index: 7, name: 'Scorpio', sanskrit: 'Vrishchika', element: 'Water', nature: 'fixed', ruler: 'Mars', symbol: '♏' },
  { index: 8, name: 'Sagittarius', sanskrit: 'Dhanu', element: 'Fire', nature: 'dual', ruler: 'Jupiter', symbol: '♐' },
  { index: 9, name: 'Capricorn', sanskrit: 'Makara', element: 'Earth', nature: 'movable', ruler: 'Saturn', symbol: '♑' },
  { index: 10, name: 'Aquarius', sanskrit: 'Kumbha', element: 'Air', nature: 'fixed', ruler: 'Saturn', symbol: '♒' },
  { index: 11, name: 'Pisces', sanskrit: 'Meena', element: 'Water', nature: 'dual', ruler: 'Jupiter', symbol: '♓' },
]

export interface PlanetInfo {
  key: PlanetKey
  name: string
  sanskrit: string
  symbol: string
  isNode: boolean
  // Kaal Purusha / traditional gender & benefic nature used in classical rules
  benefic: boolean
  ownSigns: number[]
  exaltation: { sign: number; deg: number }
  debilitation: { sign: number; deg: number }
  mooltrikona: number
}

export const PLANETS: PlanetInfo[] = [
  { key: 'Sun', name: 'Sun', sanskrit: 'Surya', symbol: '☉', isNode: false, benefic: false, ownSigns: [4], exaltation: { sign: 0, deg: 10 }, debilitation: { sign: 6, deg: 10 }, mooltrikona: 4 },
  { key: 'Moon', name: 'Moon', sanskrit: 'Chandra', symbol: '☽', isNode: false, benefic: true, ownSigns: [3], exaltation: { sign: 1, deg: 3 }, debilitation: { sign: 7, deg: 3 }, mooltrikona: 3 },
  { key: 'Mars', name: 'Mars', sanskrit: 'Mangala', symbol: '♂', isNode: false, benefic: false, ownSigns: [0, 7], exaltation: { sign: 9, deg: 28 }, debilitation: { sign: 3, deg: 28 }, mooltrikona: 0 },
  { key: 'Mercury', name: 'Mercury', sanskrit: 'Budha', symbol: '☿', isNode: false, benefic: true, ownSigns: [2, 5], exaltation: { sign: 5, deg: 15 }, debilitation: { sign: 11, deg: 15 }, mooltrikona: 5 },
  { key: 'Jupiter', name: 'Jupiter', sanskrit: 'Guru', symbol: '♃', isNode: false, benefic: true, ownSigns: [8, 11], exaltation: { sign: 3, deg: 5 }, debilitation: { sign: 9, deg: 5 }, mooltrikona: 8 },
  { key: 'Venus', name: 'Venus', sanskrit: 'Shukra', symbol: '♀', isNode: false, benefic: true, ownSigns: [1, 6], exaltation: { sign: 11, deg: 27 }, debilitation: { sign: 5, deg: 27 }, mooltrikona: 1 },
  { key: 'Saturn', name: 'Saturn', sanskrit: 'Shani', symbol: '♄', isNode: false, benefic: false, ownSigns: [9, 10], exaltation: { sign: 6, deg: 20 }, debilitation: { sign: 0, deg: 20 }, mooltrikona: 10 },
  { key: 'Rahu', name: 'Rahu', sanskrit: 'Rahu', symbol: '☊', isNode: true, benefic: false, ownSigns: [], exaltation: { sign: 2, deg: 0 }, debilitation: { sign: 8, deg: 0 }, mooltrikona: 2 },
  { key: 'Ketu', name: 'Ketu', sanskrit: 'Ketu', symbol: '☋', isNode: true, benefic: false, ownSigns: [], exaltation: { sign: 8, deg: 0 }, debilitation: { sign: 2, deg: 0 }, mooltrikona: 8 },
]

export const PLANET_ORDER: PlanetKey[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']

export interface NakshatraInfo {
  index: number // 0..26
  name: string
  ruler: PlanetKey
  deity: string
  symbol: string
  // pada (quarters) each 3°20', 4 padas per nakshatra
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse' },
  { index: 1, name: 'Bharani', ruler: 'Venus', deity: 'Yama', symbol: 'Yoni' },
  { index: 2, name: 'Krittika', ruler: 'Sun', deity: 'Agni', symbol: 'Knife' },
  { index: 3, name: 'Rohini', ruler: 'Moon', deity: 'Brahma', symbol: 'Cart' },
  { index: 4, name: 'Mrigashira', ruler: 'Mars', deity: 'Soma', symbol: 'Deer' },
  { index: 5, name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', symbol: 'Teardrop' },
  { index: 6, name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi', symbol: 'Bow' },
  { index: 7, name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati', symbol: 'Flower' },
  { index: 8, name: 'Ashlesha', ruler: 'Mercury', deity: 'Nagas', symbol: 'Serpent' },
  { index: 9, name: 'Magha', ruler: 'Ketu', deity: 'Pitrs', symbol: 'Throne' },
  { index: 10, name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga', symbol: 'Bed' },
  { index: 11, name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman', symbol: 'Fig tree' },
  { index: 12, name: 'Hasta', ruler: 'Moon', deity: 'Savitar', symbol: 'Hand' },
  { index: 13, name: 'Chitra', ruler: 'Mars', deity: 'Vishwakarma', symbol: 'Pearl' },
  { index: 14, name: 'Swati', ruler: 'Rahu', deity: 'Vayu', symbol: 'Coral' },
  { index: 15, name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra-Agni', symbol: 'Pottery' },
  { index: 16, name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra', symbol: 'Lotus' },
  { index: 17, name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra', symbol: 'Earring' },
  { index: 18, name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', symbol: 'Roots' },
  { index: 19, name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas', symbol: 'Fan' },
  { index: 20, name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishve Devas', symbol: 'Elephant' },
  { index: 21, name: 'Shravana', ruler: 'Moon', deity: 'Vishnu', symbol: 'Ear' },
  { index: 22, name: 'Dhanishta', ruler: 'Mars', deity: 'Vasus', symbol: 'Drum' },
  { index: 23, name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', symbol: 'Circle' },
  { index: 24, name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Ajaikapada', symbol: 'Front legs' },
  { index: 25, name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahirbudhnya', symbol: 'Back legs' },
  { index: 26, name: 'Revati', ruler: 'Mercury', deity: 'Pushan', symbol: 'Fish' },
]

// Vimshottari dasha sequence (planet -> years)
export const VIMSHOTTARI: { planet: PlanetKey; years: number }[] = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
]
export const VIMSHOTTARI_TOTAL = VIMSHOTTARI.reduce((s, d) => s + d.years, 0) // 120

// Ashtottari dasha (8 planets, no Rahu/Ketu)
export const ASHTOTTARI: { planet: PlanetKey; years: number }[] = [
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 15 },
  { planet: 'Mars', years: 8 },
  { planet: 'Mercury', years: 17 },
  { planet: 'Jupiter', years: 10 },
  { planet: 'Venus', years: 20 },
  { planet: 'Saturn', years: 21 },
  { planet: 'Rahu', years: 11 },
]
export const ASHTOTTARI_TOTAL = ASHTOTTARI.reduce((s, d) => s + d.years, 0) // 108

export const VIMSHOTTARI_ORDER: PlanetKey[] = VIMSHOTTARI.map((d) => d.planet)

