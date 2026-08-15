'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang, LANGS } from '@/lib/providers'

const NAV = [
  { href: '/', key: 'dashboard' },
  { href: '/charts', key: 'charts' },
  { href: '/dashas', key: 'dashas' },
  { href: '/panchang', key: 'panchang' },
  { href: '/matching', key: 'matching' },
  { href: '/transit', key: 'transit' },
  { href: '/learn', key: 'learn' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { lang, setLang, t } = useLang()
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-saffron-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <span className="text-3xl">🪐</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-vedic-dark leading-tight">Jagannath Hora Web</h1>
              <p className="text-xs text-vedic-gray hidden md:block">Complete Free Vedic Astrology</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {NAV.map((n) => {
              const active = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-saffron-600 text-white' : 'text-vedic-dark hover:bg-saffron-100'
                  }`}
                >
                  {t(n.key)}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              className="text-sm px-2 py-1.5 border border-saffron-200 rounded-lg bg-white"
              aria-label="Language"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="lg:hidden flex overflow-x-auto gap-1 mt-3 pb-1">
          {NAV.map((n) => {
            const active = pathname === n.href
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  active ? 'bg-saffron-600 text-white' : 'text-vedic-dark bg-saffron-50'
                }`}
              >
                {t(n.key)}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
