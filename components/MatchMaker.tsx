'use client'

import { useState } from 'react'
import { computeMatch, type BirthData, type MatchResult } from '@/lib/vedic'
import { CITIES } from '@/lib/cities'

function MiniForm({ label, value, onChange }: { label: string; value: BirthData; onChange: (b: BirthData) => void }) {
  const [manual, setManual] = useState(false)
  return (
    <div className="vedic-card p-4 space-y-3">
      <h4 className="font-bold text-vedic-dark">{label}</h4>
      <select className="form-input" value={manual ? '' : value.place}
        onChange={(e) => {
          const c = CITIES.find((x) => x.name === e.target.value)
          if (c) onChange({ ...value, place: c.name, latitude: c.latitude, longitude: c.longitude, timezoneOffset: c.tz })
          setManual(false)
        }} disabled={manual}>
        <option value="">-- Select City --</option>
        {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
      <button type="button" onClick={() => setManual((m) => !m)} className="text-xs text-saffron-700 hover:underline">{manual ? 'City list' : 'Manual coords'}</button>
      <div className="grid grid-cols-2 gap-2">
        <input type="date" className="form-input" value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} />
        <input type="time" className="form-input" value={value.time} onChange={(e) => onChange({ ...value, time: e.target.value })} />
      </div>
      {manual && (
        <div className="grid grid-cols-3 gap-2">
          <input type="number" step="0.0001" className="form-input" value={value.latitude} onChange={(e) => onChange({ ...value, latitude: parseFloat(e.target.value) })} placeholder="Lat" />
          <input type="number" step="0.0001" className="form-input" value={value.longitude} onChange={(e) => onChange({ ...value, longitude: parseFloat(e.target.value) })} placeholder="Lon" />
          <input type="number" step="0.5" className="form-input" value={value.timezoneOffset} onChange={(e) => onChange({ ...value, timezoneOffset: parseFloat(e.target.value) })} placeholder="TZ" />
        </div>
      )}
    </div>
  )
}

const GUNA_LABELS: Record<string, string> = {
  varna: 'Varna', vashya: 'Vashya', tara: 'Tara', yoni: 'Yoni',
  grahaMaitri: 'Graha Maitri', gana: 'Gana', bhakoot: 'Bhakoot', nadi: 'Nadi',
}
const GUNA_MAX: Record<string, number> = { varna: 1, vashya: 2, tara: 3, yoni: 4, grahaMaitri: 5, gana: 6, bhakoot: 7, nadi: 8 }

export default function MatchMaker() {
  const [boy, setBoy] = useState<BirthData>({ date: '1990-07-15', time: '14:30', latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5, place: 'New Delhi', gender: 'male' })
  const [girl, setGirl] = useState<BirthData>({ date: '1992-03-20', time: '10:00', latitude: 19.076, longitude: 72.8777, timezoneOffset: 5.5, place: 'Mumbai', gender: 'female' })
  const [result, setResult] = useState<MatchResult | null>(null)

  const compute = () => setResult(computeMatch(boy, girl))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniForm label="👦 Boy / Groom" value={boy} onChange={setBoy} />
        <MiniForm label="👧 Girl / Bride" value={girl} onChange={setGirl} />
      </div>
      <button onClick={compute} className="vedic-btn vedic-btn-primary">💕 Calculate Compatibility</button>

      {result && (
        <div className="space-y-6">
          <div className="vedic-card p-6 bg-gradient-to-r from-lotus-50 to-saffron-50 text-center">
            <div className="text-5xl font-bold text-vedic-dark">{result.percentage.toFixed(1)}%</div>
            <p className="text-vedic-gray mt-1">{result.totalGuna} / {result.maxGuna} Gunas</p>
            <p className="mt-3 font-semibold text-vedic-dark">{result.verdict}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="vedic-card p-4">
              <h4 className="font-bold text-vedic-dark mb-2">Boy</h4>
              <p>Rashi: {result.rashiBoy}</p>
              <p>Nakshatra: {result.nakshatraBoy}</p>
              <p className={result.mangalDoshaBoy ? 'text-lotus-600 font-semibold' : 'text-mint-600'}>
                {result.mangalDoshaBoy ? 'Mangal Dosha ✓' : 'No Mangal Dosha'}
              </p>
            </div>
            <div className="vedic-card p-4">
              <h4 className="font-bold text-vedic-dark mb-2">Girl</h4>
              <p>Rashi: {result.rashiGirl}</p>
              <p>Nakshatra: {result.nakshatraGirl}</p>
              <p className={result.mangalDoshaGirl ? 'text-lotus-600 font-semibold' : 'text-mint-600'}>
                {result.mangalDoshaGirl ? 'Mangal Dosha ✓' : 'No Mangal Dosha'}
              </p>
            </div>
            <div className="vedic-card p-4 flex items-center justify-center">
              <div className="text-4xl">💕</div>
            </div>
          </div>

          <div className="vedic-card p-4">
            <h4 className="font-bold text-vedic-dark mb-3">Ashta Koota Analysis</h4>
            <div className="space-y-2">
              {Object.keys(GUNA_LABELS).map((key) => {
                const val = (result.guna as any)[key]
                const max = GUNA_MAX[key]
                const pct = (val / max) * 100
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 text-sm font-medium">{GUNA_LABELS[key]}</span>
                    <div className="flex-1 h-4 bg-saffron-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-lotus-400 to-saffron-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-sm text-vedic-gray">{val}/{max}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
