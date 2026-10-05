import AsciiBackground from './components/ascii/AsciiBackground'
import { ditherWave } from './components/ascii/presets'

export default function AsciiHero() {
  return (
    <AsciiBackground
      src="/utopia-essec-ai-hero.webp"
      preset={ditherWave}
      showMotionControl={false}
      imageOffsetX={0.08}
    />
  )
}
