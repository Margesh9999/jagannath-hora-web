import type { ComputedChart, PlanetPosition } from './types'
import { VIMSHOTTARI, NAKSHATRAS, type PlanetKey } from './constants'
import { normalize360 } from './astronomy'

// KP (Krishnamurti Paddhati) sub-lord: each nakshatra (13°20') is split into 9 unequal
// sub-divisions assigned to the Vimshottari lords in proportion to their dasha years.
export function kpSubLord(longitude: number): { nakshatraLord: PlanetKey; subLord: PlanetKey; subIndex: number } {
  const abs = normalize360(longitude)
  const nakSpan = 360 / 27
  const nakIdx = Math.floor(abs / nakSpan) % 27
  const within = abs - nakIdx * nakSpan
  const nakshatraLord = NAKSHATRAS[nakIdx].ruler

  const total = VIMSHOTTARI.reduce((s, d) => s + d.years, 0)
  let acc = 0
  let subIndex = 0
  for (let i = 0; i < VIMSHOTTARI.length; i++) {
    const share = (VIMSHOTTARI[i].years / total) * nakSpan
    if (within < acc + share) {
      subIndex = i
      break
    }
    acc += share
    subIndex = i
  }
  return { nakshatraLord, subLord: VIMSHOTTARI[subIndex].planet, subIndex }
}

export function computeKP(chart: ComputedChart): { planet: PlanetKey; nakshatraLord: PlanetKey; subLord: PlanetKey }[] {
  return chart.planets.map((p) => {
    const kp = kpSubLord(p.longitude)
    return { planet: p.key, nakshatraLord: kp.nakshatraLord, subLord: kp.subLord }
  })
}
