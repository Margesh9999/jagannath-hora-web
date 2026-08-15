'use client'

import { useState } from 'react'

interface BirthData {
  date: string
  time: string
  place: string
  latitude: number
  longitude: number
  timezone: string
}

interface BirthChartFormProps {
  onChartGenerated: (data: any) => void
}

export default function BirthChartForm({ onChartGenerated }: BirthChartFormProps) {
  const [birthData, setBirthData] = useState<BirthData>({
    date: '1990-01-01',
    time: '12:00',
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'IST',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const chartData = generateMockChart(birthData)
      onChartGenerated(chartData)
      setLoading(false)
    }, 1000)
  }

  const generateMockChart = (data: BirthData) => {
    return {
      birthInfo: data,
      lagna: 'Cancer',
      planetaryPositions: [
        { planet: 'Sun', symbol: '☉', sign: 'Capricorn', degree: 10.5, nakshatra: 'Shravana', pada: 1, retrograde: false },
        { planet: 'Moon', symbol: '☽', sign: 'Cancer', degree: 15.3, nakshatra: 'Pushya', pada: 4, retrograde: false },
        { planet: 'Mars', symbol: '♂', sign: 'Aries', degree: 22.7, nakshatra: 'Bharani', pada: 3, retrograde: false },
        { planet: 'Mercury', symbol: '☿', sign: 'Sagittarius', degree: 5.2, nakshatra: 'Mula', pada: 2, retrograde: true },
        { planet: 'Jupiter', symbol: '♃', sign: 'Leo', degree: 18.4, nakshatra: 'Purva Phalguni', pada: 2, retrograde: false },
        { planet: 'Venus', symbol: '♀', sign: 'Aquarius', degree: 8.9, nakshatra: 'Satabhisha', pada: 1, retrograde: false },
        { planet: 'Saturn', symbol: '♄', sign: 'Capricorn', degree: 25.6, nakshatra: 'Dhanishta', pada: 1, retrograde: true },
        { planet: 'Rahu', symbol: '☊', sign: 'Aquarius', degree: 12.3, nakshatra: 'Shatabhisha', pada: 2, retrograde: true },
        { planet: 'Ketu', symbol: '☋', sign: 'Leo', degree: 12.3, nakshatra: 'Magha', pada: 2, retrograde: true },
      ],
      currentDasha: {
        mahadasha: 'Jupiter',
        antardasha: 'Saturn',
        pratyantardasha: 'Mercury',
        startDate: '2024-01-15',
        endDate: '2027-03-20',
      },
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-vedic-dark mb-4 flex items-center">
        <span className="mr-2">📍</span> Birth Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="form-label">Birth Date</label>
          <input
            type="date"
            value={birthData.date}
            onChange={(e) => setBirthData({...birthData, date: e.target.value})}
            className="form-input"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="form-label">Birth Time</label>
          <input
            type="time"
            value={birthData.time}
            onChange={(e) => setBirthData({...birthData, time: e.target.value})}
            className="form-input"
            required
          />
        </div>

        {/* Place */}
        <div>
          <label className="form-label">Birth Place</label>
          <input
            type="text"
            value={birthData.place}
            onChange={(e) => setBirthData({...birthData, place: e.target.value})}
            className="form-input"
            placeholder="City, Country"
            required
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={birthData.latitude}
              onChange={(e) => setBirthData({...birthData, latitude: parseFloat(e.target.value)})}
              className="form-input"
              placeholder="28.6139"
            />
          </div>
          <div>
            <label className="form-label">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={birthData.longitude}
              onChange={(e) => setBirthData({...birthData, longitude: parseFloat(e.target.value)})}
              className="form-input"
              placeholder="77.2090"
            />
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="form-label">Timezone</label>
          <select
            value={birthData.timezone}
            onChange={(e) => setBirthData({...birthData, timezone: e.target.value})}
            className="form-input"
          >
            <option value="IST">IST (UTC+5:30) - India</option>
            <option value="EST">EST (UTC-5:00) - New York</option>
            <option value="PST">PST (UTC-8:00) - Los Angeles</option>
            <option value="GMT">GMT (UTC+0:00) - London</option>
            <option value="CET">CET (UTC+1:00) - Europe</option>
            <option value="JST">JST (UTC+9:00) - Japan</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full vedic-btn vedic-btn-primary flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="vedic-loader w-5 h-5 mr-2"></div>
              Calculating...
            </>
          ) : (
            <>
              <span className="mr-2">🪐</span>
              Generate Chart
            </>
          )}
        </button>
      </form>

      {/* Quick Examples */}
      <div className="mt-6 pt-6 border-t border-saffron-100">
        <h3 className="text-sm font-semibold text-vedic-gray mb-3">Quick Examples</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Celebrity 1', date: '1955-11-14', time: '10:30', place: 'New York' },
            { label: 'Celebrity 2', date: '1981-02-08', time: '19:30', place: 'Los Angeles' },
            { label: 'Today', date: new Date().toISOString().split('T')[0], time: '12:00', place: 'Current Location' },
            { label: 'Sample', date: '1990-06-15', time: '14:45', place: 'Mumbai' },
          ].map((ex, i) => (
            <button
              key={i}
              onClick={() => setBirthData({
                ...birthData,
                date: ex.date,
                time: ex.time,
                place: ex.place,
              })}
              className="text-xs px-3 py-2 bg-saffron-50 hover:bg-saffron-100 rounded-lg transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
