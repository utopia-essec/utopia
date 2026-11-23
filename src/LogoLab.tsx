import { useEffect, useState, type ReactNode } from 'react'
import {
  Engraved,
  HorizonEngraved,
  HorizonRefined,
  OrbitIris,
  OrbitKepler,
  OrbitSpiral,
  OrbitTorus,
  OrbitWorld,
  OrbitWormhole,
  WorldMark,
  type Finish,
  type MarkProps,
  type WorldVariant,
} from './logoCosmos'
import type { Family } from './logoEngrave'
import { fields } from './logoEngrave'
import {
  FONTS,
  FONT_CSS,
  SansWordmark,
  type Case,
  type TypeSettings,
} from './logoType'
import './logo-lab.css'

type Variant = {
  id: string
  name: string
  note: string
  render: (p: MarkProps, finish: Finish) => ReactNode
  big?: boolean
  far?: boolean
}
type Group = {
  id: string
  label: string
  title: string
  intro: string
  variants: Variant[]
  finishable?: boolean
}

const eng =
  (field: keyof typeof fields, family?: Family) =>
  (p: MarkProps, finish: Finish) => (
    <Engraved field={field} family={family} finish={finish} {...p} />
  )

const wv = (variant: WorldVariant) => (p: MarkProps, finish: Finish) => (
  <WorldMark variant={variant} finish={finish} {...p} />
)

