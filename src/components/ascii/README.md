# Reusable photographic ASCII background

`AsciiBackground` renders into an absolutely positioned canvas and includes a pause control. Its parent must establish a positioned container with a height. Load `src/ascii.css` for the canvas, photo fallback, and overlay styles.

```tsx
import AsciiBackground from './components/ascii/AsciiBackground'
import { ditherPulse, charactersWave } from './components/ascii/presets'

// Original square-pixel version, preserved for reuse:
<AsciiBackground src="/utopia-greek-art-dither-reference.webp" preset={ditherPulse} />

// New character-grid version:
<AsciiBackground src="/utopia-greek-art-dither-reference.webp" preset={charactersWave} />
```

The active hero preset is selected in `src/AsciiHero.tsx`.

Current selection: `ditherWave` — the new wave, brightness, contrast, bloom, and vignette treatment with the original 9px dither pixels and density 20. No character glyphs. `ditherPulse` still preserves the original version.

Both versions retain source colors, centered cover cropping, motion pause/offscreen handling, and reduced-motion support. The character preset uses 16px monospace glyphs from ` .:-=+*#%@`, brightness 12, contrast 115, wave speed 100/intensity 60, bloom 25 and vignette 38. Solid background is the site's near-black at 90% opacity (the supplied recipe omitted its color and had a malformed opacity field).

This is a local interpretation of the supplied recipes, not the original 21st.dev engine. Only the two active modes and their enabled effects are implemented. Density controls pixel fill in the dither mode; character density zero uses the unshifted luminance ramp. Full coverage, identity tone curve, source saturation, and disabled tint/blur/mask/lights are implicit. The CSS text-legibility overlay is separate from the recipe's vignette.
