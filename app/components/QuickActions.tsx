'use client'

export default function QuickActions() {
  const actions = [
    { icon: '🪐', title: 'Birth Chart', desc: 'Generate complete birth chart with all calculations', color: 'bg-saffron-50 hover:bg-saffron-100' },
    { icon: '⏳', title: 'Current Dasha', desc: 'View your current Mahadasha and Antardasha periods', color: 'bg-lotus-50 hover:bg-lotus-100' },
    { icon: '📅', title: 'Panchang', desc: 'Daily Panchang with tithi, nakshatra, yoga, karana', color: 'bg-sacred-blue-50 hover:bg-sacred-blue-100' },
    { icon: '💕', title: 'Match Making', desc: 'Ashta Koota compatibility check for marriage', color: 'bg-mint-50 hover:bg-mint-100' },
    { icon: '🧘', title: 'Yogas', desc: 'Detect 1000+ yogas in your birth chart', color: 'bg-turmeric-50 hover:bg-turmeric-100' },
    { icon: '💪', title: 'Shadbala', desc: 'Six-fold planetary strength calculations', color: 'bg-lavender-50 hover:bg-lavender-100' },
    { icon: '🔮', title: 'KP System', desc: 'Krishnamurti Paddhati with sub-lords', color: 'bg-sandalwood-50 hover:bg-sandalwood-100' },
    { icon: '📐', title: 'Jaimini', desc: 'Chara Karakas and Jaimini aspects', color: 'bg-rose-50 hover:bg-rose-100' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-vedic-dark mb-6 text-center">
        🚀 Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            className={`p-6 rounded-xl border-2 border-saffron-200 ${action.color} transition-all hover:shadow-lg hover:scale-105 text-left`}
          >
            <div className="text-4xl mb-3">{action.icon}</div>
            <div className="font-bold text-vedic-dark mb-1">{action.title}</div>
            <div className="text-xs text-vedic-gray">{action.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