const groups: Group[] = [
  {
    id: 'world',
    label: 'A0 · New World',
    title: 'New World, eight ways',
    intro:
      'Your favourite, kept and pushed further. Every version is the same lit sphere in horizontal engraving; what changes is how the stripes behave: spaced out, sunk, shifted, cut or lit from behind. “Combined” is the suggested pairing of dissolve and missing piece.',
    finishable: true,
    variants: [
      {
        id: 'w-original',
        name: 'Original',
        note: 'The round-3 New World, for reference.',
        render: wv('original'),
      },
      {
        id: 'w-dissolve',
        name: 'Dissolve',
        note: 'Stripes grow thinner and further apart toward the bottom: solid at the top, slipping away below, like a dream fading as you wake.',
        render: wv('dissolve'),
      },
      {
        id: 'w-dissolve-cut',
        name: 'Combined: dissolve + missing piece',
        note: 'The suggested combination. It fades out, and a crescent-shaped channel is left out: an incomplete world, a place that isn’t quite there.',
        render: wv('dissolveCut'),
        big: true,
      },
      {
        id: 'w-horizon',
        name: 'Horizon',
        note: 'Half-sunk behind an invisible horizon, like a sun you can see but never reach. Below, the reflection drifts apart and breaks up like light on water.',
        render: wv('horizon'),
      },
      {
        id: 'w-mirage',
        name: 'Mirage',
        note: 'The lower stripes slip sideways like heat haze over a road. You can see it clearly, but it isn’t really there.',
        render: wv('mirage'),
      },
      {
        id: 'w-crescent',
        name: 'Missing piece',
        note: 'A crescent of stripes left out, so the sphere is incomplete. “No place”, and far more ownable than a plain striped sphere.',
        render: wv('crescent'),
      },
      {
        id: 'w-tilted',
        name: 'Axis',
        note: 'Stripes turned 23.5°, the tilt of Earth’s axis. A world in motion, less static than horizontal bands.',
        render: wv('tilted'),
      },
      {
        id: 'w-eclipse',
        name: 'Eclipse',
        note: 'Lit from behind: only the rim glows and the body is almost empty. A world about to appear.',
        render: wv('eclipse'),
      },
      {
        id: 'w-far',
        name: 'Far away (layout)',
        note: 'Distance through scale: the mark small, with lots of empty space around it, so it reads as somewhere far off. A layout rule rather than a new mark.',
        render: wv('dissolve'),
        far: true,
      },
    ],
  },
  {
    id: 'shapes',
    label: 'A1 · Engraved',
    title: 'Shapes that fade into being',
    intro:
      'One technique: engraved lines whose weight follows the light. Each form comes out of nothing and goes back into it, like a dream half-remembered. Same material, six subjects for “an ideal place”.',
    finishable: true,
    variants: [
      {
        id: 'e-galaxy',
        name: 'Galaxy',
        note: 'The round-2 nebula: many stars, one gravity.',
        render: eng('galaxy'),
      },
      {
        id: 'e-world',
        name: 'New World',
        note: 'A planet lit from one side; its night half dissolves. An ideal world, still being discovered.',
        render: eng('world'),
      },
      {
        id: 'e-dawn',
        name: 'Dawn',
        note: 'A sun rising out of still water. The reflection breaks up and fades: utopia as a horizon.',
        render: eng('dawn'),
      },
      {
        id: 'e-u',
        name: 'Dream U',
        note: 'The U of Utopia: solid at its base, dissolving as it rises. A monogram that is half real, half dream.',
        render: eng('dreamU'),
      },
      {
        id: 'e-halo',
        name: 'Halo',
        note: 'A ring with a bright head and a trail that fades to nothing. An orbit, a comet, a halo.',
        render: eng('halo'),
      },
    ],
  },
  {
    id: 'materials',
    label: 'A2 · Engraved',
    title: 'Six materials, one galaxy',
    intro:
      'The same density field drawn with different guide lines. Each changes the feel: banknote, silk, vinyl, sunburst, mist.',
    finishable: true,
    variants: [
      {
        id: 'm-horizontal',
        name: 'Etching',
        note: 'Horizontal engraving. Calm and classical; the closest to a banknote.',
        render: eng('galaxy', 'horizontal'),
      },
      {
        id: 'm-wave',
        name: 'Silk',
        note: 'Lines rippled by two slow waves, so the galaxy looks seen through water or heat haze.',
        render: eng('galaxy', 'wave'),
      },
      {
        id: 'm-concentric',
        name: 'Rings',
        note: 'Concentric circles: the galaxy appears as interference, like a ripple.',
        render: eng('galaxy', 'concentric'),
      },
      {
        id: 'm-groove',
        name: 'Groove',
        note: 'The whole image is a single spiral line, like a vinyl groove. One continuous path.',
        render: eng('galaxy', 'groove'),
      },
      {
        id: 'm-radial',
        name: 'Rays',
        note: 'Rays from the centre: light radiating out rather than lying flat.',
        render: eng('galaxy', 'radial'),
      },
      {
        id: 'm-dissolve',
        name: 'Mist',
        note: 'Lines break into dashes, then dots, then nothing. The most literal disappearing.',
        render: eng('galaxy', 'dissolve'),
      },
    ],
  },
  {
    id: 'finishes',
    label: 'A3 · Engraved',
    title: 'Finishes',
    intro:
      'Colour as light rather than flat fill. The mono version is still the master; these are for screens, posters and merch.',
    variants: (
      [
        ['ink', 'Ink', 'Pure mono, the master.'],
        ['dusk', 'Dusk', 'White fading into Utopia pink at the base.'],
        ['aurora', 'Aurora', 'Pink → lavender → ice blue.'],
        ['chrome', 'Chrome', 'Metallic bands, like foil-stamped print.'],
        ['ember', 'Ember', 'Warm peach to violet: dawn light.'],
        ['glow', 'Glow', 'Mono with a soft pink bloom (screen only).'],
      ] as [Finish, string, string][]
    ).map(([fin, name, note]) => ({
      id: `f-${fin}`,
      name,
      note,
      render: (p: MarkProps) => <Engraved field="dawn" finish={fin} {...p} />,
    })),
  },
  {
    id: 'horizon',
    label: 'B · Event Horizon',
    title: 'Event Horizon, rebuilt',
    intro:
      'Now closer to how a black hole really looks. The lensed light is heavy on top and thin underneath, the disk is brighter on its approaching side, and a fine pink photon ring sits on the edge of the void. Every crossing is a true knockout.',
    finishable: true,
    variants: [
      {
        id: 'h-vector',
        name: 'Horizon · vector',
        note: 'Solid master: a 24-unit lensed band on top and 10 below, a slim tapered disk heavier on the approaching side, and a 3-unit accent photon ring. Holds at 16 px.',
        render: (p) => <HorizonRefined {...p} />,
        big: true,
      },
      {
        id: 'h-etched',
        name: 'Horizon · etched',
        note: 'The same scene in the engraving technique: the disk becomes a few heavy strokes and the halo fades out.',
        render: (p, fin) => <HorizonEngraved finish={fin} {...p} />,
        big: true,
      },
      {
        id: 'h-rings',
        name: 'Horizon · rings',
        note: 'Engraved with concentric lines that follow the gravity well itself.',
        render: (p, fin) => (
          <HorizonEngraved family="concentric" finish={fin} {...p} />
        ),
        big: true,
      },
    ],
  },
  {
    id: 'orbits',
    label: 'C · Orbits',
    title: 'A simple shape from complex alignment',
    intro:
      'Many identical elements, each placed with one rule. No outline is drawn; the form you see is emergent, the way a community is. Strokes are kept at a safe weight so they render cleanly.',
    variants: [
      {
        id: 'o-iris',
        name: 'Iris',
        note: '72 straight chords, each spanning 150°. A perfect empty circle appears in the middle, never drawn.',
        render: (p) => <OrbitIris {...p} />,
      },
      {
        id: 'o-torus',
        name: 'Torus',
        note: '42 identical circles walked around an ellipse. A ring with a void appears in 3D.',
        render: (p) => <OrbitTorus {...p} />,
      },
      {
        id: 'o-kepler',
        name: 'Kepler',
        note: 'Real orbits share a focus, not a centre. 15 ellipses (e = 0.6) around one star.',
        render: (p) => <OrbitKepler {...p} />,
      },
      {
        id: 'o-wormhole',
        name: 'Wormhole',
        note: '30 circles shrinking along a curve: a tunnel toward a point of light.',
        render: (p) => <OrbitWormhole {...p} />,
      },
      {
        id: 'o-world',
        name: 'Meridians',
        note: 'A world drawn only by its lines of longitude, tilted 23.5° like Earth.',
        render: (p) => <OrbitWorld {...p} />,
      },
      {
        id: 'o-spiral',
        name: 'Spiral (round 2)',
        note: 'For reference: 34 ellipses turned 5.5° each.',
        render: (p) => <OrbitSpiral {...p} />,
      },
    ],
  },
]
const allVariants = groups.flatMap((g) =>
  g.variants.map((v) => ({ ...v, group: g.id })),
)

