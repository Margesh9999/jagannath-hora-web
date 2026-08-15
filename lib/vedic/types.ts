import type { PlanetKey } from './constants'

export interface BirthData {
  date: string // YYYY-MM-DD (local at birth place)
  time: string // HH:MM (local at birth place)
  latitude: number
  longitude: number
  timezoneOffset: number // hours east of UTC (e.g. +5.5)
  place?: string
  gender?: 'male' | 'female' | 'other'
}

export interface PlanetPosition {
  key: PlanetKey
  name: string
  symbol: string
  // sidereal ecliptic longitude in degrees (0..360)
  longitude: number
  // tropical longitude before ayanamsa (for reference)
  tropicalLongitude: number
  latitude: number // ecliptic latitude
  speed: number // daily motion (deg/day), used for retrograde
  retrograde: boolean
  sign: number // 0..11 (sidereal sign)
  signName: string
  degreeInSign: number // 0..30
  nakshatra: number // 0..26
  nakshatraName: string
  pada: number // 1..4
  house: number // 1..12 (equal house from lagna)
  isNode: boolean
}

export interface ChartData {
  ascendant: {
    longitude: number
    sign: number
    signName: string
    degreeInSign: number
    nakshatra: number
    nakshatraName: string
  }
  planets: PlanetPosition[]
  ayanamsa: number
  birth: BirthData
  julianDay: number
  // positions keyed by planet for convenience
  byKey: Record<PlanetKey, PlanetPosition>
}

// Alias used throughout the calculation modules
export type ComputedChart = ChartData

export interface VargaChart {
  name: string // e.g. "D1", "D9"
  label: string // e.g. "Rashi", "Navamsha"
  // house/sign occupancy: for each sign 0..11, list of planet keys placed there
  signs: (PlanetKey | 'Asc')[][]
  // also store each planet's varga sign
  planetSigns: Record<string, number>
}

export interface DashaPeriod {
  planet: PlanetKey
  startDate: string // ISO
  endDate: string // ISO
  level: 'maha' | 'antar' | 'pratyantar'
  durationYears: number
}

export interface DashaResult {
  system: 'Vimshottari' | 'Ashtottari' | 'Yogini'
  mahadashas: DashaPeriod[]
  current: {
    maha: DashaPeriod
    antar: DashaPeriod | null
    pratyantar: DashaPeriod | null
  }
}

export interface PanchangData {
  date: string
  place: string
  sunrise: string
  sunset: string
  tithi: { index: number; name: string; paksha: 'Shukla' | 'Krishna' }
  nakshatra: { index: number; name: string; ruler: string }
  yoga: { index: number; name: string }
  karana: { index: number; name: string }
  vaara: { index: number; name: string }
  sunRashi: string
  moonRashi: string
}

export interface YogaResult {
  name: string
  sanskrit: string
  description: string
  present: boolean
}

export interface ShadbalaResult {
  planet: PlanetKey
  name: string
  total: number // total shadbala in rupas (out of ~60 or 100)
  isExalted: boolean
  details: { name: string; value: number }[]
}

export interface MatchResult {
  boy: BirthData
  girl: BirthData
  guna: {
    varna: number
    vashya: number
    tara: number
    yoni: number
    grahaMaitri: number
    gana: number
    bhakoot: number
    nadi: number
  }
  totalGuna: number
  maxGuna: number
  percentage: number
  mangalDoshaBoy: boolean
  mangalDoshaGirl: boolean
  verdict: string
  nakshatraBoy: string
  nakshatraGirl: string
  rashiBoy: string
  rashiGirl: string
}
