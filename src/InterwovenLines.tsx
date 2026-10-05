import { useEffect, useRef } from 'react'

export default function InterwovenLines() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const paths = [...svg.querySelectorAll<SVGPathElement>('[data-strand]')]
    const host = svg.parentElement!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0,
      last = 0,
      time = 0,
      painted = 0,
      pointer = 0,
      target = 0
    let visible = false
    function draw() {
      const phase = reduced.matches ? 0.6 : time * 0.00055
      paths.forEach((path, i) => {
        const ribbon = Math.floor(i / 12)
        const strand = (i % 12) - 5.5
        let d = ''
        for (let step = 0; step <= 100; step++) {
          const t = step / 100
          const envelope = Math.sin(Math.PI * t)
          const drift =
            Math.sin(t * Math.PI * 2 - phase + ribbon * Math.PI) * 24 * envelope
          const spread = strand * (3.2 + envelope * 2)
          const x = 255 + t * 240 + drift + spread
          const y =
            385 -
            t * 435 +
            drift * 0.48 +
            spread * 0.5 +
            (reduced.matches ? 0 : pointer * envelope * 9)
          d += `${step ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)} `
        }
        path.setAttribute('d', d)
      })
    }
    function tick(now: number) {
      time += last ? Math.min(now - last, 100) : 0
      last = now
      if (now - painted > 1000 / 30) {
        pointer += (target - pointer) * 0.07
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
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      const box = host.getBoundingClientRect()
      target = ((event.clientY - box.top) / box.height) * 2 - 1
    }
    function leave() {
      target = 0
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(svg)
    draw()
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return (
    <svg
      ref={ref}
      className="interwoven-lines"
      viewBox="0 0 560 335"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: 24 }, (_, i) => (
        <path
          key={i}
          data-strand
          stroke={i < 12 ? '#20232b' : '#505560'}
          strokeWidth={i % 4 === 0 ? '1.25' : '.8'}
          strokeLinecap="round"
          opacity={i < 12 ? '.85' : '.65'}
        />
      ))}
    </svg>
  )
}
