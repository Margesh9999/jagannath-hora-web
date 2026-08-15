'use client'

import { useApp } from '@/lib/providers'
import BirthChartForm from '@/components/BirthChartForm'
import ChartRenderer from '@/components/ChartRenderer'
import { computeChart, type BirthData } from '@/lib/vedic'

const GLYPH: Record<string, string> = { Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋' }

export default function TransitPage() {
  const { kundali, birth } = useApp()

  if (!kundali || !birth) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-vedic-dark">🔄 Transit (Gochara)</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1"><BirthChartForm /></div>
          <div className="lg:col-span-2 vedic-card p-12 text-center text-vedic-gray">
            Enter birth details to view current planetary transits relative to your birth chart.
          </div>
        </div>
      </div>
    )
  }

  const now = new Date()
  const transitBirth: BirthData = {
    ...birth,
    date: now.toISOString().slice(0, 10),
    time: now.toISOString().slice(11, 16),
    timezoneOffset: -now.getTimezoneOffset() / 60,
  }
  const transitChart = computeChart(transitBirth)
  const natalAsc = kundali.chart.ascendant.longitude

  const rows = transitChart.planets.map((tp) => {
    const rel = Math.floor(((tp.longitude - natalAsc + 360) % 360) / 30) + 1
    return { ...tp, natalHouse: rel }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-vedic-dark">🔄 Transit (Gochara)</h1>
      <p className="text-vedic-gray">Current planetary positions as of {transitBirth.date} {transitBirth.time} relative to your birth chart.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="vedic-card p-4">
          <h3 className="font-bold text-vedic-dark mb-2">Natal Chart (D1)</h3>
          <ChartRenderer chart={kundali.chart} />
        </div>
        <div className="vedic-card p-4">
          <h3 className="font-bold text-vedic-dark mb-2">Transit Chart (Now)</h3>
          <ChartRenderer chart={transitChart} />
        </div>
      </div>
      <div className="vedic-card p-4">
        <h3 className="font-bold text-vedic-dark mb-3">Transiting Planets in Natal Houses</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-vedic-gray border-b border-saffron-100"><th className="text-left py-1">Planet</th><th className="text-left">Transit Sign</th><th className="text-left">Natal House</th><th className="text-left">Retro</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-saffron-50">
                <td className="py-1 font-semibold">{GLYPH[r.key]} {r.name}</td>
                <td>{r.signName} {r.degreeInSign.toFixed(1)}°</td>
                <td className="font-medium">{r.natalHouse}</td>
                <td>{r.retrograde ? '℞' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
