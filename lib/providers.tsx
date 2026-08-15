'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { generateKundali, type Kundali } from '@/lib/vedic'
import type { BirthData } from '@/lib/vedic'

interface AppState {
  birth: BirthData | null
  kundali: Kundali | null
  loading: boolean
  setBirth: (b: BirthData) => void
  clear: () => void
}

const defaultAppState: AppState = {
  birth: null,
  kundali: null,
  loading: false,
  setBirth: () => {},
  clear: () => {},
}
const AppCtx = createContext<AppState>(defaultAppState)

const STORAGE_KEY = 'jhweb_birth'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [birth, setBirthState] = useState<BirthData | null>(null)
  const [kundali, setKundali] = useState<Kundali | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const b = JSON.parse(raw) as BirthData
        setBirthState(b)
        setKundali(generateKundali(b))
      }
    } catch {
      /* ignore */
    }
  }, [])

  const setBirth = useCallback((b: BirthData) => {
    setLoading(true)
    // defer heavy compute to next tick so the UI can show a loader
    setTimeout(() => {
      try {
        const k = generateKundali(b)
        setBirthState(b)
        setKundali(k)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(b))
      } finally {
        setLoading(false)
      }
    }, 20)
  }, [])

  const clear = useCallback(() => {
    setBirthState(null)
    setKundali(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AppCtx.Provider value={{ birth, kundali, loading, setBirth, clear }}>
      {children}
    </AppCtx.Provider>
  )
}

export function useApp(): AppState {
  return useContext(AppCtx)
}

const LANGS = ['en', 'hi', 'ta', 'te'] as const
export type Lang = (typeof LANGS)[number]

type Dict = Record<string, string>
const translations: Record<Lang, Dict> = {
  en: {
    dashboard: 'Dashboard', charts: 'Charts', dashas: 'Dashas', panchang: 'Panchang',
    matching: 'Matching', learn: 'Learn', transit: 'Transit',
    birthDate: 'Birth Date', birthTime: 'Birth Time', place: 'Place / City',
    latitude: 'Latitude', longitude: 'Longitude', timezone: 'Timezone (UTC+)',
    calculate: 'Calculate Chart', generateFree: 'Generate Free Chart',
    welcome: 'Welcome to Jagannath Hora Web', ascendant: 'Ascendant',
    planetary: 'Planetary Positions', dasha: 'Dasha Periods', yogas: 'Yogas',
    shadbala: 'Shadbala (Strength)', varga: 'Divisional Chart',
  },
  hi: {
    dashboard: 'डैशबोर्ड', charts: 'चार्ट', dashas: 'दशाएँ', panchang: 'पंचांग',
    matching: 'मिलान', learn: 'जानें', transit: 'गोचर',
    birthDate: 'जन्म तिथि', birthTime: 'जन्म समय', place: 'स्थान / शहर',
    latitude: 'अक्षांश', longitude: 'देशांतर', timezone: 'समय क्षेत्र (UTC+)',
    calculate: 'चार्ट बनाएं', generateFree: 'मुफ़्त चार्ट बनाएं',
    welcome: 'जगन्नाथ होरा वेब में आपका स्वागत है', ascendant: 'लग्न',
    planetary: 'ग्रह स्थिति', dasha: 'दशा काल', yogas: 'योग',
    shadbala: 'शादबल (शक्ति)', varga: 'वर्ग चार्ट',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', charts: 'சார்ட்கள்', dashas: 'தசாக்கள்', panchang: 'பஞ்சாங்கம்',
    matching: 'பொருத்தம்', learn: 'கற்றுக்கொள்', transit: 'கோசரம்',
    birthDate: 'பிறந்த தேதி', birthTime: 'பிறந்த நேரம்', place: 'இடம் / நகரம்',
    latitude: 'அட்சரேகை', longitude: 'தீர்க்கரேகை', timezone: 'நேர மண்டலம் (UTC+)',
    calculate: 'சார்ட்டை உருவாக்கு', generateFree: 'இலவச சார்ட்டை உருவாக்கு',
    welcome: 'ஜகந்நாத் ஹோரா வெப்-க்கு வருக', ascendant: 'லக்னம்',
    planetary: 'கிரக நிலைகள்', dasha: 'தசா காலம்', yogas: 'யோகங்கள்',
    shadbala: 'ஷட்பலம் (வலிமை)', varga: 'வர்க்க சார்ட்',
  },
  te: {
    dashboard: 'డాష్‌బోర్డు', charts: 'చార్టులు', dashas: 'దశలు', panchang: 'పంచాంగం',
    matching: 'జాతక మిలన్', learn: 'నేర్చుకోండి', transit: 'గోచారం',
    birthDate: 'పుట్టిన తేదీ', birthTime: 'పుట్టిన సమయం', place: 'ప్రదేశం / నగరం',
    latitude: 'అక్షాంశం', longitude: 'రేఖాంశం', timezone: 'టైమ్ జోన్ (UTC+)',
    calculate: 'చార్ట్ తయారు చేయి', generateFree: 'ఉచిత చార్ట్ తయారు చేయి',
    welcome: 'జగన్నాథ్ హోరా వెబ్‌కు స్వాగతం', ascendant: 'లగ్నం',
    planetary: 'గ్రహ స్థితులు', dasha: 'దశ కాలం', yogas: 'యోగాలు',
    shadbala: 'షడ్బలం (బలం)', varga: 'వర్గ చార్ట్',
  },
}

interface LangState {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const defaultLangState: LangState = {
  lang: 'en',
  setLang: () => {},
  t: (key: string) => translations.en[key] ?? key,
}
const LangCtx = createContext<LangState>(defaultLangState)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const t = (key: string) => translations[lang][key] ?? translations.en[key] ?? key
  const setLang = (l: Lang) => setLangState(l)
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export function useLang(): LangState {
  return useContext(LangCtx)
}

export { LANGS }
