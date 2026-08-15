'use client'

import { useState } from 'react'

interface ChartDisplayProps {
  data: any
}

export default function ChartDisplay({ data }: ChartDisplayProps) {
  const [view, setView] = useState<'north' | 'south' | 'list'>('north')

  const planetColors: Record<string, string> = {
    Sun: 'text-sandalwood-500',
    Moon: 'text-sacred-blue-400',
    Mars: 'text-lotus-400',
    Mercury: 'text-mint-400',
    Jupiter: 'text-turmeric-500',
    Venus: 'text-lotus-400',
    Saturn: 'text-sacred-blue-500',
    Rahu: 'text-sandalwood-700',
    Ketu: 'text-vedic-gray',
  }

  // North Indian Chart Layout (Diamond)
  const renderNorthIndianChart = () => {
    const houses = Array(12).fill(null)
    data.planetaryPositions.forEach((p: any) => {
      const houseNum = getHouseNumber(p.sign, data.lagna)
      if (houses[houseNum - 1]) {
        houses[houseNum - 1] += `, ${p.symbol}`
      } else {
        houses[houseNum - 1] = p.symbol
      }
    })

    return (
      <div className="chart-style-north p-4">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Outer square */}
          <rect x="20" y="20" width="360" height="360" fill="none" stroke="#FFA726" strokeWidth="2" />

          {/* Diagonal lines forming diamond */}
          <line x1="20" y1="20" x2="380" y2="380" stroke="#FFA726" strokeWidth="2" />
          <line x1="380" y1="20" x2="20" y2="380" stroke="#FFA726" strokeWidth="2" />

          {/* Horizontal and vertical lines */}
          <line x1="20" y1="200" x2="380" y2="200" stroke="#FFA726" strokeWidth="2" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="#FFA726" strokeWidth="2" />

          {/* House numbers */}
          {[
            { x: 100, y: 100, num: 1 },
            { x: 300, y: 100, num: 2 },
            { x: 300, y: 200, num: 3 },
            { x: 300, y: 300, num: 4 },
            { x: 200, y: 300, num: 5 },
            { x: 100, y: 300, num: 6 },
            { x: 100, y: 200, num: 7 },
            { x: 100, y: 100, num: 8 },
          ].map((h, i) => (
            <g key={i}>
              <text x={h.x} y={h.y} fill="#7E57C2" fontSize="14" fontWeight="bold" textAnchor="middle">{h.num}</text>
            </g>
          ))}

          {/* Planets */}
          {data.planetaryPositions.map((p: any, i: number) => {
            const houseNum = getHouseNumber(p.sign, data.lagna)
            const position = getHousePosition(houseNum)
            return (
              <text
                key={i}
                x={position.x}
                y={position.y}
                fill={getPlanetColor(p.planet)}
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                className="hover:scale-150 transition-transform"
              >
                {p.symbol}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  // South Indian Chart Layout (Grid)
  const renderSouthIndianChart = () => {
    const houses: Record<number, string[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
    }

    data.planetaryPositions.forEach((p: any) => {
      const houseNum = getHouseNumber(p.sign, data.lagna)
      houses[houseNum].push(p.symbol)
    })

    return (
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto aspect-square">
        {[
          { num: 12, sign: 'Pisces' },
          { num: 1, sign: 'Aries' },
          { num: 2, sign: 'Taurus' },
          { num: 3, sign: 'Gemini' },
          { num: 11, sign: 'Aquarius' },
          { num: 4, sign: 'Cancer' },
          { num: 5, sign: 'Leo' },
          { num: 6, sign: 'Virgo' },
          { num: 10, sign: 'Capricorn' },
          { num: 9, sign: 'Sagittarius' },
          { num: 8, sign: 'Scorpio' },
          { num: 7, sign: 'Libra' },
        ].map((house, i) => (
          <div
            key={i}
            className="aspect-square border-2 border-saffron-200 bg-white flex flex-col items-center justify-center p-2"
          >
            <div className="text-xs text-vedic-gray mb-1">House {house.num}</div>
            <div className="text-xl font-bold">
              {houses[house.num].join(' ') || '-'}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // List view
  const renderListView = () => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-vedic-dark mb-3">Planetary Positions</h3>
      {data.planetaryPositions.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className={`text-2xl ${planetColors[p.planet]}`}>{p.symbol}</span>
            <div>
              <div className="font-semibold text-vedic-dark">{p.planet}</div>
              <div className="text-sm text-vedic-gray">
                {p.sign} {p.degree}° • {p.nakshatra} (Pada {p.pada})
              </div>
            </div>
          </div>
          {p.retrograde && (
            <span className="px-2 py-1 bg-lotus-100 text-lotus-700 rounded text-xs font-medium">
              ℛ Retrograde
            </span>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Birth Info */}
      <div className="mb-6 pb-6 border-b border-saffron-100">
        <h2 className="text-2xl font-bold text-vedic-dark mb-2">
          🪐 Rashi Chart (Birth Chart)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-vedic-gray">Date</div>
            <div className="font-semibold text-vedic-dark">{data.birthInfo.date}</div>
          </div>
          <div>
            <div className="text-vedic-gray">Time</div>
            <div className="font-semibold text-vedic-dark">{data.birthInfo.time}</div>
          </div>
          <div>
            <div className="text-vedic-gray">Place</div>
            <div className="font-semibold text-vedic-dark">{data.birthInfo.place}</div>
          </div>
          <div>
            <div className="text-vedic-gray">Lagna (Ascendant)</div>
            <div className="font-semibold text-saffron-700">{data.lagna}</div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {[
            { id: 'north', label: 'North Indian' },
            { id: 'south', label: 'South Indian' },
            { id: 'list', label: 'List View' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === v.id
                  ? 'bg-saffron-600 text-white'
                  : 'bg-saffron-50 text-vedic-dark hover:bg-saffron-100'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button className="px-4 py-2 bg-lotus-100 text-lotus-700 rounded-lg hover:bg-lotus-200">
          📥 Export PDF
        </button>
      </div>

      {/* Chart Display */}
      <div className="mt-6">
        {view === 'north' && renderNorthIndianChart()}
        {view === 'south' && renderSouthIndianChart()}
        {view === 'list' && renderListView()}
      </div>

      {/* Current Dasha */}
      <div className="mt-8 p-4 bg-gradient-to-r from-saffron-100 to-lotus-100 rounded-lg">
        <h3 className="text-lg font-semibold text-vedic-dark mb-2">⏳ Current Dasha</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-vedic-gray">Mahadasha</div>
            <div className="font-bold text-saffron-700">{data.currentDasha.mahadasha}</div>
          </div>
          <div>
            <div className="text-vedic-gray">Antardasha</div>
            <div className="font-bold text-lotus-700">{data.currentDasha.antardasha}</div>
          </div>
          <div>
            <div className="text-vedic-gray">Pratyantardasha</div>
            <div className="font-bold text-sacred-blue-700">{data.currentDasha.pratyantardasha}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-vedic-gray">
          {data.currentDasha.startDate} to {data.currentDasha.endDate}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getHouseNumber(sign: string, lagna: string): number {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  const lagnaIndex = signs.indexOf(lagna)
  const signIndex = signs.indexOf(sign)
  return ((signIndex - lagnaIndex + 12) % 12) + 1
}

function getHousePosition(houseNum: number) {
  const positions: Record<number, {x: number, y: number}> = {
    1: { x: 200, y: 200 },
    2: { x: 290, y: 110 },
    3: { x: 290, y: 200 },
    4: { x: 290, y: 290 },
    5: { x: 200, y: 290 },
    6: { x: 110, y: 290 },
    7: { x: 110, y: 200 },
    8: { x: 110, y: 110 },
    9: { x: 200, y: 110 },
    10: { x: 60, y: 60 },
    11: { x: 340, y: 60 },
    12: { x: 340, y: 340 },
  }
  return positions[houseNum] || { x: 200, y: 200 }
}

function getPlanetColor(planet: string): string {
  const colors: Record<string, string> = {
    Sun: '#FFA726',
    Moon: '#90CAF9',
    Mars: '#EF5350',
    Mercury: '#66BB6A',
    Jupiter: '#FDD835',
    Venus: '#EC407A',
    Saturn: '#42A5F5',
    Rahu: '#8D6E63',
    Ketu: '#78909C',
  }
  return colors[planet] || '#37474F'
}
