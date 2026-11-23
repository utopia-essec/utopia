/*
 * "New World" variations for the /logo lab. Every variant is horizontal
 * engraving of a lit sphere; they differ in how the stripes are spaced,
 * shifted, cut or mirrored. Pure geometry → one filled SVG path each.
 * `k` scales the stripe pitch for the small (16–64 px) cut.
 */
import { smooth } from './logoEngrave'

const C = 128
const R = 104
const clamp = (x: number) => Math.min(1, Math.max(0, x))
const r1 = (n: number) => Math.round(n * 10) / 10

type P = { x: number; y: number; w: number }

/** Stroke centre-lines of varying width into closed polygons. */
function build(lines: P[][]) {
  const out: string[] = []
  for (const line of lines) {
    let run: P[] = []
    const flush = () => {
      if (run.length > 1) {
        const top = run.map((p) => `${r1(p.x)} ${r1(p.y - p.w / 2)}`)
        const bot = run
          .slice()
          .reverse()
          .map((p) => `${r1(p.x)} ${r1(p.y + p.w / 2)}`)
        out.push('M' + [...top, ...bot].join('L') + 'Z')
      }
      run = []
    }
    for (const p of line) {
      if (p.w < 0.16) flush()
      else run.push(p)
    }
    flush()
  }
  return out.join('')
}

/** Lambert-lit sphere, light from the upper left. 0 outside. */
function lit(x: number, y: number, cx = C, cy = C, r = R) {
  const dx = (x - cx) / r
  const dy = (y - cy) / r
  const rr = dx * dx + dy * dy
  if (rr > 1) return 0
  const nz = Math.sqrt(1 - rr)
  const l = dx * -0.52 + dy * -0.62 + nz * 0.59
  return Math.pow(clamp(l * 1.1), 1.35)
}
/** Soft-edged disc coverage. */
function disc(x: number, y: number, cx = C, cy = C, r = R) {
  return 1 - smooth(r - 1.2, r + 1.2, Math.hypot(x - cx, y - cy))
}

function rows(gap: number, from = 18, to = 240) {
  const ys: number[] = []
  for (let y = from + gap / 2; y < to; y += gap) ys.push(y)
  return ys
}
const STEP = 1.2
const xs = (() => {
  const a: number[] = []
  for (let x = 0; x <= 256; x += STEP) a.push(x)
  return a
})()

const cache = new Map<string, string>()
function memo(key: string, make: () => string) {
  let v = cache.get(key)
  if (!v) cache.set(key, (v = make()))
  return v
}

/* ---------- 0 · original ---------- */
export const worldOriginal = (k = 1) =>
  memo(`orig${k}`, () => {
    const gap = 4.4 * k
    return build(
      rows(gap).map((y) =>
        xs.map((x) => ({ x, y, w: 0.8 * 4.1 * k * Math.pow(lit(x, y), 0.9) })),
      ),
    )
  })

/* ---------- 1 · dissolve: pitch widens, stripes thin toward the edge ---- */
function dissolveRows(k: number) {
  // stripe pitch grows geometrically from the lit top to the empty bottom
  const ys: { y: number; gap: number; t: number }[] = []
  let y = 24
  let gap = 2.6 * k
  while (y < 236) {
    ys.push({ y, gap, t: (y - 24) / 212 })
    y += gap
    gap *= k > 1 ? 1.16 : 1.062
  }
  return ys
}
function dissolveWidth(x: number, y: number, gap: number, t: number) {
  const fade = Math.pow(1 - t, 1.25)
  const light = 0.35 + 0.65 * lit(x, y)
  return gap * 0.86 * disc(x, y) * fade * light
}
export const worldDissolve = (k = 1) =>
  memo(`diss${k}`, () =>
    build(
      dissolveRows(k).map(({ y, gap, t }) =>
        xs.map((x) => ({ x, y, w: dissolveWidth(x, y, gap, t) })),
      ),
    ),
  )

/* ---------- 2 · horizon: half-sunk, reflection drifting apart ---------- */
export const worldHorizon = (k = 1) =>
  memo(`hor${k}`, () => {
    const H = 150
    const r = 100
    const lines: P[][] = []
    const gap = 4.2 * k
    for (let y = H - r + gap / 2; y < H - 1; y += gap)
      lines.push(
        xs.map((x) => ({
          x,
          y,
          w:
            gap *
            0.82 *
            Math.pow(0.25 + 0.75 * lit(x, y, C, H, r), 0.9) *
            disc(x, y, C, H, r),
        })),
      )
    // reflection: each line further down is further apart, shorter, broken
    let y = H + 4 * k
    let g = 4.6 * k
    let i = 0
    while (y < 246) {
      const depth = (y - H) / 96
      const mirrorY = H - (y - H) * 1.5
      const half =
        Math.sqrt(Math.max(0, r * r - (H - mirrorY) ** 2)) * (1 - depth * 0.35)
      const drift = Math.sin(i * 1.9) * 7 * depth
      const line: P[] = []
      for (const x of xs) {
        const u = (x - C - drift) / Math.max(half, 0.01)
        if (Math.abs(u) > 1) {
          line.push({ x, y, w: 0 })
          continue
        }
        // ripple breaks: gaps open up with depth
        const brk = 0.5 + 0.5 * Math.sin(x * (0.045 + i * 0.006) + i * 2.3)
        const keep = brk > depth * 0.85 ? 1 : 0
        const soft = smooth(depth * 0.85, depth * 0.85 + 0.18, brk)
        const w =
          g *
          0.5 *
          (1 - depth) *
          Math.pow(1 - u * u, 0.8) *
          soft *
          (keep || soft)
        line.push({ x, y, w })
      }
      lines.push(line)
      y += g
      g *= 1.13
      i++
    }
    return build(lines)
  })

