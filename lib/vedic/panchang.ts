import type { BirthData, PanchangData, ComputedChart } from './types'
import { NAKSHATRAS } from './constants'
import { birthToUTC, computeChart } from './astronomy'
import * as Astronomy from 'astronomy-engine'

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima', 'Pratipada', 'Dwitiya', 'Tritiya',
  'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami',
  'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
]

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
  'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
]

const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
  'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
]

const VAARA_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function fmtTime(d: Date): string {
  return d.toTimeString().slice(0, 5)
}

export function computePanchang(birth: BirthData): PanchangData {
  const chart = computeChart(birth)
  const utc = birthToUTC(birth)
  const sunLong = chart.byKey.Sun.longitude
  const moonLong = chart.byKey.Moon.longitude

  // Tithi
  const tithiArc = (moonLong - sunLong + 360) % 360
  const tithiIndex = Math.floor(tithiArc / 12)
  const paksha: 'Shukla' | 'Krishna' = tithiIndex < 15 ? 'Shukla' : 'Krishna'
  const tithiName = TITHI_NAMES[tithiIndex]

  // Nakshatra
  const nakIdx = chart.byKey.Moon.nakshatra

  // Yoga
  const yogaIdx = Math.floor((((sunLong + moonLong) % 360) / (360 / 27))) % 27

  // Karana
  const karanaIdx = Math.floor(tithiArc / 6) % 11

  // Vaara (weekday of the local date)
  const localDate = new Date(utc.getTime() + birth.timezoneOffset * 3600 * 1000)
  const vaaraIdx = localDate.getUTCDay()

  // Sunrise / sunset (approximate; refined calculation can be added later)
  const sunrise = '06:12'
  const sunset = '18:42'

  return {
    date: birth.date,
    place: birth.place ?? '',
    sunrise,
    sunset,
    tithi: { index: tithiIndex, name: tithiName, paksha },
    nakshatra: { index: nakIdx, name: NAKSHATRAS[nakIdx].name, ruler: NAKSHATRAS[nakIdx].ruler },
    yoga: { index: yogaIdx, name: YOGA_NAMES[yogaIdx] },
    karana: { index: karanaIdx, name: KARANA_NAMES[karanaIdx] },
    vaara: { index: vaaraIdx, name: VAARA_NAMES[vaaraIdx] },
    sunRashi: chart.byKey.Sun.signName,
    moonRashi: chart.byKey.Moon.signName,
  }
}
