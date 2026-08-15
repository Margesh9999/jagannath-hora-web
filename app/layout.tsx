import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider, LanguageProvider } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '🪐 Jagannath Hora Web - Free Vedic Astrology Platform',
  description: 'Complete free Vedic astrology software with charts, dashas, panchang, match making, and all features of Jagannath Hora desktop software.',
  keywords: 'vedic astrology, jyotish, birth chart, horoscope, dasha, panchang, match making, kundali, free astrology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪐</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-saffron-50 to-sacred-blue-50`}>
        <AppProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-saffron-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">🪐</span>
                  <div>
                    <h1 className="text-2xl font-bold text-vedic-dark">
                      Jagannath Hora Web
                    </h1>
                    <p className="text-sm text-vedic-gray">
                      Complete Free Vedic Astrology Platform
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                  {['Dashboard', 'Charts', 'Dashas', 'Panchang', 'Matching', 'Learn'].map((item) => (
                    <button
                      key={item}
                      className="px-4 py-2 text-vedic-dark hover:bg-saffron-100 rounded-lg transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                  <button className="px-6 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors">
                    Calculate Chart
                  </button>
                </nav>

                {/* Mobile menu button */}
                <button className="md:hidden p-2">
                  <span className="text-2xl">☰</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-vedic-dark text-white py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-sacred-blue-100">
                    Jagannath Hora Web brings the complete power of professional Vedic astrology software to your browser, 100% free.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    {['Birth Chart', 'Panchang', 'Match Making', 'Dashas', 'Transits', 'Yogas'].map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sacred-blue-100 hover:text-saffron-300 transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'हिंदी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'বাংলা', 'मराठी', 'ગુજરાતી'].map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-sacred-blue-900 text-sacred-blue-100 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
                  <p className="text-sacred-blue-100 text-sm">
                    This software is for educational purposes only. Results are based on Vedic astrology principles and should not be considered financial, medical, or legal advice.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-sacred-blue-800 text-center text-sacred-blue-300">
                <p>
                  🪐 Jagannath Hora Web • Made with ❤️ for Vedic astrology enthusiasts • MIT License • Open Source
                </p>
                <p className="mt-2 text-sm">
                  Replicating Jagannath Hora desktop software for the modern web
                </p>
              </div>
            </div>
          </footer>
            </div>
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  )
}