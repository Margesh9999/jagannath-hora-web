import * as Astronomy from 'astronomy-engine'
import type { BirthData, PlanetPosition } from './types'
import type { ComputedChart } from './types'
import { PLANETS, PLANET_ORDER, NAKSHATRAS, SIGNS, type PlanetKey } from './constants'

const DEG = 180 / Math.PI
const RAD = Math.PI / 180

export function normalize360(x: number): number {
  let v = x % 360
  if (v < 0) v += 360
  return v
}

export function birthToUTC(birth: BirthData): Date {
  // birth.date/time are LOCAL at the place; timezoneOffset hours east of UTC.
  const [y, m, d] = birth.date.split('-').map(Number)
  const [hh, mm] = birth.time.split(':').map(Number)
  const localMs = Date.UTC(y, m - 1, d, hh, mm, 0)
  return new Date(localMs - birth.timezoneOffset * 3600 * 1000)
}

export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

// Lahiri (Chitrapaksha) ayanamsa in degrees for a given Julian Day.
export function lahiriAyanamsa(jd: number): number {
  const daysSinceJ2000 = jd - 2451545.0
  // ~50.25 arcseconds/year drift -> degrees per day
  const degPerDay = 50.25 / 3600 / 365.25
  return 23.85 + daysSinceJ2000 * degPerDay
}

function signInfo(siderealLong: number) {
  const sign = Math.floor(siderealLong / 30) % 12
  const degreeInSign = siderealLong - sign * 30
  return { sign, degreeInSign }
}

function nakshatraInfo(siderealLong: number) {
  const total = 360 / 27
  const abs = normalize360(siderealLong)
  const idx = Math.floor(abs / total) % 27
  const within = abs - idx * total
  const pada = Math.min(4, Math.floor(within / (total / 4)) + 1)
  return { nakshatra: idx, pada }
}

// Mean longitude of the Moon's ascending node (Rahu), tropical, degrees.
function meanNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0
  const omega =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441 -
    (T * T * T * T) / 60616000
  return normalize360(omega)
}

interface RawPlanet {
  key: PlanetKey
  tropicalLongitude: number
  latitude: number
  speed: number
}

function rawTropical(birth: BirthData): {
  jd: number
  ayanamsa: number
  ascTropical: number
  planets: RawPlanet[]
} {
  const utc = birthToUTC(birth)
  const t = Astronomy.MakeTime(utc)
  const jd = julianDay(utc)
  const ayanamsa = lahiriAyanamsa(jd)

  const bodyFor: Record<string, any> = {
    Sun: Astronomy.Body.Sun,
    Moon: Astronomy.Body.Moon,
    Mars: Astronomy.Body.Mars,
    Mercury: Astronomy.Body.Mercury,
    Jupiter: Astronomy.Body.Jupiter,
    Venus: Astronomy.Body.Venus,
    Saturn: Astronomy.Body.Saturn,
  }

  const planets: RawPlanet[] = []

  for (const key of PLANET_ORDER) {
    if (key === 'Rahu' || key === 'Ketu') continue
    const body = bodyFor[key]
    const vec = Astronomy.GeoVector(body, t, true)
    const ecl = Astronomy.Ecliptic(vec)
    const lon1 = normalize360(ecl.elon)

    // speed via 1-day delta
    const t2 = Astronomy.MakeTime(new Date(utc.getTime() + 86400000))
    const vec2 = Astronomy.GeoVector(body, t2, true)
    const ecl2 = Astronomy.Ecliptic(vec2)
    let speed = normalize360(ecl2.elon) - lon1
    if (speed > 180) speed -= 360
    if (speed < -180) speed += 360

    planets.push({ key, tropicalLongitude: lon1, latitude: ecl.elat, speed })
  }

  // Nodes (mean)
  const rahuTrop = meanNodeLongitude(jd)
  const t2jd = jd + 1
  const rahuTrop2 = meanNodeLongitude(t2jd)
  let rahuSpeed = rahuTrop2 - rahuTrop
  if (rahuSpeed > 180) rahuSpeed -= 360
  if (rahuSpeed < -180) rahuSpeed += 360

  planets.push({ key: 'Rahu', tropicalLongitude: rahuTrop, latitude: 0, speed: rahuSpeed })
  planets.push({ key: 'Ketu', tropicalLongitude: normalize360(rahuTrop + 180), latitude: 0, speed: -rahuSpeed })

  // Ascendant
  const gast = Astronomy.SiderealTime(t) // sidereal hours
  const ramc = gast * 15 // degrees
  const eps = 23.4367
  const phi = birth.latitude * RAD
  const ascTropical = normalize360(
    Math.atan2(
      Math.cos(ramc * RAD),
      -(Math.sin(ramc * RAD) * Math.cos(eps * RAD) + Math.tan(phi) * Math.sin(eps * RAD))
    ) * DEG
  )

  return { jd, ayanamsa, ascTropical, planets }
}

export function computeChart(birth: BirthData): ComputedChart {
  const { jd, ayanamsa, ascTropical, planets: raw } = rawTropical(birth)
  const ascSidereal = normalize360(ascTropical - ayanamsa)

  const ascSign = Math.floor(ascSidereal / 30) % 12
  const ascDeg = ascSidereal - ascSign * 30
  const ascNak = nakshatraInfo(ascSidereal)

  const planetPositions: PlanetPosition[] = raw.map((p) => {
    const sidereal = normalize360(p.tropicalLongitude - ayanamsa)
    const { sign, degreeInSign } = signInfo(sidereal)
    const nak = nakshatraInfo(sidereal)
    const info = PLANETS.find((x) => x.key === p.key)!
    const house = Math.floor(normalize360(sidereal - ascSidereal) / 30) + 1
    return {
      key: p.key,
      name: info.name,
      symbol: info.symbol,
      longitude: sidereal,
      tropicalLongitude: p.tropicalLongitude,
      latitude: p.latitude,
      speed: p.speed,
      retrograde: p.key === 'Rahu' || p.key === 'Ketu' ? true : p.speed < 0,
      sign,
      signName: SIGNS[sign].name,
      degreeInSign,
      nakshatra: nak.nakshatra,
      nakshatraName: NAKSHATRAS[nak.nakshatra].name,
      pada: nak.pada,
      house,
      isNode: info.isNode,
    }
  })

  const byKey = {} as Record<PlanetKey, PlanetPosition>
  for (const p of planetPositions) byKey[p.key] = p

  return {
    ayanamsa,
    birth,
    julianDay: jd,
    ascendant: {
      longitude: ascSidereal,
      sign: ascSign,
      signName: SIGNS[ascSign].name,
      degreeInSign: ascDeg,
      nakshatra: ascNak.nakshatra,
      nakshatraName: NAKSHATRAS[ascNak.nakshatra].name,
    },
    planets: planetPositions,
    byKey,
  }
}
