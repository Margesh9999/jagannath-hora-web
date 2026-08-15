'use client'

import Link from 'next/link'

const QUICK = [
  { icon: '🪐', label: 'Birth Chart', href: '/charts', desc: 'Rashi & all 16 Varga charts' },
  { icon: '⏳', label: 'Dashas', href: '/dashas', desc: 'Vimshottari, Ashtottari, Yogini' },
  { icon: '📅', label: 'Panchang', href: '/panchang', desc: 'Tithi, Nakshatra, Yoga, Vaara' },
  { icon: '💕', label: 'Match Making', href: '/matching', desc: 'Ashta Koota compatibility' },
  { icon: '🔮', label: 'KP Astrology', href: '/charts', desc: 'Sub-lords & ruling planets' },
  { icon: '📐', label: 'Jaimini', href: '/charts', desc: 'Charakarakas & aspects' },
  { icon: '💪', label: 'Shadbala', href: '/charts', desc: 'Planetary strength analysis' },
  { icon: '🔄', label: 'Transit', href: '/transit', desc: 'Gochara analysis' },
]

export default function QuickActions() {
  return (
    <div className="vedic-card p-5">
      <h3 className="font-bold text-vedic-dark mb-3">⚡ Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK.map((q) => (
          <Link key={q.label} href={q.href}
            className="p-3 rounded-lg bg-saffron-50 hover:bg-saffron-100 transition-colors border border-saffron-100">
            <div className="text-2xl mb-1">{q.icon}</div>
            <div className="font-semibold text-sm text-vedic-dark">{q.label}</div>
            <div className="text-xs text-vedic-gray">{q.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
