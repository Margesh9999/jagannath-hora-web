'use client'

const TOPICS = [
  { icon: '🪐', title: 'What is a Birth Chart (Rashi)?', body: 'A birth chart is a snapshot of the zodiac at the moment of birth, divided into 12 houses starting from the Ascendant (Lagna). Each planet occupies a sign and house, forming the basis of all Vedic analysis.' },
  { icon: '📐', title: 'Ayanamsa & Sidereal Zodiac', body: 'Vedic astrology uses the sidereal (fixed-star) zodiac. We apply Lahiri ayanamsa to convert tropical positions to sidereal, accounting for the precession of the equinoxes (~24° today).' },
  { icon: '⏳', title: 'Dasha Systems', body: 'Dashas are planetary periods that time events. Vimshottari (120 years) is the most used, starting from the Moon\'s nakshatra lord and progressing through nine planets.' },
  { icon: '📅', title: 'Panchang', body: 'The five-fold calendar: Tithi (lunar day), Vaara (weekday), Nakshatra (lunar mansion), Yoga, and Karana — essential for muhurta and festivals.' },
  { icon: '💕', title: 'Ashta Koota Milan', body: 'Match making scores 8 factors (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) out of 36 to assess marital compatibility.' },
  { icon: '🔮', title: 'KP & Jaimini', body: 'Krishnamurti Paddhati uses nakshatra sub-lords for precise predictions. Jaimini uses Charakarakas (planets as significators) for a different analytical lens.' },
]

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-vedic-dark">📚 Learn Vedic Astrology</h1>
      <p className="text-vedic-gray">A quick introduction to the concepts used throughout Jagannath Hora Web.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPICS.map((t) => (
          <div key={t.title} className="vedic-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{t.icon}</span>
              <h3 className="font-bold text-vedic-dark">{t.title}</h3>
            </div>
            <p className="text-sm text-vedic-gray">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
