import { useEffect, useRef, useState, type CSSProperties } from 'react'

/*
 * Isometric "anatomy" scenes for the What we do cards.
 * One camera (30° from a corner, no perspective), solids painted back to front,
 * three tones by facing, hairline strokes, and one lit accent idea per scene.
 * Motion is CSS (plus SMIL for path travel); it only runs while a scene is on screen
 * and is removed entirely under prefers-reduced-motion.
 */

const C = Math.cos(Math.PI / 6)
type Pt = [number, number]

const iso = (x: number, y: number, z: number, u: number): Pt => [
  (x - y) * C * u,
  ((x + y) / 2 - z) * u,
]
const poly = (points: Pt[]) =>
  points.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(' ')
const matrix = (a: number, b: number, c: number, d: number, [e, f]: Pt) =>
  `matrix(${a.toFixed(3)} ${b.toFixed(3)} ${c.toFixed(3)} ${d.toFixed(3)} ${e.toFixed(2)} ${f.toFixed(2)})`

// Planes for drawing flat 2D content onto a face. v always runs "down the page".
/** Face of constant y (front-left). u → +x, v → −z. */
const leftPlane = (x: number, y: number, z: number, u: number) =>
  matrix(C * u, 0.5 * u, 0, u, iso(x, y, z, u))
/** Face of constant x (front-right). u → −y, v → −z. */
const rightPlane = (x: number, y: number, z: number, u: number) =>
  matrix(C * u, -0.5 * u, 0, u, iso(x, y, z, u))
/** Horizontal plane. u → +x, v → +y. */
const topPlane = (x: number, y: number, z: number, u: number) =>
  matrix(C * u, 0.5 * u, -C * u, 0.5 * u, iso(x, y, z, u))
/** Screen offset of a move along the x axis by n units. */
const alongX = (n: number, u: number) => iso(n, 0, 0, u)

type Tone = 'base' | 'ghost' | 'accent' | 'dim'

