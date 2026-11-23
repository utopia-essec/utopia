/*
 * Engraving engine for the /logo lab.
 * A density field d(x, y) ∈ [0, 1] on the 256×256 canvas is drawn with a
 * family of guide lines whose width follows the density, so forms fade in
 * and out of nothing, like an etching or a dream. Output: one filled path.
 */

export type Field = (x: number, y: number) => number
export type Family =
  'horizontal' | 'wave' | 'concentric' | 'groove' | 'radial' | 'dissolve'

export type EngraveOpts = {
  family?: Family
  gap?: number
  maxW?: number
  gamma?: number
  cx?: number
  cy?: number
}

const C = 128
const r1 = (n: number) => Math.round(n * 10) / 10

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const clamp = (x: number) => Math.min(1, Math.max(0, x))

/* ---------------- guide lines ---------------- */
type Pt = [number, number]

function guides(o: Required<EngraveOpts>): Pt[][] {
  const { family, gap, cx, cy } = o
  const lines: Pt[][] = []
  const step = 1.4
  if (family === 'horizontal' || family === 'dissolve') {
    for (let y = gap / 2; y < 256; y += gap) {
      const l: Pt[] = []
      for (let x = 0; x <= 256; x += step) l.push([x, y])
      lines.push(l)
    }
  } else if (family === 'wave') {
    for (let y0 = -20; y0 < 276; y0 += gap) {
      const l: Pt[] = []
      for (let x = 0; x <= 256; x += step)
        l.push([
          x,
          y0 +
            7 * Math.sin(x * 0.034 + y0 * 0.01) +
            2.5 * Math.sin(x * 0.083 - y0 * 0.02),
        ])
      lines.push(l)
    }
  } else if (family === 'concentric') {
    for (let r = gap / 2; r < 182; r += gap) {
      const l: Pt[] = []
      const n = Math.max(24, Math.ceil((2 * Math.PI * r) / step))
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * 2 * Math.PI
        l.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
      }
      lines.push(l)
    }
  } else if (family === 'groove') {
    // one continuous Archimedean spiral: the whole image is a single line
    const l: Pt[] = []
    const k = gap / (2 * Math.PI)
    for (let t = 0.5; k * t < 182;) {
      const r = k * t
      l.push([cx + r * Math.cos(t), cy + r * Math.sin(t)])
      t += step / Math.max(r, 3)
    }
    lines.push(l)
  } else if (family === 'radial') {
    const n = Math.round((2 * Math.PI * 92) / gap)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI
      const l: Pt[] = []
      for (let r = 2; r < 182; r += step)
        l.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
      lines.push(l)
    }
  }
  return lines
}

/* ---------------- engrave ---------------- */
const cache = new Map<string, string>()

export function engrave(key: string, field: Field, opts: EngraveOpts = {}) {
  const o: Required<EngraveOpts> = {
    family: 'horizontal',
    gap: 4.4,
    maxW: 4.1,
    gamma: 0.9,
    cx: C,
    cy: C,
    ...opts,
  }
  const k = `${key}|${JSON.stringify(o)}`
  const hit = cache.get(k)
  if (hit) return hit

  const out: string[] = []
  const radialN = Math.round((2 * Math.PI * 92) / o.gap)
  for (const line of guides(o)) {
    let top: Pt[] = []
    let bot: Pt[] = []
    const flush = () => {
      if (top.length > 1) {
        const pts = [...top, ...bot.reverse()]
        out.push('M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L') + 'Z')
      }
      top = []
      bot = []
    }
    let s = 0
    for (let i = 0; i < line.length; i++) {
      const [x, y] = line[i]
      const p = line[Math.max(0, i - 1)]
      const n = line[Math.min(line.length - 1, i + 1)]
      if (i > 0) s += Math.hypot(x - p[0], y - p[1])
      if (x < -2 || x > 258 || y < -2 || y > 258) {
        flush()
        continue
      }
      const d = clamp(field(x, y))
      let w = o.maxW * Math.pow(d, o.gamma)
      if (o.family === 'radial') {
        // never wider than the spacing between rays at this radius
        const r = Math.hypot(x - o.cx, y - o.cy)
        w = Math.min(w, ((2 * Math.PI * r) / radialN) * 0.8)
      }
      if (o.family === 'dissolve') {
        // lines break into dashes, then dots, as the density falls
        const period = 7
        const duty = Math.pow(d, 0.7)
        if ((s % period) / period > duty) w = 0
        else w = o.maxW * Math.pow(d, 0.45)
      }
      if (w < 0.16) {
        flush()
        continue
      }
      const tx = n[0] - p[0]
      const ty = n[1] - p[1]
      const len = Math.hypot(tx, ty) || 1
      const nx = -ty / len
      const ny = tx / len
      top.push([x + (nx * w) / 2, y + (ny * w) / 2])
      bot.push([x - (nx * w) / 2, y - (ny * w) / 2])
    }
    flush()
  }
  const d = out.join('')
  cache.set(k, d)
  return d
}

/* ---------------- fields ---------------- */
const twist = (r: number) => 2.3 * Math.log(Math.max(r, 6) / 14)
export function galaxyDensity(r: number, theta: number) {
  const arm = Math.pow(0.5 + 0.5 * Math.cos(2 * (theta - twist(r))), 1.7)
  const core = Math.exp(-((r / 24) ** 2))
  const fade = 1 - smooth(82, 120, r)
  return Math.min(
    1,
    Math.max(core * 1.15, arm * fade * (0.45 + 0.55 * (1 - r / 130))),
  )
}

