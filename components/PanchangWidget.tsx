'use client'

import { useApp, useLang } from '@/lib/providers'
import type { Kundali } from '@/lib/vedic'

export default function PanchangWidget({ kundali, standalone = false }: { kundali?: Kundali; standalone?: boolean }) {
  const { kundali: k } = useApp()
  const data = kundali ?? k
  const { t } = useLang()
  if (!data) return null
  const p = data.panchang

  const items = [
    { label: 'Tithi', value: `${p.tithi.name} (${p.tithi.paksha})` },
    { label: 'Nakshatra', value: `${p.nakshatra.name} (${p.nakshatra.ruler})` },
    { label: 'Yoga', value: p.yoga.name },
    { label: 'Karana', value: p.karana.name },
    { label: 'Vaara', value: p.vaara.name },
    { label: 'Sunrise', value: p.sunrise },
    { label: 'Sunset', value: p.sunset },
    { label: 'Sun Rashi', value: p.sunRashi },
    { label: 'Moon Rashi', value: p.moonRashi },
  ]

  return (
    <div className={standalone ? '' : 'vedic-card p-5'}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📅</span>
        <div>
          <h3 className="font-bold text-vedic-dark">{t('panchang')}</h3>
          <p className="text-xs text-vedic-gray">{p.date} · {p.place}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.label} className="bg-saffron-50 rounded-lg p-3">
            <div className="text-xs text-vedic-gray">{it.label}</div>
            <div className="font-semibold text-vedic-dark text-sm">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
