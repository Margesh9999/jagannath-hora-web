import type { ComputedChart, YogaResult, PlanetPosition } from './types'
import { SIGNS } from './constants'

function rel(h1: number, h2: number): number {
  return ((h1 - h2) % 12 + 12) % 12
}
function isKendra(diff: number): boolean {
  return diff % 3 === 0 // 0,3,6,9 -> 1,4,7,10 from
}
function isTrikona(diff: number): boolean {
  return diff === 0 || diff === 4 || diff === 8
}
function isAngle(diff: number): boolean {
  return diff === 1 || diff === 4 || diff === 7 || diff === 10
}

export function detectYogas(chart: ComputedChart): YogaResult[] {
  const p = chart.byKey
  const results: YogaResult[] = []
  const add = (name: string, sanskrit: string, description: string, present: boolean) =>
    results.push({ name, sanskrit, description, present })

  const moonH = p.Moon.house
  const jupH = p.Jupiter.house

  add(
    'Gaja Kesari',
    'गजकेसरी',
    'Jupiter placed in a kendra (1st, 4th, 7th or 10th) from the Moon — brings fame, wealth and a noble mind.',
    isKendra(rel(jupH, moonH))
  )

  // Chandra-Mangal (Lakshmi) Yoga: Mars & Moon together or Mars in kendra/trikona from Moon
  const marsH = p.Mars.house
  add(
    'Chandra-Mangal (Lakshmi)',
    'चन्द्रमङ्गल',
    'Association of Moon and Mars — sharp intellect, wealth and entrepreneurial success.',
    marsH === moonH || isKendra(rel(marsH, moonH)) || isTrikona(rel(marsH, moonH))
  )

  // Budha-Aditya Yoga: Sun & Mercury together (within 10 deg)
  const sunLong = p.Sun.longitude
  const merLong = p.Mercury.longitude
  let d = Math.abs(sunLong - merLong)
  if (d > 180) d = 360 - d
  add(
    'Budha-Aditya',
    'बुधादित्य',
    'Sun and Mercury conjoined — brilliant intellect, oratory and royal favor.',
    d < 10
  )

  // Amala Yoga: benefic in 10th from lagna
  const lagnaH = 1
  const tenth = (lagnaH + 9) % 12 + 1
  const planetsIn10 = chart.planets.filter((x: PlanetPosition) => x.house === tenth)
  add(
    'Amala',
    'अमल',
    'A benefic planet occupies the 10th house from the lagna — spotless reputation and lasting fame.',
    planetsIn10.some((x: PlanetPosition) => !x.isNode && (x.key === 'Jupiter' || x.key === 'Venus' || x.key === 'Mercury' || x.key === 'Moon'))
  )

  // Rajya Yoga: lords of 9th & 10th mutually in kendra/trikona
  const lordOf = (sign: number) => SIGNS[sign].ruler
  const lagnaLord = lordOf(chart.ascendant.sign)
  const tenthLord = lordOf(SIGNS[(chart.ascendant.sign + 9) % 12].index)
  const hl = p[lagnaLord].house
  const h10l = p[tenthLord].house
  add(
    'Rajya',
    'राज्य',
    'Lords of trine and Kendra houses conjoin or mutually aspect — political power and authority.',
    isKendra(rel(hl, h10l)) || isTrikona(rel(hl, h10l)) || hl === h10l
  )

  // Dhana Yoga: lords of 2nd & 11th connected
  const secondLord = lordOf(SIGNS[(chart.ascendant.sign + 1) % 12].index)
  const eleventhLord = lordOf(SIGNS[(chart.ascendant.sign + 10) % 12].index)
  const h2l = p[secondLord].house
  const h11l = p[eleventhLord].house
  add(
    'Dhana',
    'धन',
    'Connection between the lords of the 2nd and 11th houses — accumulation of wealth.',
    h2l === h11l || isKendra(rel(h2l, h11l)) || isTrikona(rel(h2l, h11l))
  )

  // Kemadruma (non-yoga / affliction): Moon with no planets in 2nd or 12th and not aspected by benefic
  const adjacent = chart.planets.filter(
    (x: PlanetPosition) => x.key !== 'Moon' && (rel(x.house, moonH) === 1 || rel(x.house, moonH) === 11)
  )
  add(
    'Kemadruma',
    'खेमद्रुम',
    'Moon isolated with no planet in the 2nd or 12th houses — a classical affliction (absence of support).',
    adjacent.length === 0
  )

  // Kaal Sarp: all 7 non-node planets lie within the arc between Rahu and Ketu
  const rahu = p.Rahu.longitude
  const ketu = p.Ketu.longitude
  const span = (ketu - rahu + 360) % 360
  const inside = chart.planets
    .filter((x: PlanetPosition) => !x.isNode)
    .every((x: PlanetPosition) => {
      const dd = (x.longitude - rahu + 360) % 360
      return dd <= span
    })
  add(
    'Kaal Sarp',
    'कालसर्प',
    'All planets situated between Rahu and Ketu — intensive karmic pattern requiring remedies.',
    inside
  )

  // Neecha Bhanga (debilitation cancellation) — simplified: debilitated planet with its dispositor in kendra/trikona
  // Simplified: Sun debilitated in Libra(6) cancelled if Saturn (dispositor) in kendra/trikona from lagna
  const sunDeb = p.Sun.sign === 6
  const satH = p.Saturn.house
  add(
    'Neecha Bhanga',
    'नीचभङ्ग',
    'A debilitated planet is relieved by cancellation — reverses misfortune into strength.',
    sunDeb && (isKendra(rel(satH, lagnaH)) || isTrikona(rel(satH, lagnaH)))
  )

  return results
}
