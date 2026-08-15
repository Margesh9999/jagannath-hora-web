import type { ComputedChart, ShadbalaResult } from './types'
import { PLANETS, type PlanetKey } from './constants'

// Simplified Shadbala (six-fold strength) — values are approximate, presented as
// a relative strength score (higher = stronger). Useful for quick comparison.
const DIG_HOUSE: Record<PlanetKey, number> = {
  Sun: 10,
  Moon: 4,
  Mars: 4,
  Mercury: 1,
  Jupiter: 1,
  Venus: 4,
  Saturn: 7,
  Rahu: 7,
  Ketu: 7,
}

const NAISARGIKA: Record<PlanetKey, number> = {
  Sun: 5, Moon: 4, Venus: 3.5, Jupiter: 3, Mercury: 2.5, Mars: 2, Saturn: 1.5, Rahu: 1, Ketu: 1,
}

function angDist(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

export function computeShadbala(chart: ComputedChart): ShadbalaResult[] {
  const results: ShadbalaResult[] = []
  for (const info of PLANETS) {
    const p = chart.byKey[info.key]
    const details: { name: string; value: number }[] = []

    // Uccha Bala (exaltation strength), max 60
    const exalt = info.exaltation.sign * 30 + info.exaltation.deg
    const uccha = Math.min(60, 60 * (1 - angDist(p.longitude, exalt) / 180))
    details.push({ name: 'Uccha (exaltation)', value: +uccha.toFixed(1) })

    // Saptavarga / Sthana (sign placement), max 45
    let sthana = 15
    if (p.sign === info.mooltrikona) sthana = 45
    else if (info.ownSigns.includes(p.sign)) sthana = 30
    else if (p.sign === info.exaltation.sign) sthana = 45
    details.push({ name: 'Sthana (sign)', value: sthana })

    // Dig Bala (directional), max 10
    const dig = p.house === DIG_HOUSE[info.key] ? 10 : p.house === (DIG_HOUSE[info.key] + 6 - 1) % 12 + 1 ? 5 : 0
    details.push({ name: 'Dig (directional)', value: dig })

    // Kala Bala (time), max 10 — approximated
    const kala = 6
    details.push({ name: 'Kala (time)', value: kala })

    // Chesta Bala (retrograde/effort), max 10
    const chesta = p.retrograde ? 10 : 5
    details.push({ name: 'Chesta (retro)', value: chesta })

    // Naisargika (natural), max 5
    details.push({ name: 'Naisargika (natural)', value: NAISARGIKA[info.key] })

    // Drik Bala (aspects), max 5 — approximated by association
    const dik = 2.5
    details.push({ name: 'Drik (aspect)', value: dik })

    const total = details.reduce((s, d) => s + d.value, 0)
    results.push({
      planet: info.key,
      name: info.name,
      total: +total.toFixed(1),
      isExalted: p.sign === info.exaltation.sign,
      details,
    })
  }
  return results.sort((a, b) => b.total - a.total)
}
