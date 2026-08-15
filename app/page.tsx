'use client'

import { useApp, useLang } from '@/lib/providers'
import BirthChartForm from '@/components/BirthChartForm'
import ChartRenderer from '@/components/ChartRenderer'
import QuickActions from '@/components/QuickActions'
import PanchangWidget from '@/components/PanchangWidget'

const FEATURES = [
  { icon: '🪐', title: 'Complete Birth Charts', desc: 'Rashi chart, Navamsha, and all 16 Varga charts with planetary positions', color: 'bg-saffron-50 border-saffron-200' },
  { icon: '⏳', title: 'Multiple Dasha Systems', desc: 'Vimshottari, Ashtottari, Yogini dasha with antar & pratyantar', color: 'bg-lotus-50 border-lotus-200' },
  { icon: '💪', title: 'Planetary Strengths', desc: 'Shadbala, Kaalbala, Ashtakavarga strength analysis', color: 'bg-sacred-blue-50 border-sacred-blue-200' },
  { icon: '🧘', title: 'Yogas Detection', desc: 'Automatic detection of Gaja Kesari, Raj Yoga, Dhana Yoga & more', color: 'bg-turmeric-50 border-turmeric-200' },
  { icon: '📅', title: 'Daily Panchang', desc: 'Complete Panchang with Tithi, Nakshatra, Yoga, Karana, and Vaara', color: 'bg-mint-50 border-mint-200' },
  { icon: '💕', title: 'Match Making', desc: 'Ashta Koota matching with Mangal Dosha check and compatibility score', color: 'bg-lavender-50 border-lavender-200' },
]

export default function Home() {
  const { kundali, loading } = useApp()
  const { t } = useLang()

  return (
    <div className="space-y-8">
      <div className="text-center py-10 bg-gradient-to-r from-saffron-100 to-lotus-100 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-vedic-dark mb-3">🪐 Jagannath Hora Web</h1>
        <p className="text-lg text-vedic-gray max-w-2xl mx-auto px-4">
          Complete free Vedic astrology software with all features of Jagannath Hora desktop application.
          Generate birth charts, analyze dashas, check panchang, and much more.
        </p>
      </div>

      {!kundali ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BirthChartForm />
          </div>
          <div className="lg:col-span-2 flex items-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {FEATURES.map((f) => (
                <div key={f.title} className={`p-5 rounded-xl border-2 ${f.color}`}>
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <h3 className="font-bold text-vedic-dark mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-vedic-gray">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <BirthChartForm />
            <PanchangWidget kundali={kundali} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="vedic-card p-4">
              <h3 className="font-bold text-vedic-dark mb-2">Lagna (D1) Chart</h3>
              <ChartRenderer chart={kundali.chart} />
              <p className="text-sm text-vedic-gray mt-2">
                Ascendant: <b>{kundali.chart.ascendant.signName} {kundali.chart.ascendant.degreeInSign.toFixed(1)}°</b> · Ayanamsa (Lahiri): {kundali.chart.ayanamsa.toFixed(2)}°
              </p>
            </div>
            <QuickActions />
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center text-vedic-gray py-4">⏳ Calculating your chart…</div>
      )}
    </div>
  )
}