export const fields: Record<string, Field> = {
  /** Spiral galaxy, disk slightly tilted. */
  galaxy: (x, y) => {
    const dx = x - C
    const dy = (y - C) / 0.9
    return galaxyDensity(Math.hypot(dx, dy), Math.atan2(dy, dx))
  },

  /** A world lit from the upper left; its night side dissolves. */
  world: (x, y) => {
    const R = 104
    const dx = (x - C) / R
    const dy = (y - C) / R
    const rr = dx * dx + dy * dy
    if (rr > 1) return 0
    const nz = Math.sqrt(1 - rr)
    const L = [-0.52, -0.62, 0.59]
    const lambert = dx * L[0] + dy * L[1] + nz * L[2]
    return 0.8 * Math.pow(clamp(lambert * 1.1), 1.35)
  },

  /** Dawn: a sun rising out of the horizon, reflected in still water. */
  dawn: (x, y) => {
    const H = 150
    const R = 70
    if (y <= H) {
      const dist = Math.hypot(x - C, y - H)
      const disc = 0.84 * (1 - smooth(R - 3, R + 1, dist))
      const glow = 0.5 * Math.exp(-Math.max(0, dist - R) / 20)
      return Math.max(disc, glow) * smooth(H - R - 70, H - R + 10, y)
    }
    const depth = y - H
    const mirrored = Math.hypot((x - C) * (1 + depth / 160), depth * 2.1)
    const refl = 1 - smooth(R * 0.55, R * 1.05, mirrored)
    return refl * 0.92 * (1 - smooth(0, 96, depth))
  },

  /** The U of Utopia, solid at its base, dissolving upward like a dream. */
  dreamU: (x, y) => {
    const box = (px: number, py: number, hx: number, hy: number) => {
      const qx = Math.abs(px) - hx
      const qy = Math.abs(py) - hy
      return (
        Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
        Math.min(Math.max(qx, qy), 0)
      )
    }
    let sd = Math.min(box(x - 82, y - 92, 22, 60), box(x - 174, y - 92, 22, 60))
    if (y >= 150) {
      const r = Math.hypot(x - C, y - 150)
      sd = Math.min(sd, Math.max(r - 68, 24 - r))
    }
    const inside = 1 - smooth(-1.5, 1.5, sd)
    return inside * Math.pow(smooth(24, 214, y), 1.25)
  },

  /** A doorway of light: paradise seen from the threshold. The arch
   * edges dissolve, and light spills out across the floor. */
  portal: (x, y) => {
    const top = 104
    const half = 54
    const floor = 220
    let sd: number
    if (y < top) sd = Math.hypot(x - C, y - top) - half
    else sd = Math.max(Math.abs(x - C) - half, y - floor)
    if (sd <= 0) {
      const glow = 1 - Math.hypot((x - C) * 1.25, (y - 168) * 0.85) / 120
      const edge = smooth(0, 14, -sd)
      return 0.86 * Math.pow(clamp(glow), 1.1) * (0.25 + 0.75 * edge)
    }
    if (y > floor) {
      // light falling forward onto the ground, widening and fading
      const depth = y - floor
      const spread = half + depth * 1.6
      const across = 1 - smooth(spread * 0.4, spread, Math.abs(x - C))
      return 0.7 * across * (1 - smooth(0, 34, depth))
    }
    return 0
  },

  /** A halo with a bright head and a trail fading into nothing. */
  halo: (x, y) => {
    const r = Math.hypot(x - C, y - C)
    const ring = Math.exp(-(((r - 84) / 16) ** 2))
    let a = Math.atan2(y - C, x - C) + Math.PI * 0.25
    a = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const t = a / (2 * Math.PI)
    return ring * Math.pow(t, 1.5) * (1 - smooth(0.985, 1, t))
  },

  /** Event horizon: lensed light around an empty centre, disk in front. */
  horizon: (x, y) => {
    const dx = x - C
    const dy = y - C
    const r = Math.hypot(dx, dy)
    const hole = 44
    // accretion disk, thicker and brighter on the approaching (left) side
    const u = dx / 124
    let disk = 0
    if (Math.abs(u) < 1) {
      const halfT = 15 * Math.pow(1 - u * u, 0.75) * (1 - 0.22 * u)
      disk =
        Math.exp(-((dy / Math.max(halfT, 0.01)) ** 2) * 1.6) * (0.78 - 0.22 * u)
    }
    // far half of the disk is hidden behind the lensed light
    if (dy < 0) disk *= smooth(86, 98, r)
    if (r < hole) return dy >= 0 ? disk : 0
    // lensed image of the far disk: heavier on top, thin underneath
    const up = dy < 0 ? -dy / r : 0
    const sigma = 6 + 15 * up
    const lens = Math.exp(-(((r - (54 + 10 * up)) / sigma) ** 2))
    const under = dy >= 0 ? 0.75 * Math.exp(-(((r - 52) / 4.5) ** 2)) : 0
    const photon = Math.exp(-(((r - 47) / 1.6) ** 2))
    return clamp(Math.max(disk, dy < 0 ? lens : under, photon))
  },
}
