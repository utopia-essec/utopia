export interface AsciiPreset {
  renderMode: 'dither' | 'characters'
  cellSize: number
  brightness: number
  contrast: number
  saturation: number
  density: number
  bgMode: 'none' | 'solid'
  bgOpacity: number
  bgColor: string
  characters: string
  animStyle: 'pulse' | 'wave'
  animSpeed: number
  animIntensity: number
  bloom: number
  vignette: number
}

// Saved original: the square-pixel background approved during the first preview.
export const ditherPulse: AsciiPreset = {
  renderMode: 'dither',
  cellSize: 9,
  brightness: 0,
  contrast: 158,
  density: 20,
  saturation: 100,
  bgMode: 'none',
  bgOpacity: 90,
  bgColor: '#0b0d10',
  characters: ' .:-=+*#%@',
  animStyle: 'pulse',
  animSpeed: 100,
  animIntensity: 60,
  bloom: 0,
  vignette: 0,
}

// New recipe: standard characters, source colors, and a traveling wave.
// Coverage is 100%; no inversion, tint, blur, edge enhancement, mask, or lights.
export const charactersWave: AsciiPreset = {
  ...ditherPulse,
  renderMode: 'characters',
  cellSize: 16,
  brightness: 12,
  contrast: 115,
  density: 0,
  bgMode: 'solid',
  animStyle: 'wave',
  bloom: 25,
  vignette: 38,
}

// New background/motion treatment, retaining the original fine pixel texture.
export const ditherWave: AsciiPreset = {
  ...charactersWave,
  renderMode: 'dither',
  cellSize: ditherPulse.cellSize,
  density: ditherPulse.density,
}

export const conferenceDither: AsciiPreset = {
  ...ditherWave,
  saturation: 60,
}

export const hackathonDither: AsciiPreset = {
  ...ditherWave,
  brightness: 17,
}
