/*
 * Round 3 marks for the local-only /logo lab: the engraved family
 * (shapes × materials × finishes), the rebuilt Event Horizon and the
 * Orbits structures. Canvas 256×256, ink = currentColor,
 * accent = var(--lab-accent).
 */
import { useId } from 'react'
import { engrave, fields, type Family } from './logoEngrave'
import * as W from './logoWorld'

const C = 128
const ACCENT = 'var(--lab-accent)'
const f = (n: number) => +n.toFixed(2)

export type MarkProps = { size?: number; small?: boolean; className?: string }
export type Finish = 'ink' | 'dusk' | 'aurora' | 'chrome' | 'ember' | 'glow'

function Svg({
  size = 96,
  className,
  children,
}: {
  size?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/* ================= Finishes ================= */
const finishStops: Record<
  Exclude<Finish, 'ink' | 'glow'>,
  [string, string][]
> = {
  dusk: [
    ['0', 'currentColor'],
    ['0.55', 'currentColor'],
    ['1', 'var(--lab-accent)'],
  ],
  aurora: [
    ['0', '#ffd3ef'],
    ['0.45', '#c7b4ff'],
    ['1', '#8fd8ff'],
  ],
  chrome: [
    ['0', '#ffffff'],
    ['0.38', '#8d929b'],
    ['0.52', '#f4f5f7'],
    ['0.8', '#6b7079'],
    ['1', '#d9dce1'],
  ],
  ember: [
    ['0', '#ffcf9e'],
    ['0.5', '#db8fca'],
    ['1', '#6f4fe0'],
  ],
}

function FinishDefs({ id, finish }: { id: string; finish: Finish }) {
  if (finish === 'ink' || finish === 'glow') return null
  const diag = finish === 'aurora' || finish === 'chrome' || finish === 'ember'
  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        y1="0"
        x2={diag ? '1' : '0'}
        y2="1"
        gradientUnits="objectBoundingBox"
      >
        {finishStops[finish].map(([o, c]) => (
          <stop key={o} offset={o} style={{ stopColor: c }} />
        ))}
      </linearGradient>
    </defs>
  )
}

/* ================= Engraved family ================= */
export function Engraved({
  field,
  family = 'horizontal',
  finish = 'ink',
  size,
  small,
  className,
  gap = 4.4,
  maxW = 4.1,
}: MarkProps & {
  field: keyof typeof fields
  family?: Family
  finish?: Finish
  gap?: number
  maxW?: number
}) {
  const id = 'g' + useId().replace(/:/g, '')
  const k = small ? 3.4 : 1
  const d = engrave(field, fields[field], {
    family,
    gap: gap * k,
    maxW: maxW * k,
  })
  const fill =
    finish === 'ink' || finish === 'glow' ? 'currentColor' : `url(#${id})`
  return (
    <Svg
      size={size}
      className={[className, finish === 'glow' ? 'finish-glow' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <FinishDefs id={id} finish={finish} />
      <path d={d} fill={fill} className="anim-breathe" />
    </Svg>
  )
}

/* ================= Event Horizon, rebuilt ================= */
// Construction (all concentric on the hole unless stated):
//  hole r44 (empty) · accent photon ring r48–51 · upper lensed band between
//  r58 and a circle r74 raised 8 → 24 thick at the top ·
//  lower lensed band between r58 and r64 lowered 4 → 10 at the bottom ·
//  disk: tapered lens, 1.4× heavier on the approaching (left) side ·
//  every crossing is a real 5-unit knockout.
export function HorizonRefined({ size, className }: MarkProps) {
  const id = useId().replace(/:/g, '')
  const disk = 'M2 128C46 114 166 117 254 128C166 139 46 142 2 128Z'
  const front = 'M2 128C46 142 166 139 254 128Z'
  return (
    <Svg size={size} className={className}>
      <defs>
        <clipPath id={`top${id}`}>
          <rect width="256" height="128" />
        </clipPath>
        <clipPath id={`bot${id}`}>
          <rect y="128" width="256" height="128" />
        </clipPath>
        {/* lensed light and photon ring are cut where the near disk passes */}
        <mask id={`cut${id}`}>
          <rect width="256" height="256" fill="#fff" />
          <path d={front} fill="#000" stroke="#000" strokeWidth="10" />
        </mask>
        {/* far half of the disk vanishes behind the upper lensed band */}
        <mask id={`far${id}`}>
          <rect width="256" height="256" fill="#fff" />
          <circle
            cx={C}
            cy={120}
            r={79}
            fill="#000"
            clipPath={`url(#top${id})`}
          />
        </mask>
      </defs>
      <g mask={`url(#cut${id})`}>
        <path
          clipPath={`url(#top${id})`}
          fillRule="evenodd"
          d="M54 120a74 74 0 1 0 148 0a74 74 0 1 0 -148 0Z M70 128a58 58 0 1 0 116 0a58 58 0 1 0 -116 0Z"
        />
        <path
          clipPath={`url(#bot${id})`}
          fillRule="evenodd"
          d="M64 132a64 64 0 1 0 128 0a64 64 0 1 0 -128 0Z M70 128a58 58 0 1 0 116 0a58 58 0 1 0 -116 0Z"
        />
        <path
          fill={ACCENT}
          fillRule="evenodd"
          d="M77 128a51 51 0 1 0 102 0a51 51 0 1 0 -102 0Z M80 128a48 48 0 1 0 96 0a48 48 0 1 0 -96 0Z"
        />
      </g>
      <path d={disk} mask={`url(#far${id})`} />
    </Svg>
  )
}

export function HorizonEngraved({
  family = 'horizontal',
  finish = 'ink',
  ...p
}: MarkProps & { family?: Family; finish?: Finish }) {
  if (p.small) return <HorizonRefined {...p} />
  return (
    <Engraved
      field="horizon"
      family={family}
      finish={finish}
      gap={3.7}
      maxW={3.5}
      {...p}
    />
  )
}

/* ================= Orbits: structures ================= */
function Lines({
  size,
  className,
  w,
  children,
  accent,
}: MarkProps & {
  w: number
  children: React.ReactNode
  accent?: React.ReactNode
}) {
  return (
    <Svg size={size} className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={w}
        strokeLinecap="round"
        className="anim-orbit-group"
      >
        {children}
      </g>
      {accent}
    </Svg>
  )
}

/** The round-2 spiral, kept as the reference. */
export function OrbitSpiral({ small, ...p }: MarkProps) {
  const n = small ? 5 : 34
  return (
    <Lines
      {...p}
      w={small ? 11 : 1.5}
      accent={<circle cx={C} cy={C} r={small ? 16 : 5} fill={ACCENT} />}
    >
      {Array.from({ length: 34 }, (_, i) => i)
        .filter((i) => !small || i % 8 === 1)
        .slice(0, n)
        .map((i) => {
          const rx = 10 + i * 3.25
          return (
            <ellipse
              key={i}
              cx={C}
              cy={C}
              rx={rx}
              ry={rx * 0.58}
              transform={`rotate(${i * 5.5 - 20} ${C} ${C})`}
            />
          )
        })}
    </Lines>
  )
}

/** Torus: identical circles walked around a centre. A ring with a void. */
export function OrbitTorus({ small, ...p }: MarkProps) {
  const n = small ? 9 : 42
  return (
    <Lines {...p} w={small ? 8 : 1.4}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI
        return (
          <circle
            key={i}
            cx={f(C + 56 * Math.cos(a))}
            cy={f(C + 56 * Math.sin(a) * 0.62)}
            r={58}
          />
        )
      })}
    </Lines>
  )
}

