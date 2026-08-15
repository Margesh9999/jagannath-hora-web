'use client'

import { useState } from 'react'
import { useApp, useLang } from '@/lib/providers'
import { CITIES } from '@/lib/cities'
import type { BirthData } from '@/lib/vedic'

const DEFAULT: BirthData = {
  date: '1990-07-15',
  time: '14:30',
  latitude: 28.6139,
  longitude: 77.209,
  timezoneOffset: 5.5,
  place: 'New Delhi',
  gender: 'male',
}

export default function BirthChartForm({ compact = false }: { compact?: boolean }) {
  const { setBirth, loading, birth } = useApp()
  const { t } = useLang()
  const [form, setForm] = useState<BirthData>(birth ?? DEFAULT)
  const [manual, setManual] = useState(false)

  const onCityChange = (name: string) => {
    const c = CITIES.find((x) => x.name === name)
    if (c) {
      setForm((f) => ({ ...f, place: c.name, latitude: c.latitude, longitude: c.longitude, timezoneOffset: c.tz }))
    }
    setManual(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setBirth(form)
  }

  return (
    <form onSubmit={submit} className="vedic-card p-5 space-y-4">
      <h2 className="text-xl font-bold text-vedic-dark flex items-center gap-2">
        <span>📍</span> {t('birthDate') === 'Birth Date' ? 'Birth Details' : 'Birth Details'}
      </h2>

      <div>
        <label className="form-label">{t('place')}</label>
        <select
          className="form-input"
          value={manual ? '' : form.place}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={manual}
        >
          <option value="">-- Select City --</option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setManual((m) => !m)}
          className="text-xs text-saffron-700 hover:underline mt-1"
        >
          {manual ? 'Choose from city list' : 'Enter coordinates manually'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">{t('birthDate')}</label>
          <input type="date" required className="form-input" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="form-label">{t('birthTime')}</label>
          <input type="time" required className="form-input" value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
      </div>

      {manual && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="form-label">{t('latitude')}</label>
            <input type="number" step="0.0001" required className="form-input" value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className="form-label">{t('longitude')}</label>
            <input type="number" step="0.0001" required className="form-input" value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className="form-label">{t('timezone')}</label>
            <input type="number" step="0.5" required className="form-input" value={form.timezoneOffset}
              onChange={(e) => setForm({ ...form, timezoneOffset: parseFloat(e.target.value) })} />
          </div>
        </div>
      )}

      <div>
        <label className="form-label">Gender</label>
        <div className="flex gap-2">
          {(['male', 'female', 'other'] as const).map((g) => (
            <button type="button" key={g}
              onClick={() => setForm({ ...form, gender: g })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                form.gender === g ? 'bg-saffron-600 text-white border-saffron-600' : 'bg-white border-saffron-200'
              }`}>
              {g[0].toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="vedic-btn vedic-btn-primary w-full disabled:opacity-60">
        {loading ? '⏳ Calculating…' : `🔮 ${t('calculate')}`}
      </button>
    </form>
  )
}
