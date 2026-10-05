import { useEffect, useRef } from 'react'

type Variant = 'wave' | 'converge' | 'signal' | 'grid'
const points = Array.from({ length: 48 * 24 }, (_, index) => ({
  x: index % 48,
  y: Math.floor(index / 48),
}))

function intensity(x: number, y: number, variant: Variant, phase: number) {
  const dx = (x - 24) / 24
  const dy = (y - 12) / 12
  if (variant === 'converge')
    return Math.pow(
      Math.max(
        0,
        1 - Math.abs(Math.hypot(dx, dy) - (0.62 + Math.sin(phase) * 0.09)) * 4,
      ),
      2,
    )
  if (variant === 'signal')
    return Math.max(0, 1 - Math.abs(dy - Math.sin(x * 0.25 - phase) * 0.45) * 3)
  if (variant === 'grid')
    return (
      (x % 12 < 8 && y % 8 < 5 ? 0.65 : 0.08) *
      (1 - Math.abs(dx) * 0.6) *
      (0.8 + 0.2 * Math.cos(phase - Math.floor(x / 12) - Math.floor(y / 8)))
    )
  return (
    Math.max(0, Math.sin(x * 0.12 + y * 0.2 - phase)) * (1 - Math.abs(dy) * 0.6)
  )
}

export default function PixelField({
  variant = 'wave',
}: {
  variant?: Variant
}) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current
    const host = svg?.parentElement
    if (!svg || !host) return
    const rects = Array.from(svg.querySelectorAll('rect'))
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let frame = 0
    let previous = 0
    let phase = 0
    let painted = 0
    let pointer: { x: number; y: number } | null = null
    const draw = () => {
      points.forEach(({ x, y }, index) => {
        let value = intensity(x, y, variant, motion.matches ? 0 : phase)
        if (pointer && !motion.matches)
          value +=
            Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 9) * 0.35
        const threshold = ((x * 7 + y * 13) % 17) / 17
        // Feather the threshold slightly for a continuous shimmer rather than flicker.
        const opacity =
          Math.max(0, Math.min(1, (value - threshold) * 5)) *
          (0.25 + value * 0.7)
        rects[index].setAttribute('opacity', Math.min(1, opacity).toFixed(2))
      })
    }
    const tick = (now: number) => {
      phase += previous ? Math.min(now - previous, 100) * 0.00045 : 0
      previous = now
      if (now - painted > 1000 / 24) {
        draw()
        painted = now
      }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      previous = 0
      if (motion.matches) draw()
      else if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || motion.matches) return
      // Screen-to-SVG conversion includes rotation, scaling, and letterboxing.
      const matrix = svg.getScreenCTM()
      if (!matrix) return
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        matrix.inverse(),
      )
      pointer = { x: point.x / 6, y: point.y / 6 }
    }
    const leave = () => {
      pointer = null
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(svg)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    draw()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [variant])
  return (
    <svg
      ref={ref}
      className="pixel-field"
      viewBox="0 0 288 144"
      fill="currentColor"
      aria-hidden="true"
    >
      {points.map(({ x, y }) => (
        <rect
          key={`${x}-${y}`}
          x={x * 6}
          y={y * 6}
          width="2.5"
          height="2.5"
          opacity={0}
        />
      ))}
    </svg>
  )
}
