'use client'

import MatchMaker from '@/components/MatchMaker'

export default function MatchingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-vedic-dark">💕 Match Making (Kundali Milan)</h1>
      <p className="text-vedic-gray">Enter both birth details to compute the Ashta Koota (8-point) compatibility and Mangal Dosha analysis.</p>
      <MatchMaker />
    </div>
  )
}