/** Iris: straight chords only; a perfect empty circle appears in the middle. */
export function OrbitIris({ small, ...p }: MarkProps) {
  const n = small ? 15 : 72
  const R = 116
  const span = (150 * Math.PI) / 180
  return (
    <Lines
      {...p}
      w={small ? 6 : 1.2}
      accent={<circle cx={C} cy={C} r={small ? 12 : 6} fill={ACCENT} />}
    >
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI
        return (
          <line
            key={i}
            x1={f(C + R * Math.cos(a))}
            y1={f(C + R * Math.sin(a))}
            x2={f(C + R * Math.cos(a + span))}
            y2={f(C + R * Math.sin(a + span))}
          />
        )
      })}
    </Lines>
  )
}

/** Wormhole: shrinking circles drifting along a curve read as a tunnel. */
export function OrbitWormhole({ small, ...p }: MarkProps) {
  const n = small ? 6 : 30
  return (
    <Lines
      {...p}
      w={small ? 9 : 1.5}
      accent={
        <circle cx={C + 34} cy={C - 64} r={small ? 12 : 5} fill={ACCENT} />
      }
    >
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1)
        const r = 112 * Math.pow(1 - t, 1.35) + 5
        return (
          <circle
            key={i}
            cx={f(C + 34 * Math.sin(t * Math.PI * 0.5))}
            cy={f(C + 6 - 70 * Math.pow(t, 0.9))}
            r={f(r)}
          />
        )
      })}
    </Lines>
  )
}

