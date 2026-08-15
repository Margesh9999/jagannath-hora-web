import { normalize360 } from './astronomy'
import type { ComputedChart, VargaChart } from './types'
import { PLANET_ORDER, SIGNS, type PlanetKey } from './constants'

export interface VargaDef {
  division: number
  name: string // D9
  label: string // Navamsha
  description: string
}

// The 16 Shodasha Varga charts
export const VARGAS: VargaDef[] = [
  { division: 1, name: 'D1', label: 'Rashi', description: 'Birth / Lagna chart' },
  { division: 2, name: 'D2', label: 'Hora', description: 'Wealth' },
  { division: 3, name: 'D3', label: 'Drekkana', description: 'Siblings' },
  { division: 4, name: 'D4', label: 'Chaturtamsa', description: 'Fortune / property' },
  { division: 7, name: 'D7', label: 'Saptamsa', description: 'Children' },
  { division: 9, name: 'D9', label: 'Navamsha', description: 'Spouse / marriage' },
  { division: 10, name: 'D10', label: 'Dashamsa', description: 'Career' },
  { division: 12, name: 'D12', label: 'Dwadamsa', description: 'Parents' },
  { division: 16, name: 'D16', label: 'Shodasamsa', description: 'Vehicles / comforts' },
  { division: 20, name: 'D20', label: 'Vimshamsa', description: 'Spiritual pursuits' },
  { division: 24, name: 'D24', label: 'Siddhamsa', description: 'Knowledge / education' },
  { division: 27, name: 'D27', label: 'Bhamsa', description: 'Strength / weakness' },
  { division: 30, name: 'D30', label: 'Trimshamsa', description: 'Troubles / evils' },
  { division: 40, name: 'D40', label: 'Khavedamsa', description: 'Auspicious / inauspicious effects' },
  { division: 45, name: 'D45', label: 'Akshavedamsa', description: 'General life' },
  { division: 60, name: 'D60', label: 'Shashtiamsa', description: 'Overall life results' },
]

// Compute the sign (0..11) occupied by a given sidereal longitude in a divisional chart.
export function vargaSign(longitude: number, division: number): number {
  const abs = normalize360(longitude)
  const rashi = Math.floor(abs / 30) % 12
  const pos = abs - rashi * 30 // 0..30

  if (division === 1) return rashi

  if (division === 2) {
    // Hora: odd signs -> 1st half Leo(4), 2nd half Cancer(3); even signs reversed.
    const isOdd = rashi % 2 === 0 // Aries(0), Gemini(2)... are "odd" signs
    const firstHalf = pos < 15
    if (isOdd) return firstHalf ? 4 : 3
    return firstHalf ? 3 : 4
  }

  if (division === 30) {
    // Trimshamsa (unequal divisions)
    const limits: [number, number][] = [
      // [upperBoundExclusive, signIndex]
      [5, 0], [10, 10], [18, 8], [25, 2], [30, 4],
    ]
    if (rashi % 2 === 0) {
      // odd signs
      for (const [b, s] of limits) if (pos < b) return s
      return 4
    } else {
      const evenLimits: [number, number][] = [
        [5, 1], [12, 5], [20, 9], [25, 11], [30, 7],
      ]
      for (const [b, s] of evenLimits) if (pos < b) return s
      return 7
    }
  }

  const part = Math.floor(pos / (30 / division)) // 0..division-1
  const nature = rashi % 3 // 0 movable, 1 fixed, 2 dual
  let base: number
  if (nature === 0) base = rashi
  else if (nature === 1) base = (rashi + 8) % 12
  else base = (rashi + 4) % 12
  const step = 12 % division === 0 ? 12 / division : 1
  return (base + part * step) % 12
}

export function computeVarga(
  chart: ComputedChart,
  division: number
): VargaChart {
  const def = VARGAS.find((v) => v.division === division) ?? VARGAS[0]
  const signs: (PlanetKey | 'Asc')[][] = Array.from({ length: 12 }, () => [])

  // Ascendant in varga
  const ascSign = vargaSign(chart.ascendant.longitude, division)
  signs[ascSign].push('Asc')

  const planetSigns: Record<string, number> = {}
  for (const p of chart.planets) {
    const s = vargaSign(p.longitude, division)
    signs[s].push(p.key)
    planetSigns[p.key] = s
  }

  return {
    name: def.name,
    label: def.label,
    signs,
    planetSigns,
  }
}

export function computeAllVargas(chart: ComputedChart): VargaChart[] {
  return VARGAS.map((v) => computeVarga(chart, v.division))
}

export { PLANET_ORDER, SIGNS }
