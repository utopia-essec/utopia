import { useEffect, useRef } from 'react'

const GRID = 6
const LOGO_CELLS = 34
const RAW = [164, 169, 178]
const REFINED = [237, 185, 225]
const FLASH = [255, 240, 251]

const hash = (a: number, b: number) => {
  const value = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return value - Math.floor(value)
}
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => value * value * (3 - 2 * value)
const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount
const color = (from: number[], to: number[], amount: number, alpha: number) =>
  `rgba(${from.map((channel, index) => Math.round(lerp(channel, to[index], amount))).join(',')},${alpha})`

// The "U" of the wordmark, rasterised from the site typeface into grid cells.
async function loadLogoBitmap() {
  const font = (size: number) =>
    `600 ${size}px 'Unbounded Variable', sans-serif`
  await document.fonts.load(font(LOGO_CELLS), 'U').catch(() => {})
  const sample = document.createElement('canvas')
  sample.width = sample.height = LOGO_CELLS
  const context = sample.getContext('2d', { willReadFrequently: true })
  if (!context) return []
  const measure = (size: number) => {
    context.font = font(size)
    const box = context.measureText('U')
    return {
      left: box.actualBoundingBoxLeft,
      width: box.actualBoundingBoxLeft + box.actualBoundingBoxRight,
      height: box.actualBoundingBoxAscent + box.actualBoundingBoxDescent,
      ascent: box.actualBoundingBoxAscent,
    }
  }
  const rough = measure(LOGO_CELLS)
  const size =
    (LOGO_CELLS * LOGO_CELLS * 0.94) / Math.max(rough.width, rough.height)
  const box = measure(size)
  context.fillStyle = '#fff'
  context.fillText(
    'U',
    (LOGO_CELLS - box.width) / 2 + box.left,
    (LOGO_CELLS - box.height) / 2 + box.ascent,
  )
  const { data } = context.getImageData(0, 0, LOGO_CELLS, LOGO_CELLS)
  const lit: { x: number; y: number }[] = []
  for (let y = 0; y < LOGO_CELLS; y++)
    for (let x = 0; x < LOGO_CELLS; x++)
      if (data[(y * LOGO_CELLS + x) * 4 + 3] > 110) lit.push({ x, y })
  return lit
}

