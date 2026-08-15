'use client'

import { useState } from 'react'
import { useApp } from '@/lib/providers'
import type { Kundali, DashaResult } from '@/lib/vedic'

const COLORS: Record<string, string> = {
  Sun: '#FFB74D', Moon: '#90CAF9', Mars: '#E57373', Mercury: '#81C784',
  Jupiter: '#FFD54F', Venus: '#F48FB1', Saturn: '#64B5F6', Rahu: '#8D6E63', Ketu: '#BDBDBD',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })

export default function DashaTimeline({ kundali }: { kundali: Kundali }) {
  const [system, setSystem] = useState<'Vimshottari' | 'Ashtottari' | 'Yogini'>('Vimshottari')
  const d: DashaResult = kundali.dashas[system]
  const totalYears = d.mahadashas.reduce((s, m) => s + m.durationYears, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-vedic-dark mr-2">Dasha System</h3>
        {(['Vimshottari', 'Ashtottari', 'Yogini'] as const).map((s) => (
          <button key={s} onClick={() => setSystem(s)}
            className={`px-3 py-1.5 rounded-lg text-sm ${system === s ? 'bg-saffron-600 text-white' : 'bg-saffron-50 text-vedic-dark'}`}>{s}</button>
        ))}
      </div>

      {/* Current period card */}
      <div className="vedic-card p-5 bg-gradient-to-r from-saffron-50 to-lotus-50">
        <p className="text-sm text-vedic-gray">Current Mahadasha</p>
        <p className="text-3xl font-bold text-vedic-dark">{d.current.maha.planet}
          <span className="text-base font-normal text-vedic-gray ml-2">({fmtDate(d.current.maha.startDate)} – {fmtDate(d.current.maha.endDate)})</span></p>
        {d.current.antar && (
          <p className="mt-2 text-vedic-dark">Antardasha: <b>{d.current.antar.planet}</b> ({fmtDate(d.current.antar.startDate)} – {fmtDate(d.current.antar.endDate)})</p>
        )}
        {d.current.pratyantar && (
          <p className="text-sm text-vedic-gray">Pratyantar: {d.current.pratyantar.planet} ({fmtDate(d.current.pratyantar.startDate)} – {fmtDate(d.current.pratyantar.endDate)})</p>
        )}
      </div>

      {/* Timeline bar */}
      <div className="vedic-card p-4">
        <h3 className="font-bold text-vedic-dark mb-3">Mahadasha Timeline ({totalYears} yrs)</h3>
        <div className="flex w-full h-10 rounded-lg overflow-hidden border border-saffron-200">
          {d.mahadashas.map((m, i) => {
            const isCurrent = m.startDate === d.current.maha.startDate
            return (
              <div key={i} title={`${m.planet} (${fmtDate(m.startDate)})`}
                style={{ width: `${(m.durationYears / totalYears) * 100}%`, background: COLORS[m.planet] }}
                className={`flex items-center justify-center text-xs font-bold ${isCurrent ? 'ring-2 ring-offset-1 ring-vedic-dark' : ''} ${m.planet === 'Rahu' || m.planet === 'Ketu' ? 'text-white' : 'text-vedic-dark'}`}>
                {m.planet[0]}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-sm">
          {d.mahadashas.map((m, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[m.planet] }} />
              {m.planet} <span className="text-vedic-gray">({m.durationYears}y)</span>
            </span>
          ))}
        </div>
      </div>

      {/* Antardasha table */}
      <div className="vedic-card p-4">
        <h3 className="font-bold text-vedic-dark mb-3">Antardashas of {d.current.maha.planet} Mahadasha</h3>
        <AntarList kundali={kundali} system={system} mahaPlanet={d.current.maha.planet} mahaStart={d.current.maha.startDate} mahaYears={d.current.maha.durationYears} />
      </div>
    </div>
  )
}

function AntarList({ kundali, system, mahaPlanet, mahaStart, mahaYears }: { kundali: Kundali; system: 'Vimshottari' | 'Ashtottari' | 'Yogini'; mahaPlanet: any; mahaStart: string; mahaYears: number }) {
  // Build antar list using the same proportional rule
  const d = kundali.dashas[system]
  const total = system === 'Vimshottari' ? 120 : system === 'Ashtottari' ? 108 : 36
  const seqOrder = system === 'Vimshottari'
    ? ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
    : system === 'Ashtottari'
    ? ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu']
    : ['Moon', 'Sun', 'Jupiter', 'Mars', 'Mercury', 'Saturn', 'Venus', 'Rahu']
  const yearsMap: Record<string, number> = system === 'Vimshottari'
    ? { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 }
    : system === 'Ashtottari'
    ? { Sun: 6, Moon: 15, Mars: 8, Mercury: 17, Jupiter: 10, Venus: 20, Saturn: 21, Rahu: 11 }
    : { Moon: 1, Sun: 2, Jupiter: 3, Mars: 4, Mercury: 5, Saturn: 6, Venus: 7, Rahu: 8 }
  const startIdx = seqOrder.indexOf(mahaPlanet)
  const ordered = [...seqOrder.slice(startIdx), ...seqOrder.slice(0, startIdx)]
  const startMs = new Date().getTime()
  void startMs
  const base = new Date(mahaStart).getTime()
  const DAY = 365.25 * 86400000
  let cursor = base
  const rows = ordered.map((planet) => {
    const dur = (yearsMap[planet] * mahaYears) / total
    const end = cursor + dur * DAY
    const row = { planet, start: new Date(cursor), end: new Date(end), dur }
    cursor = end
    return row
  })
  const now = Date.now()
  return (
    <table className="w-full text-sm mt-2">
      <tbody>
        {rows.map((r, i) => {
          const active = now >= r.start.getTime() && now < r.end.getTime()
          return (
            <tr key={i} className={`border-b border-saffron-50 ${active ? 'bg-saffron-100' : ''}`}>
              <td className="py-1 font-medium">{r.planet}</td>
              <td>{fmtDate(r.start.toISOString().slice(0, 10))}</td>
              <td>{fmtDate(r.end.toISOString().slice(0, 10))}</td>
              <td className="text-vedic-gray">{r.dur.toFixed(2)} yrs</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
