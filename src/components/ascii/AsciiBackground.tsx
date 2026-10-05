import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { ditherPulse, type AsciiPreset } from './presets'

// Ordered dithering preserves stable spatial detail instead of random flicker.
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const clamp = (value: number) => Math.max(0, Math.min(255, value))

export default function AsciiBackground({
  src,
  preset: recipe = ditherPulse,
  showMotionControl = true,
  imageOffsetX = 0,
  imageOffsetY = 0,
}: {
  src: string
  preset?: AsciiPreset
  showMotionControl?: boolean
  imageOffsetX?: number
  imageOffsetY?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const surface = document.createElement('canvas')
    const sample = surface.getContext('2d', { willReadFrequently: true })
    const layer = document.createElement('canvas')
    const paint = layer.getContext('2d')
    if (!sample || !paint) return
    setReady(false)
    setFailed(false)
    const image = new Image()
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stopped = false
    let visible = false
    let frame = 0
    let width = 0
    let height = 0
    let cells: {
      x: number
      y: number
      r: number
      g: number
      b: number
      luminance: number
    }[] = []
    let lastTime = 0
    let elapsed = 0
    let lastPaint = 0
    const contrast =
      (259 * (recipe.contrast + 255)) / (255 * (259 - recipe.contrast))

    function draw(time: number) {
      if (!context || !paint) return
      context.clearRect(0, 0, width, height)
      paint.clearRect(0, 0, width, height)
      if (recipe.bgMode === 'solid') {
        context.globalAlpha = recipe.bgOpacity / 100
        context.fillStyle = recipe.bgColor
        context.fillRect(0, 0, width, height)
        context.globalAlpha = 1
      }
      paint.font = `${recipe.cellSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      paint.textAlign = 'center'
      paint.textBaseline = 'middle'
      // A restrained, continuous pulse; speed 100 maps to a six-second cycle.
      const pulse = preference.matches
        ? 1
        : 1 +
          ((Math.sin((time * Math.PI * 2) / ((6000 * 100) / recipe.animSpeed)) *
            recipe.animIntensity) /
            100) *
            0.2
      for (const cell of cells) {
        const phase = (time * Math.PI * 2) / ((6000 * 100) / recipe.animSpeed)
        const wave = preference.matches
          ? 0
          : (Math.sin(cell.x / 150 + cell.y / 210 - phase) *
              recipe.animIntensity) /
            100
        const light = Math.max(
          0,
          Math.min(
            1,
            cell.luminance *
              (recipe.animStyle === 'pulse' ? pulse : 1 + wave * 0.2),
          ),
        )
        paint.fillStyle = `rgb(${cell.r} ${cell.g} ${cell.b})`
        if (recipe.renderMode === 'characters') {
          const glyph =
            recipe.characters[
              Math.min(
                recipe.characters.length - 1,
                Math.floor(light * recipe.characters.length),
              )
            ]
          paint.fillText(
            glyph,
            cell.x + recipe.cellSize / 2,
            cell.y + recipe.cellSize / 2 + wave * recipe.cellSize * 0.12,
          )
          continue
        }
        const pitch = recipe.cellSize / 4
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            if (light > (bayer[y * 4 + x] + 0.5) / 16) {
              const size = pitch * (0.65 + (recipe.density / 100) * 0.35)
              paint.fillRect(cell.x + x * pitch, cell.y + y * pitch, size, size)
            }
          }
        }
      }
      context.drawImage(layer, 0, 0, width, height)
      if (recipe.bloom > 0) {
        context.save()
        context.globalCompositeOperation = 'screen'
        context.globalAlpha = recipe.bloom / 100
        context.filter = 'blur(5px)'
        context.drawImage(layer, 0, 0, width, height)
        context.restore()
      }
      if (recipe.vignette > 0) {
        const shade = context.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.15,
          width / 2,
          height / 2,
          Math.hypot(width, height) / 2,
        )
        shade.addColorStop(0, 'transparent')
        shade.addColorStop(1, `rgb(0 0 0 / ${recipe.vignette / 100})`)
        context.fillStyle = shade
        context.fillRect(0, 0, width, height)
      }
    }

    function tick(now: number) {
      if (stopped) return
      elapsed += lastTime ? Math.min(now - lastTime, 100) : 0
      lastTime = now
      if (now - lastPaint >= 1000 / 24) {
        draw(elapsed)
        lastPaint = now
      }
      frame = requestAnimationFrame(tick)
    }

    function syncMotion() {
      cancelAnimationFrame(frame)
      lastTime = 0
      setReduced(preference.matches)
      if (
        cells.length &&
        visible &&
        !document.hidden &&
        !paused &&
        !preference.matches
      ) {
        frame = requestAnimationFrame(tick)
      } else if (cells.length) draw(preference.matches ? 0 : elapsed)
    }

    function resize() {
      if (stopped || !canvas || !sample || !context || !image.naturalWidth)
        return
      width = Math.round(canvas.clientWidth)
      height = Math.round(canvas.clientHeight)
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      layer.width = canvas.width
      layer.height = canvas.height
      paint!.setTransform(dpr, 0, 0, dpr, 0, 0)
      surface.width = width
      surface.height = height
      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight,
      )
      sample.drawImage(
        image,
        (width - image.naturalWidth * scale) / 2 + width * imageOffsetX,
        (height - image.naturalHeight * scale) / 2 + height * imageOffsetY,
        image.naturalWidth * scale,
        image.naturalHeight * scale,
      )
      const pixels = sample.getImageData(0, 0, width, height).data
      cells = []
      for (let y = 0; y < height; y += recipe.cellSize) {
        for (let x = 0; x < width; x += recipe.cellSize) {
          let r = 0,
            g = 0,
            b = 0,
            count = 0
          for (let sy = y; sy < Math.min(y + recipe.cellSize, height); sy++) {
            for (let sx = x; sx < Math.min(x + recipe.cellSize, width); sx++) {
              const offset = (sy * width + sx) * 4
              r += pixels[offset]
              g += pixels[offset + 1]
              b += pixels[offset + 2]
              count++
            }
          }
          const brightness = (recipe.brightness / 100) * 255
          r = clamp(contrast * (clamp(r / count + brightness) - 128) + 128)
          g = clamp(contrast * (clamp(g / count + brightness) - 128) + 128)
          b = clamp(contrast * (clamp(b / count + brightness) - 128) + 128)
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
          const saturation = recipe.saturation / 100
          r = clamp(luminance + (r - luminance) * saturation)
          g = clamp(luminance + (g - luminance) * saturation)
          b = clamp(luminance + (b - luminance) * saturation)
          cells.push({
            x,
            y,
            r: Math.round(r),
            g: Math.round(g),
            b: Math.round(b),
            luminance: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255,
          })
        }
      }
      draw(elapsed)
      setReady(true)
      syncMotion()
    }

    image.onload = () => {
      try {
        resize()
      } catch {
        setFailed(true)
      }
    }
    image.onerror = () => {
      if (!stopped) setFailed(true)
    }
    image.src = src
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncMotion()
    })
    observer.observe(canvas)
    preference.addEventListener('change', syncMotion)
    document.addEventListener('visibilitychange', syncMotion)
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      observer.disconnect()
      preference.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncMotion)
      image.onload = null
      image.onerror = null
    }
  }, [paused, recipe, src, imageOffsetX, imageOffsetY])

  return (
    <>
      <div className="ascii-scene" aria-hidden="true">
        <img
          className={`ascii-fallback ${ready && !failed ? 'is-rendered' : ''}`}
          style={{
            transform: `translate(${imageOffsetX * 100}%, ${imageOffsetY * 100}%)`,
            filter: `saturate(${recipe.saturation}%)`,
          }}
          src={src}
          alt=""
        />
        <canvas ref={canvasRef} className="ascii-canvas" />
      </div>
      {showMotionControl && !failed && !reduced && (
        <button
          className="ascii-control"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Play hero animation' : 'Pause hero animation'}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>{paused ? 'Play motion' : 'Pause motion'}</span>
        </button>
      )}
    </>
  )
}
