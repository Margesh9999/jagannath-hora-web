'use client'

import { useEffect, useState } from 'react'

export default function PanchangWidget() {
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    setToday(new Date())
  }, [])

  // Mock Panchang data
  const panchang = {
    tithi: 'Shukla Paksha Dashami',
    tithiPercent: 67.5,
    vara: 'Friday',
    nakshatra: 'Hasta',
    yoga: 'Siddhi',
    karana: 'Taitila',
    sunrise: '06:12',
    sunset: '18:45',
    moonrise: '14:30',
    moonset: '02:15',
    rahuKala: '10:30 - 12:00',
    gulikaKala: '07:30 - 09:00',
    yamaKala: '15:00 - 16:30',
    abhijit: '11:45 - 12:33',
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-vedic-dark flex items-center">
          <span className="mr-2">📅</span> Today's Panchang
        </h2>
        {today && (
          <div className="text-right">
            <div className="text-sm text-vedic-gray">
              {today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        )}
      </div>

      {/* Main Panchang Elements */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { icon: '🌙', label: 'Tithi', value: panchang.tithi, color: 'bg-lotus-50' },
          { icon: '📅', label: 'Vara', value: panchang.vara, color: 'bg-sacred-blue-50' },
          { icon: '⭐', label: 'Nakshatra', value: panchang.nakshatra, color: 'bg-saffron-50' },
          { icon: '🧘', label: 'Yoga', value: panchang.yoga, color: 'bg-mint-50' },
          { icon: '⏰', label: 'Karana', value: panchang.karana, color: 'bg-turmeric-50' },
        ].map((item, i) => (
          <div key={i} className={`${item.color} p-4 rounded-lg text-center`}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-xs text-vedic-gray mb-1">{item.label}</div>
            <div className="font-bold text-vedic-dark text-sm">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Sun & Moon Times */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: '🌅', label: 'Sunrise', value: panchang.sunrise },
          { icon: '🌇', label: 'Sunset', value: panchang.sunset },
          { icon: '🌝', label: 'Moonrise', value: panchang.moonrise },
          { icon: '🌚', label: 'Moonset', value: panchang.moonset },
        ].map((time, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-saffron-50 rounded-lg">
            <span className="text-2xl">{time.icon}</span>
            <div>
              <div className="text-xs text-vedic-gray">{time.label}</div>
              <div className="font-bold text-vedic-dark">{time.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Auspicious & Inauspicious Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inauspicious Times */}
        <div>
          <h3 className="text-lg font-semibold text-vedic-dark mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Inauspicious Times
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Rahu Kala', time: panchang.rahuKala, color: 'bg-lotus-100' },
              { name: 'Gulika Kala', time: panchang.gulikaKala, color: 'bg-sandalwood-100' },
              { name: 'Yama Ghantaka', time: panchang.yamaKala, color: 'bg-sacred-blue-100' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} p-3 rounded-lg flex items-center justify-between`}>
                <span className="font-medium text-vedic-dark">{item.name}</span>
                <span className="text-sm text-vedic-gray">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auspicious Times */}
        <div>
          <h3 className="text-lg font-semibold text-vedic-dark mb-3 flex items-center">
            <span className="mr-2">✅</span> Auspicious Times
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Abhijit Muhurta', time: panchang.abhijit, color: 'bg-mint-100' },
              { name: 'Amrita Kala', time: '22:30 - 23:45', color: 'bg-turmeric-100' },
              { name: 'Brahma Muhurta', time: '04:30 - 05:15', color: 'bg-lavender-100' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} p-3 rounded-lg flex items-center justify-between`}>
                <span className="font-medium text-vedic-dark">{item.name}</span>
                <span className="text-sm text-vedic-gray">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
