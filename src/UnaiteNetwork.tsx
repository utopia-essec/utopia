import { useEffect, useRef } from 'react'

// Full-resolution source silhouette with subtle whole-shape motion.

export default function UnaiteNetwork() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const host = canvas.parentElement!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      painted = 0,
      time = 0
    let visible = false
    let targetX = 0,
      targetY = 0,
      pointerX = 0,
      pointerY = 0
    let hover = 0,
      hoverTarget = 0
    let cursorX = 0,
      cursorY = 0
    let loaded = false
    let disposed = false
    const image = new Image()
    image.onload = () => {
      if (disposed) return
      loaded = true
      draw()
    }
    image.src = '/utopia-metalab-metamorph-sharp.webp'

    function draw() {
      if (!ctx || !loaded) return
      ctx.clearRect(0, 0, width, height)
      const phase = reduced.matches ? 0 : time * 0.00035
      const fit = Math.min(
        (width * 0.88) / image.naturalWidth,
        (height * 0.88) / image.naturalHeight,
      )
      const breath = reduced.matches ? 1 : 1 + Math.sin(phase) * 0.035
      const w = image.naturalWidth * fit * breath
      const h = image.naturalHeight * fit * breath
      ctx.save()
      ctx.translate(
        width / 2,
        height / 2 + (reduced.matches ? 0 : Math.sin(phase * 0.7) * 3),
      )
      ctx.rotate(
        reduced.matches ? 0 : Math.sin(phase * 0.7) * 0.065 + pointerX * 0.06,
      )
      ctx.translate(0, reduced.matches ? 0 : pointerY * 2)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(image, -w / 2, -h / 2, w, h)
      ctx.globalCompositeOperation = 'source-in'
      ctx.fillStyle = '#20232b'
      ctx.fillRect(-w / 2 - 2, -h / 2 - 2, w + 4, h + 4)
      ctx.restore()
      // Crisp local pixel cloud follows the pointer without blurring the artwork.
      if (hover > 0.01 && !reduced.matches) {
        ctx.save()
        const radius = 65
        const pitch = 7
        for (
          let y = Math.max(0, Math.floor((cursorY - radius) / pitch) * pitch);
          y < Math.min(height, cursorY + radius);
          y += pitch
        ) {
          for (
            let x = Math.max(0, Math.floor((cursorX - radius) / pitch) * pitch);
            x < Math.min(width, cursorX + radius);
            x += pitch
          ) {
            const proximity = Math.max(
              0,
              1 - Math.hypot(x - cursorX, y - cursorY) / radius,
            )
            const shimmer =
              0.65 + 0.35 * Math.sin(x * 0.12 + y * 0.09 - phase * 3)
            const strength = proximity * hover * shimmer
            if (strength < 0.06) continue
            ctx.fillStyle = `rgba(20,23,30,${strength * 0.8})`
            const size = 1.2 + strength * 2.5
            ctx.fillRect(x, y, size, size)
          }
        }
        ctx.restore()
      }
    }
    function tick(now: number) {
      time += last ? Math.min(now - last, 100) : 0
      last = now
      if (now - painted >= 1000 / 30) {
        pointerX += (targetX - pointerX) * 0.07
        pointerY += (targetY - pointerY) * 0.07
        hover += (hoverTarget - hover) * 0.12
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
      const box = canvas!.getBoundingClientRect()
      if (!box.width || !box.height) return
      cursorX = event.clientX - box.left
      cursorY = event.clientY - box.top
      hoverTarget =
        cursorX >= 0 &&
        cursorX <= box.width &&
        cursorY >= 0 &&
        cursorY <= box.height
          ? 1
          : 0
      targetX = ((event.clientX - box.left) / box.width) * 2 - 1
      targetY = ((event.clientY - box.top) / box.height) * 2 - 1
    }
    function leave() {
      targetX = 0
      targetY = 0
      hoverTarget = 0
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    resize()
    return () => {
      disposed = true
      image.onload = null
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return <canvas ref={ref} className="unaite-network" aria-hidden="true" />
}
