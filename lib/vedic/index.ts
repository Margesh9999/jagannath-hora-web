import type { BirthData, ChartData, DashaResult, PanchangData, YogaResult, ShadbalaResult, VargaChart, MatchResult, ComputedChart } from './types'
import { computeChart } from './astronomy'
import { computeVarga, computeAllVargas, VARGAS, vargaSign } from './chart'
import { buildDasha } from './dasha'
import { computePanchang } from './panchang'
import { detectYogas } from './yogas'
import { computeShadbala } from './shadbala'
import { computeMatch } from './matching'
import { computeJaimini } from './jaimini'
import { computeKP } from './kp'

export * from './types'
export * from './constants'
export { computeChart, birthToUTC, julianDay, lahiriAyanamsa, normalize360 } from './astronomy'
export { computeVarga, computeAllVargas, VARGAS, vargaSign } from './chart'
export { buildDasha } from './dasha'
export { computePanchang } from './panchang'
export { detectYogas } from './yogas'
export { computeShadbala } from './shadbala'
export { computeMatch } from './matching'
export { computeJaimini } from './jaimini'
export { computeKP } from './kp'

export interface Kundali {
  chart: ComputedChart
  vargas: VargaChart[]
  dashas: {
    Vimshottari: DashaResult
    Ashtottari: DashaResult
    Yogini: DashaResult
  }
  panchang: PanchangData
  yogas: YogaResult[]
  shadbala: ShadbalaResult[]
  jaimini: ReturnType<typeof computeJaimini>
  kp: ReturnType<typeof computeKP>
}

export function generateKundali(birth: BirthData): Kundali {
  const chart = computeChart(birth)
  return {
    chart,
    vargas: computeAllVargas(chart),
    dashas: {
      Vimshottari: buildDasha(birth, chart, 'Vimshottari'),
      Ashtottari: buildDasha(birth, chart, 'Ashtottari'),
      Yogini: buildDasha(birth, chart, 'Yogini'),
    },
    panchang: computePanchang(birth),
    yogas: detectYogas(chart),
    shadbala: computeShadbala(chart),
    jaimini: computeJaimini(chart),
    kp: computeKP(chart),
  }
}