/* ---------- 3 · mirage: stripes slip sideways like heat haze ---------- */
const haze = (i: number, y: number) => {
  const a = smooth(96, 210, y)
  return a * (19 * Math.sin(i * 2.17) + 9 * Math.sin(i * 0.71 + 1))
}
export const worldMirage = (k = 1) =>
  memo(`mir${k}`, () => {
    const gap = 4.4 * k
    return build(
      rows(gap).map((y, i) => {
        const off = haze(i, y) * (k > 1 ? 1.4 : 1)
        return xs.map((x) => ({
          x: x + off,
          y,
          w: 0.8 * 4.1 * k * Math.pow(lit(x, y), 0.9),
        }))
      }),
    )
  })

/* ---------- 4 · missing piece: a crescent of stripes left out ---------- */
// Cut = inside circle B, outside circle C (both offset to the upper right):
// a crescent-shaped channel, widest (≈27) toward the lower left.
const cut = (x: number, y: number) => {
  const inB = 1 - smooth(-1.2, 1.2, Math.hypot(x - 148, y - 110) - 99)
  const outC = smooth(-1.2, 1.2, Math.hypot(x - 160, y - 100) - 86)
  return 1 - inB * outC
}
export const worldCrescent = (k = 1) =>
  memo(`cres${k}`, () => {
    const gap = 4.4 * k
    return build(
      rows(gap).map((y) =>
        xs.map((x) => ({
          x,
          y,
          w: 0.8 * 4.1 * k * Math.pow(lit(x, y), 0.9) * cut(x, y),
        })),
      ),
    )
  })

/* ---------- 5 · dissolve + missing piece (the suggested combination) ---- */
export const worldDissolveCut = (k = 1) =>
  memo(`dcut${k}`, () =>
    build(
      dissolveRows(k).map(({ y, gap, t }) =>
        xs.map((x) => ({ x, y, w: dissolveWidth(x, y, gap, t) * cut(x, y) })),
      ),
    ),
  )

/* ---------- 6 · tilted 23.5°, like Earth's axis ---------- */
export const worldTilted = (k = 1) =>
  memo(`tilt${k}`, () => {
    const gap = 4.4 * k
    const a = (-23.5 * Math.PI) / 180
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    const lines: P[][] = []
    for (let v = -150; v < 150; v += gap) {
      const line: P[] = []
      for (let u = -150; u <= 150; u += STEP) {
        const x = C + u * ca - v * sa
        const y = C + u * sa + v * ca
        line.push({ x, y, w: 0.8 * 4.1 * k * Math.pow(lit(x, y), 0.9) })
      }
      lines.push(line)
    }
    // tilted lines: offset along the rotated normal instead of vertical
    return buildRotated(lines, ca, sa)
  })
function buildRotated(lines: P[][], ca: number, sa: number) {
  const nx = -sa
  const ny = ca
  const out: string[] = []
  for (const line of lines) {
    let run: P[] = []
    const flush = () => {
      if (run.length > 1) {
        const top = run.map(
          (p) => `${r1(p.x + (nx * p.w) / 2)} ${r1(p.y + (ny * p.w) / 2)}`,
        )
        const bot = run
          .slice()
          .reverse()
          .map((p) => `${r1(p.x - (nx * p.w) / 2)} ${r1(p.y - (ny * p.w) / 2)}`)
        out.push('M' + [...top, ...bot].join('L') + 'Z')
      }
      run = []
    }
    for (const p of line) {
      if (p.w < 0.16) flush()
      else run.push(p)
    }
    flush()
  }
  return out.join('')
}

/* ---------- 7 · eclipse: lit only at the rim, from behind ---------- */
export const worldEclipse = (k = 1) =>
  memo(`ecl${k}`, () => {
    const gap = 4.4 * k
    return build(
      rows(gap).map((y) =>
        xs.map((x) => {
          const dx = (x - C) / R
          const dy = (y - C) / R
          const rr = dx * dx + dy * dy
          if (rr > 1) return { x, y, w: 0 }
          const nz = Math.sqrt(1 - rr)
          // back light from the upper right: rim glow + a faint body
          const rim =
            Math.pow(1 - nz, 2.2) * clamp(0.35 + dx * 0.55 - dy * 0.45)
          return { x, y, w: gap * 0.85 * Math.min(1, rim * 1.9) }
        }),
      ),
    )
  })