type Bg = 'night' | 'paper' | 'pink'
const BG: Record<Bg, { paper: string; ink: string; accent: string }> = {
  night: { paper: '#07080a', ink: '#eef0f3', accent: '#db8fca' },
  paper: { paper: '#efede7', ink: '#0d0e10', accent: '#b45ea1' },
  pink: { paper: '#db8fca', ink: '#0d0e10', accent: '#0d0e10' },
}
const FINISHES: Finish[] = ['ink', 'dusk', 'aurora', 'chrome', 'ember', 'glow']

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

function downloadSvg(
  el: Element | null,
  name: string,
  ink: string,
  accent: string,
) {
  const svg = el?.querySelector('svg')
  if (!svg) return
  const src = svg.outerHTML
    .replaceAll('var(--lab-accent)', accent)
    .replaceAll('currentColor', ink)
    .replace(/ class="[^"]*"/g, '')
  const url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `utopia-${name}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export default function LogoLab() {
  const [bg, setBg] = useState<Bg>(() => read('logo-lab3:bg', 'night'))
  const [mono, setMono] = useState<boolean>(() => read('logo-lab3:mono', false))
  const [motion, setMotion] = useState<boolean>(() =>
    read('logo-lab3:motion', true),
  )
  const [finish, setFinish] = useState<Finish>(() =>
    read('logo-lab3:finish', 'ink'),
  )
  const [type, setType] = useState<TypeSettings>(() =>
    read('logo-lab4:type', {
      font: 'geist',
      weight: 500,
      tracking: -0.02,
      case: 'title',
    }),
  )
  const setT = (patch: Partial<TypeSettings>) =>
    setType((t) => ({ ...t, ...patch }))
  const [stars, setStars] = useState<string[]>(() =>
    read('logo-lab3:stars', []),
  )
  const [selected, setSelected] = useState<string>(() =>
    read('logo-lab3:sel', 'e-galaxy'),
  )
  const [tray, setTray] = useState(true)

  useEffect(() => write('logo-lab3:bg', bg), [bg])
  useEffect(() => write('logo-lab3:mono', mono), [mono])
  useEffect(() => write('logo-lab3:motion', motion), [motion])
  useEffect(() => write('logo-lab3:finish', finish), [finish])
  useEffect(() => write('logo-lab4:type', type), [type])
  useEffect(() => write('logo-lab3:stars', stars), [stars])
  useEffect(() => write('logo-lab3:sel', selected), [selected])

  useEffect(() => {
    document.title = 'Logo lab · Utopia (local)'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_CSS
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  const palette = BG[bg]
  const accent = mono ? palette.ink : palette.accent
  const toggleStar = (id: string) =>
    setStars((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const sel = allVariants.find((v) => v.id === selected) ?? allVariants[0]
  const selFinish = groups.find((g) => g.id === sel.group)?.finishable
    ? finish
    : 'ink'
  const S = (p: MarkProps) => sel.render(p, selFinish)

  return (
    <div
      className={`lab${motion ? ' lab--motion' : ''}${tray ? ' lab--tray' : ''}`}
      style={
        {
          '--lab-paper': palette.paper,
          '--lab-ink': palette.ink,
          '--lab-accent': accent,
        } as React.CSSProperties
      }
    >
      <header className="lab-top">
        <p className="lab-kicker">Local only · /logo · round 04</p>
        <h1>
          Somewhere
          <br />
          between real
          <br />
          and dream.
        </h1>
        <div className="lab-brief">
          <p>
            Round 4 adds eight New World variations at the top. Below them,
            round 3 follows your notes. The engraving effect leads: forms that
            fade in and out of existence, like a memory or an ideal place you
            can almost see. It’s explored across shapes, materials and finishes.
            Event Horizon is rebuilt with more care, and Orbits branches into
            new structures.
          </p>
          <p>
            Pole Star, Portal and the parked marks are gone. A type tester for
            the wordmark sits just below. Click any mark to see it applied in
            the tray below, and star the ones worth keeping.
          </p>
        </div>
        <nav className="lab-controls" aria-label="Display options">
          <span className="lab-ctl-label">Ground</span>
          {(['night', 'paper', 'pink'] as Bg[]).map((b) => (
            <button key={b} aria-pressed={bg === b} onClick={() => setBg(b)}>
              {b}
            </button>
          ))}
          <button aria-pressed={mono} onClick={() => setMono((m) => !m)}>
            mono
          </button>
          <button aria-pressed={motion} onClick={() => setMotion((m) => !m)}>
            motion
          </button>
          <span className="lab-ctl-label">Finish</span>
          {FINISHES.map((fin) => (
            <button
              key={fin}
              aria-pressed={finish === fin}
              onClick={() => setFinish(fin)}
            >
              {fin}
            </button>
          ))}
          <span className="lab-shortlist">★ {stars.length}</span>
        </nav>
      </header>

      <section className="lab-group lab-type" id="type">
        <div className="lab-group-head">
          <p className="lab-kicker">Type · wordmark</p>
          <h2>Which sans-serif?</h2>
          <p>
            Fourteen quality sans-serifs, each shown with the mark you have
            selected ({sel.name}). Click one to use it everywhere. Weight,
            tracking and case apply to all of them; fonts clamp to their
            available weights. All are free for logo use (OFL).
          </p>
        </div>
        <div className="lab-type-controls">
          <label>
            <span className="lab-ctl-label">Weight {type.weight}</span>
            <input
              type="range"
              min={100}
              max={900}
              step={50}
              value={type.weight}
              onChange={(e) => setT({ weight: +e.target.value })}
            />
          </label>
          <label>
            <span className="lab-ctl-label">
              Tracking {type.tracking.toFixed(3)}em
            </span>
            <input
              type="range"
              min={-0.08}
              max={0.4}
              step={0.005}
              value={type.tracking}
              onChange={(e) => setT({ tracking: +e.target.value })}
            />
          </label>
          <span className="lab-type-case">
            <span className="lab-ctl-label">Case</span>
            {(
              [
                ['title', 'Utopia'],
                ['upper', 'UTOPIA'],
                ['lower', 'utopia'],
              ] as [Case, string][]
            ).map(([c, l]) => (
              <button
                key={c}
                aria-pressed={type.case === c}
                onClick={() => setT({ case: c })}
              >
                {l}
              </button>
            ))}
          </span>
        </div>
        <div className="lab-specimens">
          {FONTS.map((f) => (
            <button
              key={f.id}
              className="lab-specimen"
              aria-pressed={type.font === f.id}
              onClick={() => setT({ font: f.id })}
            >
              <span className="lab-lockup">
                {S({ size: 46, small: true })}
                <SansWordmark size={34} t={type} fontId={f.id} />
              </span>
              <span className="lab-specimen-meta">
                <b>{f.label}</b>
                <span>{f.note}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {groups.map((g) => (
        <section
          key={g.id}
          className={`lab-group lab-group--${g.id}`}
          id={g.id}
        >
          <div className="lab-group-head">
            <p className="lab-kicker">{g.label}</p>
            <h2>{g.title}</h2>
            <p>{g.intro}</p>
          </div>
          <div className="lab-tiles">
            {g.variants.map((v) => (
              <article
                key={v.id}
                className={[
                  'lab-tile',
                  v.big ? 'lab-tile--big' : '',
                  v.far ? 'lab-tile--far' : '',
                  stars.includes(v.id) ? 'is-starred' : '',
                  selected === v.id ? 'is-selected' : '',
                ].join(' ')}
              >
                <button
                  className="lab-tile-stage"
                  onClick={() => setSelected(v.id)}
                  aria-label={`Preview ${v.name} applied`}
                >
                  {v.render(
                    { size: 400, className: 'lab-tile-mark' },
                    g.finishable ? finish : 'ink',
                  )}
                </button>
                <div className="lab-tile-meta">
                  <h3>{v.name}</h3>
                  <button
                    className="lab-star"
                    onClick={() => toggleStar(v.id)}
                    aria-pressed={stars.includes(v.id)}
                    aria-label={
                      stars.includes(v.id)
                        ? 'Remove from shortlist'
                        : 'Add to shortlist'
                    }
                  >
                    {stars.includes(v.id) ? '★' : '☆'}
                  </button>
                </div>
                <p>{v.note}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className="lab-foot">
        Exploration files. Lockups use live fonts and would be outlined before
        final use. Gradient finishes need a mono master (provided). No trademark
        search done.
      </footer>

      <aside className="lab-tray" aria-label="Applied preview">
        <div className="lab-tray-bar">
          <span>
            Applied · <b>{sel.name}</b>
          </span>
          <span className="lab-tray-actions">
            <button
              onClick={(e) =>
                downloadSvg(
                  e.currentTarget
                    .closest('.lab-tray')
                    ?.querySelector('.lab-tray-hero') ?? null,
                  sel.id,
                  palette.ink,
                  accent,
                )
              }
            >
              Download SVG ↓
            </button>
            <button onClick={() => setTray((t) => !t)}>
              {tray ? 'Hide' : 'Show'}
            </button>
          </span>
        </div>
        {tray && (
          <div className="lab-tray-body">
            <div className="lab-app lab-tray-hero">{S({ size: 150 })}</div>
            <div className="lab-app">
              <span className="lab-lockup">
                {S({ size: 56, small: true })}
                <SansWordmark size={34} t={type} />
              </span>
            </div>
            <div className="lab-app">
              <span className="lab-stack">
                {S({ size: 96 })}
                <SansWordmark size={24} t={type} />
              </span>
            </div>
            <div className="lab-app lab-poster">
              <span className="lab-poster-mark">{S({ size: 280 })}</span>
              <span className="lab-poster-word">
                <SansWordmark size={16} t={type} />
              </span>
              <span className="lab-poster-meta">
                <b>Conference N°16</b>
                <span>ESSEC · Paris · 2026</span>
              </span>
            </div>
            <div className="lab-app lab-icons">
              <span className="lab-icon">{S({ size: 64, small: true })}</span>
              <span className="lab-avatar">{S({ size: 42, small: true })}</span>
              <span className="lab-sizes">
                {S({ size: 32, small: true })}
                {S({ size: 16, small: true })}
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
