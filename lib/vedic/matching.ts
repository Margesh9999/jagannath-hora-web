import type { BirthData, MatchResult } from './types'
import { NAKSHATRAS, SIGNS, type PlanetKey } from './constants'
import { computeChart } from './astronomy'

// Graha friendship (simplified): friendship between rashi lords
const FRIENDS: Record<PlanetKey, PlanetKey[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury', 'Jupiter'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Moon', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Venus', 'Mercury'],
  Rahu: ['Saturn', 'Venus'],
  Ketu: ['Saturn', 'Venus'],
}

function friendship(a: PlanetKey, b: PlanetKey): 'friend' | 'neutral' | 'enemy' {
  if (FRIENDS[a]?.includes(b)) return FRIENDS[b]?.includes(a) ? 'friend' : 'neutral'
  if (FRIENDS[b]?.includes(a)) return 'neutral'
  return 'enemy'
}

const GANA = ['Deva', 'Manushya', 'Rakshasa']
function ganaOf(nak: number): number {
  // each nakshatra group of 9 -> Deva, Manushya, Rakshasa repeating
  return Math.floor(nak / 9) % 3
}
function yoniOf(nak: number): number {
  const yonis = [0, 1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 10, 11, 12, 13, 14, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  return yonis[nak]
}
function nadiOf(nak: number, pada: number): number {
  const global = nak * 4 + (pada - 1)
  return global % 3 // 0 Adi, 1 Madhya, 2 Antya
}

export function computeMatch(boy: BirthData, girl: BirthData): MatchResult {
  const cb = computeChart(boy)
  const cg = computeChart(girl)

  const bNak = cb.byKey.Moon.nakshatra
  const gNak = cg.byKey.Moon.nakshatra
  const bPada = cb.byKey.Moon.pada
  const gPada = cg.byKey.Moon.pada
  const bRashi = cb.byKey.Moon.sign
  const gRashi = cg.byKey.Moon.sign

  // Varna
  const varnaB = bNak % 4
  const varnaG = gNak % 4
  const varna = varnaB >= varnaG ? 1 : 0.5

  // Vashya (simplified: same yoni group = 2)
  const vashya = yoniOf(bNak) === yoniOf(gNak) ? 2 : 0

  // Tara
  const tara = (((gNak - bNak) % 27) + 27) % 27 + 1
  const taraPoints = [0, 1.5, 3, 0, 3, 0, 3, 0, 3, 3][tara - 1] ?? 0

  // Yoni
  const yoni = yoniOf(bNak) === yoniOf(gNak) ? 4 : 2

  // Graha Maitri
  const lordB = SIGNS[bRashi].ruler as PlanetKey
  const lordG = SIGNS[gRashi].ruler as PlanetKey
  const rel = friendship(lordB, lordG)
  const grahaMaitri = rel === 'friend' ? 5 : rel === 'neutral' ? 3 : 0

  // Gana
  const ganaB = ganaOf(bNak)
  const ganaG = ganaOf(gNak)
  let gana = 0
  if (ganaB === ganaG) gana = 6
  else if (ganaB === 2 || ganaG === 2) gana = 1
  else gana = 5

  // Bhakoot
  const d = ((gRashi - bRashi) % 12 + 12) % 12
  const bhakoot = [0, 1, 5, 7, 11].includes(d) ? 0 : 7

  // Nadi
  const nadi = nadiOf(bNak, bPada) === nadiOf(gNak, gPada) ? 0 : 8

  const guna = {
    varna,
    vashya,
    tara: taraPoints,
    yoni,
    grahaMaitri,
    gana,
    bhakoot,
    nadi,
  }
  const totalGuna = Object.values(guna).reduce((s, x) => s + x, 0)
  const maxGuna = 36
  const percentage = (totalGuna / maxGuna) * 100

  // Mangal Dosha
  const mangalB = [1, 4, 7, 8, 12].includes(cb.byKey.Mars.house)
  const mangalG = [1, 4, 7, 8, 12].includes(cg.byKey.Mars.house)

  let verdict = 'Average match.'
  if (percentage >= 80) verdict = 'Excellent match — strong compatibility.'
  else if (percentage >= 60) verdict = 'Good match — generally compatible.'
  else if (percentage >= 40) verdict = 'Average match — manageable differences.'
  else verdict = 'Challenging match — careful consideration advised.'
  if (guna.bhakoot === 0) verdict += ' Bhakoot dosha present.'
  if (guna.nadi === 0) verdict += ' Nadi dosha present.'

  return {
    boy,
    girl,
    guna,
    totalGuna,
    maxGuna,
    percentage,
    mangalDoshaBoy: mangalB,
    mangalDoshaGirl: mangalG,
    verdict,
    nakshatraBoy: NAKSHATRAS[bNak].name,
    nakshatraGirl: NAKSHATRAS[gNak].name,
    rashiBoy: SIGNS[bRashi].name,
    rashiGirl: SIGNS[gRashi].name,
  }
}
