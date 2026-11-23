/*
 * Wordmark type tester for the /logo lab: a curated set of quality
 * sans-serifs (all free for logo use under the SIL Open Font License),
 * loaded from Google Fonts on the local-only page.
 */

export type Font = {
  id: string
  label: string
  family: string
  min: number
  max: number
  stretch?: string
  note: string
}

export const FONTS: Font[] = [
  {
    id: 'unbounded',
    label: 'Unbounded',
    family: "'Unbounded Variable'",
    min: 200,
    max: 900,
    note: 'Current. Wide, rounded, friendly.',
  },
  {
    id: 'geist',
    label: 'Geist',
    family: "'Geist'",
    min: 100,
    max: 900,
    note: 'Vercel’s Swiss-precise grotesk. Neutral, technical, very current.',
  },
  {
    id: 'inter-tight',
    label: 'Inter Tight',
    family: "'Inter Tight'",
    min: 100,
    max: 900,
    note: 'Inter, tightened for display. Calm and expensive when set light.',
  },
  {
    id: 'instrument-sans',
    label: 'Instrument Sans',
    family: "'Instrument Sans'",
    min: 400,
    max: 700,
    note: 'Sharp, slightly condensed, editorial. Pairs with the serif used in the lab.',
  },
  {
    id: 'bricolage',
    label: 'Bricolage Grotesque',
    family: "'Bricolage Grotesque'",
    min: 200,
    max: 800,
    note: 'French-flavoured grotesk with ink-trap character. Distinctive, warm.',
  },
  {
    id: 'syne',
    label: 'Syne',
    family: "'Syne'",
    min: 400,
    max: 800,
    note: 'Made for a Paris art centre. Gets wider and stranger as it gets bolder.',
  },
  {
    id: 'sora',
    label: 'Sora',
    family: "'Sora'",
    min: 100,
    max: 800,
    note: 'Geometric and open, made for a crypto/tech context. Futuristic but clean.',
  },
  {
    id: 'schibsted',
    label: 'Schibsted Grotesk',
    family: "'Schibsted Grotesk'",
    min: 400,
    max: 900,
    note: 'Newsroom grotesk with crisp, compact letters. Serious and confident.',
  },
  {
    id: 'familjen',
    label: 'Familjen Grotesk',
    family: "'Familjen Grotesk'",
    min: 400,
    max: 700,
    note: 'Scandinavian grotesk with quirky details (look at the a and t).',
  },
  {
    id: 'archivo-x',
    label: 'Archivo Expanded',
    family: "'Archivo'",
    min: 100,
    max: 900,
    stretch: '125%',
    note: 'Archivo at its widest: architectural and spacious, a premium-tech feel.',
  },
  {
    id: 'michroma',
    label: 'Michroma',
    family: "'Michroma'",
    min: 400,
    max: 400,
    note: 'Extended, squarish, aerospace. One weight only.',
  },
  {
    id: 'red-hat',
    label: 'Red Hat Display',
    family: "'Red Hat Display'",
    min: 300,
    max: 900,
    note: 'Rounded geometric with a soft humanist touch.',
  },
  {
    id: 'onest',
    label: 'Onest',
    family: "'Onest'",
    min: 100,
    max: 900,
    note: 'Contemporary, slightly soft grotesk; very legible small.',
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    family: "'Space Grotesk Variable'",
    min: 300,
    max: 700,
    note: 'The site’s body font. Mono-derived quirks.',
  },
]

export const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Mono' +
  '&family=Geist:wght@100..900&family=Inter+Tight:wght@100..900' +
  '&family=Instrument+Sans:wght@400..700&family=Bricolage+Grotesque:opsz,wght@12..96,200..800' +
  '&family=Syne:wght@400..800&family=Sora:wght@100..800&family=Schibsted+Grotesk:wght@400..900' +
  '&family=Familjen+Grotesk:wght@400..700&family=Archivo:wdth,wght@62..125,100..900' +
  '&family=Michroma&family=Red+Hat+Display:wght@300..900&family=Onest:wght@100..900&display=swap'

export type Case = 'title' | 'upper' | 'lower'
export type TypeSettings = {
  font: string
  weight: number
  tracking: number // em
  case: Case
}

export function SansWordmark({
  size = 40,
  t,
  fontId,
}: {
  size?: number
  t: TypeSettings
  fontId?: string
}) {
  const font = FONTS.find((f) => f.id === (fontId ?? t.font)) ?? FONTS[0]
  const weight = Math.min(font.max, Math.max(font.min, t.weight))
  const text =
    t.case === 'upper' ? 'UTOPIA' : t.case === 'lower' ? 'utopia' : 'Utopia'
  // caps read larger; shrink slightly so lockups stay balanced
  const fs = t.case === 'upper' ? size * 0.78 : size
  return (
    <span
      style={{
        fontFamily: `${font.family}, sans-serif`,
        fontWeight: weight,
        fontStretch: font.stretch,
        fontSize: fs,
        letterSpacing: `${t.tracking}em`,
        marginRight: `${-t.tracking}em`,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  )
}