/** Kepler: real orbits share a focus, not a centre. The star sits there. */
export function OrbitKepler({ small, ...p }: MarkProps) {
  const n = small ? 5 : 15
  const a = 78
  const e = 0.6
  const c = a * e
  const b = a * Math.sqrt(1 - e * e)
  return (
    <Lines
      {...p}
      w={small ? 8 : 1.6}
      accent={<circle cx={C} cy={C} r={small ? 18 : 8} fill={ACCENT} />}
    >
      {Array.from({ length: n }, (_, i) => (
        <ellipse
          key={i}
          cx={C + c}
          cy={C}
          rx={a}
          ry={f(b)}
          transform={`rotate(${f((i * 360) / n)} ${C} ${C})`}
        />
      ))}
    </Lines>
  )
}

/** Meridians: a world drawn only by its lines of longitude, tilted 23.5°. */
export function OrbitWorld({ small, ...p }: MarkProps) {
  const n = small ? 4 : 16
  const R = 108
  return (
    <Lines {...p} w={small ? 8 : 1.5}>
      <g transform={`rotate(23.5 ${C} ${C})`}>
        {Array.from({ length: n }, (_, i) => {
          const phi = (i / n) * Math.PI
          return (
            <ellipse
              key={i}
              cx={C}
              cy={C}
              rx={f(R * Math.abs(Math.cos(phi)) + 0.01)}
              ry={R}
            />
          )
        })}
        <ellipse cx={C} cy={C} rx={R} ry={R} />
      </g>
    </Lines>
  )
}

/* ================= New World variations ================= */
const worldMakers = {
  original: W.worldOriginal,
  dissolve: W.worldDissolve,
  horizon: W.worldHorizon,
  mirage: W.worldMirage,
  crescent: W.worldCrescent,
  dissolveCut: W.worldDissolveCut,
  tilted: W.worldTilted,
  eclipse: W.worldEclipse,
}
export type WorldVariant = keyof typeof worldMakers

export function WorldMark({
  variant,
  finish = 'ink',
  size,
  small,
  className,
}: MarkProps & { variant: WorldVariant; finish?: Finish }) {
  const id = 'w' + useId().replace(/:/g, '')
  const d = worldMakers[variant](small ? 3 : 1)
  const fill =
    finish === 'ink' || finish === 'glow' ? 'currentColor' : `url(#${id})`
  return (
    <Svg
      size={size}
      className={[className, finish === 'glow' ? 'finish-glow' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <FinishDefs id={id} finish={finish} />
      <path d={d} fill={fill} className="anim-breathe" />
    </Svg>
  )
}