function Box({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  u,
  tone = 'base',
  className,
  style,
}: {
  x: number
  y: number
  z?: number
  w: number
  d: number
  h: number
  u: number
  tone?: Tone
  className?: string
  style?: CSSProperties
}) {
  const p = (a: number, b: number, c: number) => iso(a, b, c, u)
  return (
    <g
      className={`iso-box iso-${tone}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <polygon
        className="iso-l"
        points={poly([
          p(x, y + d, z),
          p(x + w, y + d, z),
          p(x + w, y + d, z + h),
          p(x, y + d, z + h),
        ])}
      />
      <polygon
        className="iso-r"
        points={poly([
          p(x + w, y, z),
          p(x + w, y + d, z),
          p(x + w, y + d, z + h),
          p(x + w, y, z + h),
        ])}
      />
      <polygon
        className="iso-t"
        points={poly([
          p(x, y, z + h),
          p(x + w, y, z + h),
          p(x + w, y + d, z + h),
          p(x, y + d, z + h),
        ])}
      />
    </g>
  )
}

const prefersStill = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches

/** Plays CSS + SMIL motion only while the scene is visible. */
function useScene(onVisible?: (visible: boolean) => void) {
  const ref = useRef<SVGSVGElement>(null)
  const callback = useRef(onVisible)
  callback.current = onVisible
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    svg.pauseAnimations?.()
    if (prefersStill()) {
      svg.setCurrentTime?.(1.2)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && !document.hidden
        svg.classList.toggle('is-playing', visible)
        if (visible) svg.unpauseAnimations?.()
        else svg.pauseAnimations?.()
        callback.current?.(visible)
      },
      { threshold: 0.15 },
    )
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])
  return ref
}

const delay = (seconds: number): CSSProperties => ({
  animationDelay: `${seconds.toFixed(2)}s`,
})

/* ------------------------------------------------------------------ */
/* Home: Conferences — a stage, a speaking screen, and an audience      */
/* ------------------------------------------------------------------ */

const confSeats = Array.from({ length: 4 * 7 }, (_, index) => {
  const row = Math.floor(index / 7)
  const col = index % 7
  return { x: 1.3 + col * 1.75, y: 11 + row * 1.9, index }
}).sort((a, b) => a.x + a.y - (b.x + b.y))
const confQuestions = new Map([
  [3, 0.4],
  [9, 2.1],
  [15, 3.6],
  [20, 1.3],
  [25, 4.4],
])

export function ConferenceScene() {
  const u = 11
  const ref = useScene()
  return (
    <svg
      ref={ref}
      className="iso-scene scene-conference"
      viewBox="-200 -100 345 290"
      aria-hidden="true"
    >
      <g className="iso-floor" transform={topPlane(-1, -1, 0, u)}>
        {Array.from({ length: 17 * 22 }, (_, index) => (
          <circle
            key={index}
            cx={(index % 17) + 0.5}
            cy={Math.floor(index / 17) + 0.5}
            r={0.05}
          />
        ))}
      </g>
      <Box x={0} y={0} w={14} d={8} h={0.8} u={u} tone="ghost" />
      <Box x={1} y={0.6} z={0.8} w={12} d={0.5} h={7.2} u={u} />
      <g transform={leftPlane(1.5, 1.1, 7.6, u)}>
        <rect className="screen-frame" width={11} height={6.4} />
        {Array.from({ length: 22 }, (_, index) => (
          <rect
            key={index}
            className="conf-bar"
            x={0.6 + index * 0.45}
            y={1.2}
            width={0.2}
            height={4}
            style={{
              animationDelay: `${(-index * 0.17).toFixed(2)}s`,
              animationDuration: `${(1.1 + (index % 4) * 0.23).toFixed(2)}s`,
            }}
          />
        ))}
      </g>
      <g transform={topPlane(10.1, 4.9, 0.8, u)}>
        {[0, 1, 2].map((ring) => (
          <circle
            key={ring}
            className="conf-ripple"
            r={9}
            style={delay(ring * 1.2)}
          />
        ))}
      </g>
      <Box x={9.6} y={3.3} z={0.8} w={0.9} d={0.9} h={2.7} u={u} />
      <circle
        className="iso-head is-lit"
        cx={iso(10.05, 3.75, 4.1, u)[0]}
        cy={iso(10.05, 3.75, 4.1, u)[1]}
        r={0.55 * u}
      />
      <Box x={9.4} y={4.6} z={0.8} w={1.4} d={1} h={2.1} u={u} />
      {confSeats.map(({ x, y, index }) => {
        const [cx, cy] = iso(x + 0.5, y + 0.5, 1.3, u)
        const question = confQuestions.get(index)
        return (
          <g key={index}>
            <Box x={x} y={y} w={1} d={1} h={0.5} u={u} tone="ghost" />
            <circle
              className={`iso-head${question === undefined ? '' : ' conf-question'}`}
              cx={cx}
              cy={cy}
              r={0.4 * u}
              style={question === undefined ? undefined : delay(question)}
            />
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Home: Hackathons — a structure assembled block by block, on a clock  */
/* ------------------------------------------------------------------ */

const hackBlocks = [
  ...[
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
  ].map(([gx, gy]) => ({ gx, gy, gz: 0 })),
  ...[
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ].map(([gx, gy]) => ({ gx, gy, gz: 1 })),
  { gx: 0, gy: 0, gz: 2 },
].sort((a, b) => a.gx + a.gy + a.gz - (b.gx + b.gy + b.gz) || a.gz - b.gz)

const HACK_SECONDS = 48 * 3600
const clock = (seconds: number) =>
  [seconds / 3600, (seconds / 60) % 60, seconds % 60]
    .map((part) => String(Math.floor(part)).padStart(2, '0'))
    .join(':')

export function HackathonScene() {
  const u = 13
  const [left, setLeft] = useState(HACK_SECONDS - 1)
  const timer = useRef(0)
  const ref = useScene((visible) => {
    window.clearInterval(timer.current)
    if (visible)
      timer.current = window.setInterval(
        () => setLeft((value) => (value > 0 ? value - 1 : HACK_SECONDS)),
        1000,
      )
  })
  useEffect(() => () => window.clearInterval(timer.current), [])
  const step = 1.3
  const size = 1.2
  return (
    <>
      <span className="scene-readout" aria-hidden="true">
        <span className="scene-readout-dot" />
        {clock(left)}
      </span>
      <svg
        ref={ref}
        className="iso-scene scene-hackathon"
        viewBox="-65 -60 135 125"
        aria-hidden="true"
      >
        <Box x={-0.4} y={-0.4} w={4.7} d={4.7} h={0.35} u={u} tone="ghost" />
        {hackBlocks.map(({ gx, gy, gz }, index) => (
          <Box
            key={`${gx}-${gy}-${gz}`}
            className="hack-block"
            x={gx * step}
            y={gy * step}
            z={0.35 + gz * size}
            w={size}
            d={size}
            h={size}
            u={u}
            tone={gz === 2 ? 'accent' : 'base'}
            style={delay(index * 0.26)}
          />
        ))}
      </svg>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Home: Consulting — documents in, working tools out                  */
/* ------------------------------------------------------------------ */

export function ConsultingScene() {
  const u = 12
  const ref = useScene()
  const [inX, inY] = alongX(4.4, u)
  const [outX, outY] = alongX(4.2, u)
  return (
    <svg
      ref={ref}
      className="iso-scene scene-consulting"
      viewBox="-58 -30 185 140"
      aria-hidden="true"
      style={
        {
          '--in-x': `${inX}px`,
          '--in-y': `${inY}px`,
          '--out-x': `${outX}px`,
          '--out-y': `${outY}px`,
        } as CSSProperties
      }
    >
      <Box x={0} y={2} w={13} d={2} h={0.3} u={u} tone="ghost" />
      <g transform={topPlane(0, 2, 0.3, u)} className="belt-marks">
        {Array.from({ length: 13 }, (_, index) => (
          <line
            key={index}
            x1={index + 0.5}
            x2={index + 0.5}
            y1={0.3}
            y2={1.7}
          />
        ))}
      </g>
      {[0, 1, 2].map((index) => (
        <g key={index} className="consult-doc" style={delay(-index)}>
          <Box x={0.2} y={2.4} z={0.3} w={1.5} d={1.2} h={0.12} u={u} />
          <g transform={topPlane(0.2, 2.4, 0.42, u)} className="doc-lines">
            <line x1={0.25} x2={1.2} y1={0.3} y2={0.3} />
            <line x1={0.25} x2={1.0} y1={0.6} y2={0.6} />
            <line x1={0.25} x2={1.1} y1={0.9} y2={0.9} />
          </g>
        </g>
      ))}
      <Box x={4.6} y={1.4} z={0.3} w={3.2} d={3.2} h={3.2} u={u} />
      <g transform={leftPlane(5, 4.6, 3.1, u)}>
        <rect className="machine-slot" width={2.4} height={0.18} />
        {[0, 1, 2].map((index) => (
          <rect
            key={index}
            className="machine-led"
            x={index * 0.45}
            y={0.6}
            width={0.22}
            height={0.22}
            style={delay(index * 0.33)}
          />
        ))}
      </g>
      <g transform={rightPlane(7.8, 4.2, 2.9, u)} className="machine-vents">
        {[0, 1, 2, 3].map((index) => (
          <line
            key={index}
            x1={0.3}
            x2={2.3}
            y1={index * 0.35}
            y2={index * 0.35}
          />
        ))}
      </g>
      {[0, 1, 2].map((index) => (
        <g key={index} className="consult-out" style={delay(-index)}>
          <Box x={7.9} y={2.5} z={0.3} w={1} d={1} h={1} u={u} tone="accent" />
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Home: Partnerships — a company and a campus, trading in both ways    */
/* ------------------------------------------------------------------ */

export function PartnershipScene() {
  const u = 11
  const ref = useScene()
  const towerTop = iso(1.5, 7.5, 10.2, u)
  const campusTop = iso(12, 1, 4.2, u)
  const mid: Pt = [
    (towerTop[0] + campusTop[0]) / 2,
    Math.min(towerTop[1], campusTop[1]) - 55,
  ]
  const outbound = `M${towerTop[0]},${towerTop[1]} Q${mid[0]},${mid[1]} ${campusTop[0]},${campusTop[1]}`
  const inbound = `M${campusTop[0]},${campusTop[1]} Q${mid[0]},${mid[1] + 26} ${towerTop[0]},${towerTop[1]}`
  return (
    <svg
      ref={ref}
      className="iso-scene scene-partnership"
      viewBox="-120 -125 300 250"
      aria-hidden="true"
    >
      <g className="iso-floor" transform={topPlane(-3, -4, 0, u)}>
        {Array.from({ length: 21 * 17 }, (_, index) => (
          <circle
            key={index}
            cx={(index % 21) + 0.5}
            cy={Math.floor(index / 21) + 0.5}
            r={0.05}
          />
        ))}
      </g>
      <Box x={9} y={-1} w={6} d={4} h={3.4} u={u} />
      <g transform={leftPlane(9.35, 3, 2.9, u)}>
        {Array.from({ length: 9 }, (_, index) => (
          <rect
            key={index}
            className="campus-column"
            x={index * 0.62}
            width={0.26}
            height={2.9}
          />
        ))}
      </g>
      <Box x={8.6} y={-1.4} z={3.4} w={6.8} d={4.8} h={0.35} u={u} />
      <Box
        x={9.6}
        y={-0.4}
        z={3.75}
        w={4.8}
        d={2.8}
        h={0.45}
        u={u}
        tone="ghost"
      />
      <Box x={0} y={6} w={3} d={3} h={10} u={u} />
      {(['left', 'right'] as const).map((face) => (
        <g
          key={face}
          transform={
            face === 'left'
              ? leftPlane(0.3, 9, 9.5, u)
              : rightPlane(3, 8.7, 9.5, u)
          }
        >
          {Array.from({ length: 4 * 9 }, (_, index) => {
            const lit = (index * 7 + (face === 'left' ? 3 : 5)) % 11 === 0
            return (
              <rect
                key={index}
                className={`tower-window${lit ? ' is-lit' : ''}`}
                x={(index % 4) * 0.62}
                y={Math.floor(index / 4) * 1.02}
                width={0.34}
                height={0.55}
                style={lit ? delay((index % 5) * 0.7) : undefined}
              />
            )
          })}
        </g>
      ))}
      <path className="bridge-path" d={outbound} />
      <path className="bridge-path is-faint" d={inbound} />
      {[0, 1, 2].map((index) => (
        <rect
          key={`out-${index}`}
          className="bridge-packet"
          x={-2.5}
          y={-2.5}
          width={5}
          height={5}
        >
          <animateMotion
            dur="3.6s"
            begin={`${-index * 1.2}s`}
            repeatCount="indefinite"
            path={outbound}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1"
          />
        </rect>
      ))}
      {[0, 1].map((index) => (
        <rect
          key={`in-${index}`}
          className="bridge-packet is-return"
          x={-2}
          y={-2}
          width={4}
          height={4}
        >
          <animateMotion
            dur="4.2s"
            begin={`${-index * 2.1 - 0.6}s`}
            repeatCount="indefinite"
            path={inbound}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1"
          />
        </rect>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Consulting page: Audit — a scan across your processes finds the gain */
/* ------------------------------------------------------------------ */

const auditTiles = Array.from({ length: 9 }, (_, index) => ({
  gx: index % 3,
  gy: Math.floor(index / 3),
}))

export function AuditScene() {
  const u = 12
  const ref = useScene()
  const step = 2.3
  const [sx, sy] = iso(0, 1, 0, u)
  return (
    <svg
      ref={ref}
      className="iso-scene scene-audit"
      viewBox="-82 -48 165 140"
      aria-hidden="true"
      style={
        {
          '--scan-x': `${sx * 7.6}px`,
          '--scan-y': `${sy * 7.6}px`,
        } as CSSProperties
      }
    >
      <g className="audit-links" transform={topPlane(0, 0, 0.3, u)}>
        <path d="M0.8 0.8 H5.4 M0.8 3.1 H5.4 M0.8 5.4 H5.4 M0.8 0.8 V5.4 M3.1 0.8 V5.4 M5.4 0.8 V5.4" />
      </g>
      {auditTiles.map(({ gx, gy }) => {
        const target = gx === 2 && gy === 1
        return (
          <g key={`${gx}-${gy}`}>
            <Box
              x={gx * step}
              y={gy * step}
              w={1.6}
              d={1.6}
              h={0.3}
              u={u}
              tone="ghost"
            />
            {target && (
              <Box
                className="audit-hit"
                x={gx * step}
                y={gy * step}
                w={1.6}
                d={1.6}
                h={0.3}
                u={u}
                tone="accent"
              />
            )}
          </g>
        )
      })}
      <g className="audit-scanner">
        <g transform={leftPlane(-0.4, -0.6, 3, u)}>
          <rect className="scanner-plane" width={7.2} height={3} />
          <line className="scanner-edge" x1={0} x2={7.2} y1={0} y2={0} />
        </g>
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Consulting page: Build — an exploded view that assembles itself     */
/* ------------------------------------------------------------------ */

export function BuildScene() {
  const u = 13
  const ref = useScene()
  const corners: Pt[] = [
    iso(0, 0, 0.5, u),
    iso(4, 0, 0.5, u),
    iso(4, 4, 0.5, u),
    iso(0, 4, 0.5, u),
  ]
  return (
    <svg
      ref={ref}
      className="iso-scene scene-build"
      viewBox="-62 -82 124 140"
      aria-hidden="true"
    >
      {corners.map(([x, y], index) => (
        <line
          key={index}
          className="build-guide"
          x1={x}
          x2={x}
          y1={y}
          y2={y - 52}
        />
      ))}
      <Box x={0} y={0} w={4} d={4} h={0.5} u={u} />
      <g transform={topPlane(0, 0, 0.5, u)} className="build-traces">
        <path d="M0.5 1 H2 V2.5 H3.5 M0.5 3 H1.5 V3.5 M3 0.5 V1.5" />
      </g>
      <g className="build-layer build-layer--mid">
        <Box
          x={0.3}
          y={0.3}
          z={0.5}
          w={3.4}
          d={3.4}
          h={0.4}
          u={u}
          tone="accent"
        />
      </g>
      <g className="build-layer build-layer--top">
        <Box x={0} y={0} z={0.9} w={4} d={4} h={0.3} u={u} />
        <Box x={0.6} y={0.6} z={1.2} w={1.2} d={1.2} h={0.35} u={u} />
        <Box x={2.3} y={0.6} z={1.2} w={1.1} d={0.6} h={0.25} u={u} />
        <Box x={2.3} y={1.6} z={1.2} w={1.1} d={0.6} h={0.25} u={u} />
        <Box x={0.6} y={2.4} z={1.2} w={2.8} d={1} h={0.2} u={u} tone="ghost" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Consulting page: Price — the same work, a shorter column            */
/* ------------------------------------------------------------------ */

export function PriceScene() {
  const u = 12
  const ref = useScene()
  const agency = 10
  const utopia = 4
  const [ax, ay] = iso(1.2, 2.4, 0, u)
  const [bx, by] = iso(4.6, 1.0, 0, u)
  return (
    <svg
      ref={ref}
      className="iso-scene scene-price"
      viewBox="-55 -98 135 175"
      aria-hidden="true"
    >
      {Array.from({ length: agency }, (_, index) => (
        <Box
          key={`a-${index}`}
          className="price-slab"
          x={0}
          y={0}
          z={index * 0.62}
          w={2.4}
          d={2.4}
          h={0.52}
          u={u}
          tone="ghost"
          style={delay(index * 0.12)}
        />
      ))}
      {Array.from({ length: utopia }, (_, index) => (
        <Box
          key={`u-${index}`}
          className="price-slab"
          x={3.4}
          y={-0.2}
          z={index * 0.62}
          w={2.4}
          d={2.4}
          h={0.52}
          u={u}
          tone={index === utopia - 1 ? 'accent' : 'dim'}
          style={delay(1.4 + index * 0.12)}
        />
      ))}
      <text className="scene-label" x={ax - 14} y={ay + 18}>
        Agency
      </text>
      <text className="scene-label is-accent" x={bx - 4} y={by + 18}>
        Utopia
      </text>
    </svg>
  )
}
