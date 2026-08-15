import type { BirthData, ChartData, DashaPeriod, DashaResult, ComputedChart } from './types'
import { VIMSHOTTARI, ASHTOTTARI, VIMSHOTTARI_TOTAL, ASHTOTTARI_TOTAL, PLANET_ORDER, NAKSHATRAS, type PlanetKey } from './constants'
import { birthToUTC, normalize360 } from './astronomy'

const DAYS_PER_YEAR = 365.25

function addYears(date: Date, years: number): Date {
  return new Date(date.getTime() + years * DAYS_PER_YEAR * 86400000)
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10)
}

interface DashaSystemDef {
  system: 'Vimshottari' | 'Ashtottari' | 'Yogini'
  sequence: { planet: PlanetKey; years: number }[]
  total: number
  // for Yogini the cycle length is 8 (different mapping handled separately)
}

function rotateTo(sequence: { planet: PlanetKey; years: number }[], startPlanet: PlanetKey) {
  const idx = sequence.findIndex((s) => s.planet === startPlanet)
  return [...sequence.slice(idx), ...sequence.slice(0, idx)]
}

export function buildDasha(
  birth: BirthData,
  chart: ComputedChart,
  system: 'Vimshottari' | 'Ashtottari' | 'Yogini' = 'Vimshottari'
): DashaResult {
  const birthUTC = birthToUTC(birth)
  const moonLong = chart.byKey.Moon.longitude
  const total = 360 / 27
  const nakIdx = Math.floor(normalize360(moonLong) / total) % 27
  const withinNak = normalize360(moonLong) - nakIdx * total
  const fraction = withinNak / total // 0..1 elapsed in the nakshatra

  let sequence: { planet: PlanetKey; years: number }[]
  let totalYears: number
  let startPlanet: PlanetKey

  if (system === 'Vimshottari') {
    sequence = VIMSHOTTARI
    totalYears = VIMSHOTTARI_TOTAL
    startPlanet = NAKSHATRAS[nakIdx].ruler
  } else if (system === 'Ashtottari') {
    sequence = ASHTOTTARI
    totalYears = ASHTOTTARI_TOTAL
    // Ashtottari starts from the nakshatra lord but only 8 planets (no Ketu in sequence? actually Ashtottari uses Sun,Moon,Mars,Mercury,Jupiter,Venus,Saturn,Rahu)
    startPlanet = NAKSHATRAS[nakIdx].ruler
    if (startPlanet === 'Ketu') startPlanet = 'Sun'
  } else {
    // Yogini
    const YOGINI = [
      { planet: 'Moon' as PlanetKey, years: 1 },
      { planet: 'Sun' as PlanetKey, years: 2 },
      { planet: 'Jupiter' as PlanetKey, years: 3 },
      { planet: 'Mars' as PlanetKey, years: 4 },
      { planet: 'Mercury' as PlanetKey, years: 5 },
      { planet: 'Saturn' as PlanetKey, years: 6 },
      { planet: 'Venus' as PlanetKey, years: 7 },
      { planet: 'Rahu' as PlanetKey, years: 8 },
    ]
    sequence = YOGINI
    totalYears = 36
    startPlanet = YOGINI[nakIdx % 8].planet
  }

  const rotated = rotateTo(sequence, startPlanet)
  const firstYears = rotated[0].years
  const elapsedFirst = fraction * firstYears
  const firstStart = addYears(birthUTC, -elapsedFirst)

  // Mahadashas
  const mahadashas: DashaPeriod[] = []
  let cursor = new Date(firstStart)
  for (const s of rotated) {
    const end = addYears(cursor, s.years)
    mahadashas.push({
      planet: s.planet,
      startDate: fmt(cursor),
      endDate: fmt(end),
      level: 'maha',
      durationYears: s.years,
    })
    cursor = new Date(end)
  }

  // Current period at now
  const now = new Date()
  const currentMaha = mahadashas.find((m) => now >= new Date(m.startDate) && now < new Date(m.endDate)) ?? mahadashas[0]

  // Antardashas within currentMaha
  function subPeriods(mahaPlanet: PlanetKey, mahaStart: Date, mahaYears: number, level: 'antar' | 'pratyantar'): DashaPeriod[] {
    const subSeq = rotateTo(sequence, mahaPlanet)
    const out: DashaPeriod[] = []
    let c = new Date(mahaStart)
    for (const s of subSeq) {
      const dur = (s.years * mahaYears) / totalYears
      const end = addYears(c, dur)
      out.push({ planet: s.planet, startDate: fmt(c), endDate: fmt(end), level, durationYears: dur })
      c = new Date(end)
    }
    return out
  }

  const antarPeriods = subPeriods(currentMaha.planet, new Date(currentMaha.startDate), currentMaha.durationYears, 'antar')
  const currentAntar = antarPeriods.find((a) => now >= new Date(a.startDate) && now < new Date(a.endDate)) ?? antarPeriods[0]

  let currentPratyantar: DashaPeriod | null = null
  if (currentAntar) {
    const pratPeriods = subPeriods(currentAntar.planet, new Date(currentAntar.startDate), currentAntar.durationYears, 'pratyantar')
    currentPratyantar = pratPeriods.find((p) => now >= new Date(p.startDate) && now < new Date(p.endDate)) ?? pratPeriods[0]
  }

  return {
    system,
    mahadashas,
    current: {
      maha: currentMaha,
      antar: currentAntar ?? null,
      pratyantar: currentPratyantar,
    },
  }
}
