'use client'

import { useState } from 'react'

interface DashaTimelineProps {
  chartData?: any
}

export default function DashaTimeline({ chartData }: DashaTimelineProps) {
  const [selectedDasha, setSelectedDasha] = useState('vimshottari')

  const vimshottariDashas = [
    { planet: 'Sun', period: 6, color: 'bg-sandalwood-100 border-sandalwood-300' },
    { planet: 'Moon', period: 10, color: 'bg-sacred-blue-100 border-sacred-blue-300' },
    { planet: 'Mars', period: 7, color: 'bg-lotus-100 border-lotus-300' },
    { planet: 'Rahu', period: 18, color: 'bg-sandalwood-200 border-sandalwood-400' },
    { planet: 'Jupiter', period: 16, color: 'bg-turmeric-100 border-turmeric-300' },
    { planet: 'Saturn', period: 19, color: 'bg-sacred-blue-200 border-sacred-blue-400' },
    { planet: 'Mercury', period: 17, color: 'bg-mint-100 border-mint-300' },
    { planet: 'Ketu', period: 7, color: 'bg-vedic-gray/20 border-vedic-gray/40' },
    { planet: 'Venus', period: 20, color: 'bg-lotus-200 border-lotus-400' },
  ]

  const dashaSystems = [
    { id: 'vimshottari', name: 'Vimshottari', period: '120 years', desc: 'Most popular dasha system' },
    { id: 'ashtottari', name: 'Ashtottari', period: '108 years', desc: 'Used for specific nakshatras' },
    { id: 'yogini', name: 'Yogini', period: '36 years', desc: 'Based on Yogini deities' },
    { id: 'kalachakra', name: 'Kalachakra', period: 'Variable', desc: 'Based on nakshatra position' },
    { id: 'charadasha', name: 'Jaimini Chara', period: 'Variable', desc: 'Jaimini system' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-vedic-dark flex items-center">
          <span className="mr-2">⏳</span> Dasha Systems
        </h2>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {dashaSystems.map((system) => (
            <button
              key={system.id}
              onClick={() => setSelectedDasha(system.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDasha === system.id
                  ? 'bg-saffron-600 text-white'
                  : 'bg-saffron-50 text-vedic-dark hover:bg-saffron-100'
              }`}
            >
              {system.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current System Info */}
      {dashaSystems.find(s => s.id === selectedDasha) && (
        <div className="mb-6 p-4 bg-saffron-50 rounded-lg">
          <h3 className="font-bold text-vedic-dark">
            {dashaSystems.find(s => s.id === selectedDasha)?.name} Dasha
          </h3>
          <p className="text-sm text-vedic-gray">
            {dashaSystems.find(s => s.id === selectedDasha)?.desc} • Total Period: {dashaSystems.find(s => s.id === selectedDasha)?.period}
          </p>
        </div>
      )}

      {/* Vimshottari Dasha Timeline */}
      {selectedDasha === 'vimshottari' && (
        <div>
          <h3 className="text-lg font-semibold text-vedic-dark mb-4">Mahadasha Timeline</h3>
          <div className="space-y-3">
            {vimshottariDashas.map((dasha, i) => (
              <div
                key={i}
                className={`p-4 border-2 ${dasha.color} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-vedic-dark text-lg">{dasha.planet} Mahadasha</div>
                    <div className="text-sm text-vedic-gray">Duration: {dasha.period} years</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-saffron-700">Current</div>
                    <div className="text-xs text-vedic-gray">2024 - 2040</div>
                  </div>
                </div>

                {/* Sub-periods (Antardashas) */}
                <div className="mt-3 grid grid-cols-9 gap-1">
                  {vimshottariDashas.map((sub, j) => (
                    <div
                      key={j}
                      className="h-2 bg-white/60 rounded"
                      style={{ width: `${(sub.period / 20) * 100}%` }}
                      title={`${sub.planet}: ${sub.period}y`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Dasha Systems - Placeholder */}
      {selectedDasha !== 'vimshottari' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-vedic-gray">
            {dashaSystems.find(s => s.id === selectedDasha)?.name} Dasha calculation interface
          </p>
          <p className="text-sm text-vedic-gray mt-2">
            Full implementation with planetary periods and sub-periods
          </p>
        </div>
      )}

      {/* Current Dasha Details */}
      <div className="mt-8 p-6 bg-gradient-to-r from-saffron-100 to-lotus-100 rounded-lg">
        <h3 className="text-lg font-bold text-vedic-dark mb-4">Current Period Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-vedic-gray">Mahadasha</div>
            <div className="text-xl font-bold text-saffron-700">Jupiter</div>
            <div className="text-xs text-vedic-gray mt-1">16 years • 2024-2040</div>
          </div>
          <div>
            <div className="text-sm text-vedic-gray">Antardasha</div>
            <div className="text-xl font-bold text-lotus-700">Saturn</div>
            <div className="text-xs text-vedic-gray mt-1">3 years 4 months</div>
          </div>
          <div>
            <div className="text-sm text-vedic-gray">Pratyantardasha</div>
            <div className="text-xl font-bold text-sacred-blue-700">Mercury</div>
            <div className="text-xs text-vedic-gray mt-1">1 year 2 months</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/50 rounded">
          <div className="text-sm font-medium text-vedic-dark mb-1">Key Predictions:</div>
          <ul className="text-sm text-vedic-gray space-y-1">
            <li>• Jupiter-Saturn-Mercury period brings mixed results</li>
            <li>• Career growth through structured efforts</li>
            <li>• Health attention needed for digestion</li>
            <li>• Favorable time for learning and education</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