// Unsorted pixels drift in from the left, pass a gate, and build the Utopia "U".
export default function PixelAssembly() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let bitmap: { x: number; y: number }[] = []
    let stopped = false
    let width = 0,
      height = 0,
      time = 0,
      frame = 0,
      last = 0,
      painted = 0,
      pitch = 0,
      visible = false,
      visibleSince = -1
    let pointer: { x: number; y: number } | null = null
    let noise: { x: number; y: number; seed: number }[] = []
    let cells: { x: number; y: number; delay: number; flash: number }[] = []
    let particles: {
      seed: number
      period: number
      offset: number
      cycle: number
      target: number
    }[] = []

    function layout() {
      if (!width || !height || !bitmap.length) return
      pitch = Math.max(
        3,
        Math.floor(
          Math.min((width * 0.44) / LOGO_CELLS, (height * 0.82) / LOGO_CELLS),
        ),
      )
      const left = width * 0.74 - (LOGO_CELLS * pitch) / 2
      const top = (height - LOGO_CELLS * pitch) / 2
      cells = bitmap.map(({ x, y }) => ({
        x: Math.round(left + x * pitch),
        y: Math.round(top + y * pitch),
        delay: (x / LOGO_CELLS) * 1400 + hash(x, y) * 900,
        flash: 0,
      }))
      noise = []
      for (let y = GRID; y < height - GRID; y += GRID) {
        for (let x = GRID * 2; x < width * 0.36; x += GRID) {
          const seed = hash(x, y)
          const edge = 1 - Math.abs(y / height - 0.5) * 1.5
          if (seed < 0.26 * edge * (1 - x / (width * 0.4)))
            noise.push({ x, y, seed: hash(y, x) })
        }
      }
      const count = Math.max(50, Math.min(130, (width * height) / 1800))
      particles = Array.from({ length: Math.round(count) }, (_, index) => ({
        seed: index + 1,
        period: 3600 + hash(index, 3) * 2400,
        offset: hash(index, 7),
        cycle: -1,
        target: Math.floor(hash(index, 11) * cells.length),
      }))
    }

    function draw() {
      if (!ctx || !width || !height) return
      ctx.clearRect(0, 0, width, height)
      const still = reduced.matches
      const clock = still ? 2600 : time
      const square = (
        x: number,
        y: number,
        size: number,
        fill: string,
      ): void => {
        let dx = 0,
          dy = 0
        if (pointer) {
          const distance = Math.max(1, Math.hypot(x - pointer.x, y - pointer.y))
          const push = Math.max(0, 1 - distance / 80) * 12
          dx = ((x - pointer.x) / distance) * push
          dy = ((y - pointer.y) / distance) * push
        }
        ctx.fillStyle = fill
        ctx.fillRect(x + dx, y + dy, size, size)
      }

      for (const { x, y, seed } of noise) {
        const alpha =
          0.2 + 0.3 * (0.5 + 0.5 * Math.sin(clock * 0.0012 + seed * 40))
        square(x, y, 3, color(RAW, RAW, 0, alpha))
      }

      const gateX = Math.round((width * 0.42) / GRID) * GRID
      const gateY = Math.round(height / 2 / GRID) * GRID
      for (let step = 3; step <= 8; step++) {
        const alpha = 0.75 - step * 0.07
        square(gateX, gateY - step * GRID, 3, color(REFINED, REFINED, 0, alpha))
        square(gateX, gateY + step * GRID, 3, color(REFINED, REFINED, 0, alpha))
      }

      // Assembly starts when the section is first seen, not when the page loads.
      const shown = visibleSince < 0 ? 0 : time - visibleSince
      const size = Math.max(2, Math.round(pitch * 0.72))
      cells.forEach((cell) => {
        const level = still ? 1 : clamp((shown - cell.delay) / 260)
        if (!level) return
        const breathe = still
          ? 0.85
          : 0.74 + 0.16 * Math.sin(cell.x * 0.018 - time * 0.0014)
        square(
          cell.x,
          cell.y,
          size,
          color(
            REFINED,
            FLASH,
            cell.flash,
            Math.min(1, level * breathe + cell.flash * 0.5),
          ),
        )
        cell.flash *= 0.88
      })

      for (const particle of particles) {
        const progress = clock / particle.period + particle.offset
        const cycle = Math.floor(progress)
        if (cycle !== particle.cycle) {
          if (particle.cycle >= 0 && cells[particle.target])
            cells[particle.target].flash = 1
          particle.cycle = cycle
          particle.target = Math.floor(
            hash(particle.seed, cycle + 1) * cells.length,
          )
        }
        const cell = cells[particle.target]
        if (!cell) continue
        const u = progress - cycle
        const startX = hash(particle.seed, cycle + 5) * width * 0.28
        const startY = height * (0.1 + 0.8 * hash(particle.seed, cycle + 9))
        const waistY = gateY + (hash(particle.seed, 13) - 0.5) * GRID * 3
        const before = u < 0.5
        const leg = before ? u * 2 : (u - 0.5) * 2
        const x = before ? lerp(startX, gateX, leg) : lerp(gateX, cell.x, leg)
        const y = before
          ? lerp(startY, waistY, smooth(leg))
          : lerp(waistY, cell.y, smooth(leg))
        const alpha =
          clamp(u / 0.08) *
          clamp((1 - u) / 0.04) *
          (0.55 + 0.45 * hash(particle.seed, 17))
        square(
          Math.round(x / GRID) * GRID,
          Math.round(y / GRID) * GRID,
          3,
          color(RAW, REFINED, smooth(clamp((u - 0.35) / 0.25)), alpha),
        )
      }
    }

    function tick(now: number) {
      time += last ? Math.min(now - last, 100) : 0
      last = now
      if (now - painted >= 1000 / 30) {
        draw()
        painted = now
      }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      last = 0
      if (visible && visibleSince < 0) visibleSince = time
      if (visible && !document.hidden && !reduced.matches)
        frame = requestAnimationFrame(tick)
      else draw()
    }
    function resize() {
      if (!canvas || !ctx) return
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      layout()
      draw()
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || reduced.matches) return
      const bounds = canvas!.getBoundingClientRect()
      pointer = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }
    }
    function leave() {
      pointer = null
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0.3 },
    )
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    loadLogoBitmap()
      .then((lit) => {
        if (stopped) return
        bitmap = lit
        layout()
        draw()
      })
      .catch(() => {})
    resize()
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return <canvas className="pixel-assembly" ref={ref} aria-hidden="true" />
}
