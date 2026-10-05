import { useEffect, useRef } from 'react'

// Asymmetric drifting pixel currents: no emblem, radial repetition, or outlines.
export default function ContactSignal() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0,
      height = 0,
      time = 0,
      frame = 0,
      last = 0,
      painted = 0
    let visible = false,
      hovering = false
    let targetX = 0,
      targetY = 0,
      offsetX = 0,
      offsetY = 0
    let cursorX = 0,
      cursorY = 0,
      hoverStrength = 0

    function draw() {
      if (!ctx || !width || !height) return
      ctx.clearRect(0, 0, width, height)
      const phase = reduced.matches ? 0.8 : time * 0.00035
      const scale = Math.min(width, height) * 0.43
      const cx = width / 2,
        cy = height / 2
      const clusters = [
        {
          x: -0.6 + Math.sin(phase * 0.6) * 0.12,
          y: 0.35,
          sx: 0.48,
          sy: 0.27,
          weight: 0.95,
        },
        {
          x: -0.05,
          y: -0.12 + Math.cos(phase * 0.7) * 0.12,
          sx: 0.38,
          sy: 0.43,
          weight: 1.05,
        },
        {
          x: 0.65 + Math.cos(phase * 0.4) * 0.14,
          y: -0.42,
          sx: 0.5,
          sy: 0.24,
          weight: 0.8,
        },
        {
          x: 0.55,
          y: 0.45 + Math.sin(phase * 0.8) * 0.1,
          sx: 0.22,
          sy: 0.18,
          weight: 0.4,
        },
      ]
      for (let y = 5; y < height - 5; y += 4) {
        for (let x = 5; x < width - 5; x += 4) {
          const nx = (x - cx - offsetX * 0.18) / scale
          const ny = (y - cy - offsetY * 0.18) / scale
          const warpedX = nx + Math.sin(ny * 3.7 + phase * 0.7) * 0.13
          const warpedY = ny + Math.sin(nx * 4.2 - phase * 0.5) * 0.12
          const field = clusters.reduce(
            (sum, cluster) =>
              sum +
              cluster.weight *
                Math.exp(
                  -(
                    ((warpedX - cluster.x) / cluster.sx) ** 2 +
                    ((warpedY - cluster.y) / cluster.sy) ** 2
                  ) * 1.5,
                ),
            0,
          )
          const texture =
            0.7 + 0.3 * Math.sin(warpedX * 12 + warpedY * 7 - phase * 1.4)
          const random = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
          const threshold = (random - Math.floor(random)) * 0.28
          const proximity = reduced.matches
            ? 0
            : Math.max(0, 1 - Math.hypot(x - cursorX, y - cursorY) / 65) *
              hoverStrength
          const edgeFade = Math.min(
            1,
            x / 24,
            y / 24,
            (width - x) / 24,
            (height - y) / 24,
          )
          const opacity =
            Math.min(1, Math.max(0, field * texture - threshold)) *
            (1 - proximity * 0.35) *
            edgeFade
          if (opacity < 0.06) continue
          const mix = 0.5 + 0.5 * Math.sin(nx * 2 - ny + phase * 0.3)
          ctx.fillStyle = `rgba(${Math.round(237 - mix * 9)},${Math.round(185 + mix * 47)},${Math.round(225 + mix * 17)},${opacity})`
          const distance = Math.max(1, Math.hypot(x - cursorX, y - cursorY))
          const scatterX = ((x - cursorX) / distance) * proximity * 12
          const scatterY = ((y - cursorY) / distance) * proximity * 12
          const size = 2 + opacity * 0.65
          ctx.fillRect(x + scatterX, y + scatterY, size, size)
        }
      }
    }
    function tick(now: number) {
      time += last ? Math.min(now - last, 100) : 0
      last = now
      if (now - painted >= 1000 / 30) {
        offsetX += ((hovering ? targetX : 0) - offsetX) * 0.07
        offsetY += ((hovering ? targetY : 0) - offsetY) * 0.07
        hoverStrength += ((hovering ? 1 : 0) - hoverStrength) * 0.12
        draw()
        painted = now
      }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      last = 0
      if (reduced.matches) {
        offsetX = 0
        offsetY = 0
      }
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
      draw()
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || reduced.matches) return
      const bounds = canvas!.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      hovering = true
      cursorX = event.clientX - bounds.left
      cursorY = event.clientY - bounds.top
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 32
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 32
    }
    function leave() {
      hovering = false
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return <canvas className="contact-signal" ref={ref} aria-hidden="true" />
}
