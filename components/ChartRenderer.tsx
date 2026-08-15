'use client'

import { useState } from 'react'
import type { ComputedChart, VargaChart, PlanetKey } from '@/lib/vedic'
import { SIGNS } from '@/lib/vedic'

interface Props {
  chart: ComputedChart
  varga?: VargaChart | null
  mode?: 'north' | 'south'
}

const PLANET_GLYPH: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋', Asc: 'L',
}

// South Indian: 4x4 ring of 12 sign boxes (fixed sign order), center cells empty.
function southCells(): { r: number; c: number; sign: number }[] {
  const order = [
    [12, 1, 2, 3],
    [11, 0, 0, 4],
    [10, 0, 0, 5],
    [9, 8, 7, 6],
  ]
  const cells: { r: number; c: number; sign: number }[] = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const s = order[r][c]
      if (s) cells.push({ r, c, sign: s })
    }
  return cells
}

function NorthChart({ signs, ascSign }: { signs: (string | 'Asc')[][]; ascSign: number }) {
  const C = 200
  const N = { x: 200, y: 20 }, E = { x: 380, y: 200 }, S = { x: 200, y: 380 }, W = { x: 20, y: 200 }
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
  // boundary points for 12 houses (house1 at bottom, CCW)
  const pts: { x: number; y: number }[] = [
    lerp(S, W, 1 / 3), lerp(S, W, 2 / 3), W,
    lerp(W, N, 1 / 3), lerp(W, N, 2 / 3), N,
    lerp(N, E, 1 / 3), lerp(N, E, 2 / 3), E,
    lerp(E, S, 1 / 3), lerp(E, S, 2 / 3), S,
  ]
  const houseOfSign = (sign: number) => ((sign - ascSign + 12) % 12) + 1
  const houses: (string | 'Asc')[][] = Array.from({ length: 12 }, () => [])
  signs.forEach((arr, i) => {
    const sign = i
    const h = houseOfSign(sign)
    arr.forEach(s => {
      if (s === 'Asc') houses[h - 1].push('Asc')
      else houses[h - 1].push(s)
    })
  })
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
      <rect x={10} y={10} width={380} height={380} fill="#fff" stroke="#FFE082" strokeWidth={3} rx={6} />
      <polygon points={`${N.x},${N.y} ${E.x},${E.y} ${S.x},${S.y} ${W.x},${W.y}`} fill="#FFFDF5" stroke="#FFB300" strokeWidth={2} />
      {pts.map((p, i) => {
        const p2 = pts[(i + 1) % 12]
        const cx = (C + p.x + p2.x) / 3
        const cy = (C + p.y + p2.y) / 3
        const members = houses[i]
        return (
          <g key={i}>
            <polygon points={`${C},${C} ${p.x},${p.y} ${p2.x},${p2.y}`} fill="rgba(255,248,225,0.4)" stroke="#FFD54F" strokeWidth={1} />
            <text x={cx} y={cy - 6} textAnchor="middle" className="fill-vedic-dark" fontSize={11}>{i + 1}</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} className="fill-vedic-dark font-semibold">
              {members.map((m) => PLANET_GLYPH[m]).join(' ')}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function SouthChart({ signs, ascSign }: { signs: (string | 'Asc')[][]; ascSign: number }) {
  const cells = southCells()
  const size = 92
  const gap = 4
  const offset = 14
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
      <rect x={8} y={8} width={384} height={384} fill="#fff" stroke="#FFE082" strokeWidth={3} rx={6} />
      {cells.map((cell) => {
        const x = offset + cell.c * (size + gap)
        const y = offset + cell.r * (size + gap)
        const members: (string | 'Asc')[] = signs[cell.sign] ?? []
        const isAsc = members.includes('Asc')
        return (
          <g key={cell.sign}>
            <rect x={x} y={y} width={size} height={size} rx={4}
              fill={cell.sign === ascSign ? '#FFF3E0' : '#FFFDF5'}
              stroke={cell.sign === ascSign ? '#FFB300' : '#FFE082'} strokeWidth={cell.sign === ascSign ? 2.5 : 1.5} />
            <text x={x + 6} y={y + 16} fontSize={10} className="fill-vedic-gray">{SIGNS[cell.sign - 1].symbol} {SIGNS[cell.sign - 1].name.slice(0, 3)}</text>
            <text x={x + size / 2} y={y + size / 2 + 6} textAnchor="middle" fontSize={16} className="fill-vedic-dark font-semibold">
              {members.filter((m) => m !== 'Asc').map((m) => PLANET_GLYPH[m] || String(m)).join(' ')}
            </text>
            {isAsc && (
              <text x={x + size - 6} y={y + 16} textAnchor="end" fontSize={11} className="fill-saffron-700 font-bold">L</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default function ChartRenderer({ chart, varga, mode = 'south' }: Props) {
  const [m, setM] = useState<'north' | 'south'>(mode)
  const ascSign = varga ? varga.planetSigns['Asc'] ?? chart.ascendant.sign : chart.ascendant.sign
  const signs = varga ? varga.signs : (() => {
    const s: (string | 'Asc')[][] = Array.from({ length: 12 }, () => [])
    s[ascSign].push('Asc')
    chart.planets.forEach((p) => s[p.sign].push(p.key))
    return s
  })()

  return (
    <div>
      {!varga && (
        <div className="flex justify-center gap-2 mb-3">
          <button onClick={() => setM('north')}
            className={`px-3 py-1 rounded-lg text-sm ${m === 'north' ? 'bg-saffron-600 text-white' : 'bg-saffron-50 text-vedic-dark'}`}>North Indian</button>
          <button onClick={() => setM('south')}
            className={`px-3 py-1 rounded-lg text-sm ${m === 'south' ? 'bg-saffron-600 text-white' : 'bg-saffron-50 text-vedic-dark'}`}>South Indian</button>
        </div>
      )}
      {varga ? (
        <SouthChart signs={signs} ascSign={ascSign} />
      ) : m === 'north' ? (
        <NorthChart signs={signs} ascSign={ascSign} />
      ) : (
        <SouthChart signs={signs} ascSign={ascSign} />
      )}
    </div>
  )
}
