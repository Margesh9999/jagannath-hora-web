'use client'

import { useState } from 'react'
import ChartRenderer from './ChartRenderer'
import { useApp, useLang } from '@/lib/providers'
import { VARGAS, SIGNS, NAKSHATRAS, PLANETS } from '@/lib/vedic'
import type { Kundali } from '@/lib/vedic'

const PLANET_GLYPH: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
}

function degFmt(d: number) {
  const s = Math.floor(d)
  const m = Math.floor((d - s) * 60)
  return `${s}°${m.toString().padStart(2, '0')}'`
}

export default function ChartDisplay({ kundali }: { kundali: Kundali }) {
  const { t } = useLang()
  const [varga, setVarga] = useState(0)
  const k = kundali
  const v = k.vargas[varga]

  return (
    <div className="space-y-6">
      {/* Chart + table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="vedic-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-vedic-dark">{varga === 0 ? 'Rashi (D1) Chart' : `${v.name} — ${v.label}`}</h3>
            <button onClick={() => window.print()} className="no-print text-sm px-3 py-1 bg-saffron-600 text-white rounded-lg">🖨️ PDF</button>
          </div>
          <ChartRenderer chart={k.chart} varga={varga === 0 ? null : v} />
          {varga !== 0 && (
            <p className="text-xs text-vedic-gray text-center mt-2">{VARGAS[varga].description}</p>
          )}
        </div>

        <div className="vedic-card p-4">
          <h3 className="font-bold text-vedic-dark mb-2">{t('planetary')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-vedic-gray border-b border-saffron-100">
                  <th className="text-left py-1">Planet</th>
                  <th className="text-left">Rashi</th>
                  <th className="text-left">Degree</th>
                  <th className="text-left">Nakshatra</th>
                  <th className="text-left">House</th>
                  <th className="text-left">KP Sub</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-saffron-50">
                  <td className="py-1 font-semibold">Lagna</td>
                  <td>{k.chart.ascendant.signName}</td>
                  <td>{degFmt(k.chart.ascendant.degreeInSign)}</td>
                  <td>{k.chart.ascendant.nakshatraName}</td>
                  <td>1</td>
                  <td>—</td>
                </tr>
                {k.chart.planets.map((p: any) => {
                  const kp = k.kp.find((x) => x.planet === p.key)
                  return (
                    <tr key={p.key} className="border-b border-saffron-50">
                      <td className="py-1 font-semibold">{PLANET_GLYPH[p.key]} {p.name}</td>
                      <td>{p.signName}</td>
                      <td>{degFmt(p.degreeInSign)}{p.retrograde ? ' ℞' : ''}</td>
                      <td>{p.nakshatraName} {p.pada}</td>
                      <td>{p.house}</td>
                      <td>{kp?.subLord}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Varga selector */}
      <div className="vedic-card p-4">
        <h3 className="font-bold text-vedic-dark mb-3">{t('varga')} (Shodasha Varga)</h3>
        <div className="flex flex-wrap gap-2">
          {VARGAS.map((vg, i) => (
            <button key={vg.division}
              onClick={() => setVarga(i)}
              className={`px-3 py-1.5 rounded-lg text-sm ${varga === i ? 'bg-saffron-600 text-white' : 'bg-saffron-50 text-vedic-dark hover:bg-saffron-100'}`}>
              {vg.name} {vg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Yogas */}
      <div className="vedic-card p-4">
        <h3 className="font-bold text-vedic-dark mb-3">{t('yogas')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {k.yogas.map((y) => (
            <div key={y.name} className={`p-3 rounded-lg border ${y.present ? 'bg-mint-50 border-mint-200' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{y.name}</span>
                <span className={y.present ? 'text-mint-500' : 'text-slate-400'}>{y.present ? '✓' : '—'}</span>
              </div>
              <p className="text-xs text-vedic-gray mt-1">{y.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shadbala */}
      <div className="vedic-card p-4">
        <h3 className="font-bold text-vedic-dark mb-3">{t('shadbala')} <span className="text-xs font-normal text-vedic-gray">(approximate)</span></h3>
        <div className="space-y-2">
          {k.shadbala.map((s) => {
            const max = 120
            const pct = Math.min(100, (s.total / max) * 100)
            return (
              <div key={s.planet} className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium">{PLANET_GLYPH[s.planet]} {s.name}</span>
                <div className="flex-1 h-4 bg-saffron-50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-saffron-400 to-lotus-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-16 text-right text-sm text-vedic-gray">{s.total.toFixed(0)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Jaimini + KP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="vedic-card p-4">
          <h3 className="font-bold text-vedic-dark mb-3">📐 Jaimini Charakarakas</h3>
          <ul className="space-y-1 text-sm">
            {k.jaimini.karakas.map((kar) => (
              <li key={kar.role} className="flex justify-between border-b border-saffron-50 py-1">
                <span className="text-vedic-gray">{kar.role}</span>
                <span className="font-medium">{PLANET_GLYPH[kar.planet]} {kar.planet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="vedic-card p-4">
          <h3 className="font-bold text-vedic-dark mb-3">🔮 KP Sub-Lords</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-vedic-gray border-b border-saffron-100"><th className="text-left py-1">Planet</th><th className="text-left">Nakshatra Lord</th><th className="text-left">Sub Lord</th></tr></thead>
            <tbody>
              {k.kp.map((x) => (
                <tr key={x.planet} className="border-b border-saffron-50">
                  <td className="py-1">{PLANET_GLYPH[x.planet]} {x.planet}</td>
                  <td>{x.nakshatraLord}</td>
                  <td>{x.subLord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
