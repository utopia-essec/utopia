import { useEffect, useRef } from 'react'

// Fixed diagonal oval with a localized, flowing dither cloud beside it.
const random = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}
const ring = { cx: 150, cy: 150, rx: 119, ry: 59.5, angle: -Math.PI / 3 }
const samples = Array.from({ length: 100 * 100 }, (_, i) => {
  const x = (i % 100) * 3
  const y = Math.floor(i / 100) * 3
  return {
    x,
    y,
    field: (() => {
      const dx = x - ring.cx,
        dy = y - ring.cy
      const u = dx * Math.cos(ring.angle) + dy * Math.sin(ring.angle)
      const v = -dx * Math.sin(ring.angle) + dy * Math.cos(ring.angle)
      return {
        distance: Math.abs(Math.hypot(u / ring.rx, v / ring.ry) - 1),
        angle: Math.atan2(v / ring.ry, u / ring.rx),
      }
    })(),
  }
})

export default function PixelOrbit() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false,
      frame = 0,
      last = 0,
      painted = 0,
      time = 0
    let pointer: { x: number; y: number } | null = null
    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, 300, 300)
      const phase = reduced.matches ? 0 : time * 0.00055
      // Localized clouds keep open space around the oval instead of a starfield.
      for (const { x, y } of samples) {
        const wx = x + Math.sin(y * 0.035 + phase * 0.65) * 6
        const wy = y + Math.sin(x * 0.04 - phase * 0.45) * 5
        const field =
          0.9 *
            Math.exp(
              -(
                ((wx - 211 - Math.sin(phase * 0.4) * 7) / 29) ** 2 +
                ((wy - 186) / 43) ** 2
              ) * 1.5,
            ) +
          0.65 *
            Math.exp(
              -(
                ((wx - 184) / 34) ** 2 +
                ((wy - 224 - Math.cos(phase * 0.5) * 6) / 23) ** 2
              ) * 1.5,
            ) +
          0.48 *
            Math.exp(
              -(
                ((wx - 83 - Math.sin(phase * 0.35) * 5) / 32) ** 2 +
                ((wy - 94) / 26) ** 2
              ) * 1.5,
            ) +
          0.36 *
            Math.exp(
              -(
                ((wx - 173) / 27) ** 2 +
                ((wy - 57 - Math.cos(phase * 0.3) * 4) / 19) ** 2
              ) * 1.5,
            )
        const texture = 0.7 + 0.3 * Math.sin(wx * 0.09 + wy * 0.05 - phase)
        const alpha =
          Math.max(0, field * texture - random(x * 13 + y * 7) * 0.23) * 0.65
        if (alpha < 0.055) continue
        const distance = pointer
          ? Math.hypot(x - pointer.x, y - pointer.y)
          : 100
        const near =
          pointer && !reduced.matches ? Math.max(0, 1 - distance / 40) : 0
        const dx = pointer
          ? ((x - pointer.x) / Math.max(1, distance)) * near * 5
          : 0
        const dy = pointer
          ? ((y - pointer.y) / Math.max(1, distance)) * near * 5
          : 0
        ctx.fillStyle = `rgba(190,195,205,${alpha})`
        ctx.fillRect(x + dx, y + dy, 1.8 + alpha * 0.4, 1.8 + alpha * 0.4)
      }
      for (const { x, y, field } of samples) {
        if (field.distance > 0.15) continue
        const strength = Math.max(0, 1 - field.distance / 0.15)
        const wave = 0.72 + 0.28 * Math.sin(field.angle * 3 - phase)
        const threshold = (((x * 7 + y * 13) % 17) / 17) * 0.4
        const near =
          pointer && !reduced.matches
            ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 45)
            : 0
        const opacity = Math.min(
          1,
          Math.max(0, strength * wave - threshold) * 1.2 +
            near * strength * 0.4,
        )
        if (opacity < 0.035) continue
        const size = 1.9 + near * 0.65
        ctx.fillStyle = `rgba(164,169,178,${opacity})`
        ctx.fillRect(x, y, size, size)
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
      if (visible && !document.hidden && !reduced.matches)
        frame = requestAnimationFrame(tick)
      else draw()
    }
    function resize() {
      if (!canvas || !ctx) return
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      ctx.setTransform(canvas.width / 300, 0, 0, canvas.height / 300, 0, 0)
      draw()
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || reduced.matches) return
      const box = canvas!.getBoundingClientRect()
      if (box.width && box.height)
        pointer = {
          x: ((event.clientX - box.left) / box.width) * 300,
          y: ((event.clientY - box.top) / box.height) * 300,
        }
    }
    function leave() {
      pointer = null
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const sizes = new ResizeObserver(resize)
    observer.observe(canvas)
    sizes.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizes.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return <canvas ref={ref} className="pixel-orbit" aria-hidden="true" />
}
