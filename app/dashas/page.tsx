'use client'

import { useApp } from '@/lib/providers'
import BirthChartForm from '@/components/BirthChartForm'
import DashaTimeline from '@/components/DashaTimeline'

export default function DashasPage() {
  const { kundali } = useApp()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-vedic-dark">⏳ Dasha Periods</h1>
      {!kundali ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1"><BirthChartForm /></div>
          <div className="lg:col-span-2 vedic-card p-12 text-center text-vedic-gray">
            Enter birth details to compute Vimshottari, Ashtottari and Yogini dasha timelines.
          </div>
        </div>
      ) : (
        <DashaTimeline kundali={kundali} />
      )}
    </div>
  )
}
