import type { ComputedChart } from './types'
import { PLANET_ORDER, type PlanetKey } from './constants'

export interface Charakaraka {
  name: string
  planet: PlanetKey
  degreeInSign: number
}

// Jaimini Chara Karakas: planets ordered by their degree in the sign.
export function computeJaimini(chart: ComputedChart): {
  atmakaraka: Charakaraka
  amatyakaraka: Charakaraka
  karakas: { role: string; planet: PlanetKey }[]
} {
  const candidates = chart.planets
  const sorted = [...candidates].sort((a, b) => b.degreeInSign - a.degreeInSign)
  const order: { role: string; planet: PlanetKey }[] = [
    { role: 'Atmakaraka', planet: sorted[0].key },
    { role: 'Amatyakaraka', planet: sorted[1].key },
    { role: 'Bhratrukaraka', planet: sorted[2].key },
    { role: 'Matrukaraka', planet: sorted[3].key },
    { role: 'Pitrukaraka', planet: sorted[4].key },
    { role: 'Putrakaraka', planet: sorted[5].key },
    { role: 'Gnatikaraka', planet: sorted[6].key },
    { role: 'Darakaraka', planet: sorted[7].key },
  ]
  return {
    atmakaraka: { name: 'Atmakaraka', planet: sorted[0].key, degreeInSign: sorted[0].degreeInSign },
    amatyakaraka: { name: 'Amatyakaraka', planet: sorted[1].key, degreeInSign: sorted[1].degreeInSign },
    karakas: order.map((o) => ({ role: o.role, planet: o.planet })),
  }
}
