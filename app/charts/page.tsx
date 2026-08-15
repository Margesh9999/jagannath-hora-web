'use client'

import { useApp } from '@/lib/providers'
import BirthChartForm from '@/components/BirthChartForm'
import ChartDisplay from '@/components/ChartDisplay'

export default function ChartsPage() {
  const { kundali } = useApp()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-vedic-dark">📊 Charts & Analysis</h1>
      {!kundali ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1"><BirthChartForm /></div>
          <div className="lg:col-span-2 vedic-card p-12 text-center text-vedic-gray">
            Enter birth details to generate the complete chart with all 16 Varga charts, yogas, and strength analysis.
          </div>
        </div>
      ) : (
        <ChartDisplay kundali={kundali} />
      )}
    </div>
  )
}
