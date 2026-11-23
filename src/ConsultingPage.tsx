import {
  Fragment,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { ArrowUpRight } from 'lucide-react'
import AsciiBackground from './components/ascii/AsciiBackground'
import { consultingDither } from './components/ascii/presets'
import { AuditScene, BuildScene, PriceScene } from './IsoScenes'
import './iso-scenes.css'
import PixelAssembly from './PixelAssembly'
import {
  AssistantScene,
  BoardScene,
  ContentScene,
  LeadScene,
  ProspectScene,
  QuoteScene,
  type SceneProps,
} from './UseCaseScenes'
import './events.css'
import './event-page.css'
import './consulting.css'
import './use-case-scenes.css'

const bookingUrl = 'https://calendly.com/epg-utopia/30min'

const values = [
  {
    title: 'We audit your processes',
    text: 'We look at how your team works today and identify where AI can save the most time.',
    Scene: AuditScene,
  },
  {
    title: 'We build a solution made for you',
    text: 'No off-the-shelf package: each solution is designed around your tools, your team, and your goals.',
    Scene: BuildScene,
  },
  {
    title: 'At prices below the market',
    text: 'As a student association, we deliver professional work at rates well below traditional agencies.',
    Scene: PriceScene,
  },
]

const useCases: {
  id: string
  category: string
  title: string
  text: string
  Scene: ComponentType<SceneProps>
}[] = [
  {
    id: 'lead-qualification',
    category: 'Sales',
    title: 'Lead qualification',
    text: 'A chatbot or WhatsApp assistant that qualifies inbound leads and sends them straight to your CRM.',
    Scene: LeadScene,
  },
  {
    id: 'automated-prospecting',
    category: 'Sales',
    title: 'Automated prospecting',
    text: 'Find, enrich, and contact the right prospects with personalized emails, without manual work.',
    Scene: ProspectScene,
  },
  {
    id: 'document-generation',
    category: 'Operations',
    title: 'Quote & document generation',
    text: 'Quotes, reports, and proposals generated automatically from your data in seconds.',
    Scene: QuoteScene,
  },
  {
    id: 'ai-assistant',
    category: 'Customer service',
    title: 'AI assistant',
    text: 'A chatbot on your website that answers customer questions 24/7.',
    Scene: AssistantScene,
  },
  {
    id: 'candidate-follow-up',
    category: 'Recruitment',
    title: 'Candidate follow-up',
    text: 'Automated, personalized follow-ups with candidates and tracking of placed profiles.',
    Scene: BoardScene,
  },
  {
    id: 'content-automation',
    category: 'Marketing',
    title: 'Content & ads automation',
    text: 'Publish social posts and ads in the right formats, on the right channels, automatically.',
    Scene: ContentScene,
  },
]

const steps = [
  {
    title: 'Free 30-min diagnostic',
    text: 'We map your processes and spot where AI saves the most time.',
    tag: 'Free · 30 min',
  },
  {
    title: 'Scoping & quote',
    text: 'A clear scope, timeline, and fixed price.',
    tag: 'Fixed price',
  },
  {
    title: 'Build',
    text: 'A mixed business/tech team of 4 delivers and iterates with you.',
    tag: 'Team of 4',
  },
  {
    title: 'Handover',
    text: 'Documentation, training, and follow-up so it keeps running.',
    tag: 'Docs + training',
  },
]

const cases = [
  {
    client: 'Coworking operator',
    delivered: [
      'Automated quote generation',
      'Abandoned-cart recovery',
      'Website chatbot',
    ],
  },
  {
    client: 'Recruitment agency',
    delivered: [
      'Automated candidate follow-up',
      'Monitoring of placed candidates',
    ],
  },
  {
    client: 'Housing startup',
    delivered: ['WhatsApp lead qualification', 'Connected to their CRM'],
  },
]

const facts = [
  ['Team', '4 people'],
  ['Profiles', 'Business + tech'],
  ['Schools', 'ESSEC × CentraleSupélec'],
  ['Pricing', 'Fixed, below market'],
]

// A mosaic stands in for each client name: the anonymity is part of the design.
function RedactedName({ seed }: { seed: number }) {
  const columns = 30
  const rows = 4
  return (
    <svg
      className="redacted-name"
      viewBox={`0 0 ${columns * 6} ${rows * 6}`}
      aria-hidden="true"
    >
      {Array.from({ length: columns * rows }, (_, index) => {
        const x = index % columns
        const y = Math.floor(index / columns)
        const value = ((x * 7 + y * 13 + seed * 5 + ((x * y) % 5)) % 17) / 17
        return (
          <rect
            key={index}
            x={x * 6}
            y={y * 6}
            width="6"
            height="6"
            opacity={(0.12 + value * 0.5).toFixed(2)}
          />
        )
      })}
    </svg>
  )
}

function UseCaseExplorer() {
  const [openId, setOpenId] = useState(useCases[0].id)
  // On wider screens the explorer tours the use cases until someone takes over.
  const [touring, setTouring] = useState(
    () => matchMedia('(min-width: 801px)').matches,
  )
  const [progress, setProgress] = useState(0)
  const hovering = useRef(false)
  function open(id: string, event: MouseEvent<HTMLButtonElement>) {
    const trigger = event.currentTarget
    setTouring(false)
    setOpenId(id)
    // In the stacked layout the panel above collapses, which can move the row away.
    if (matchMedia('(max-width: 800px)').matches)
      requestAnimationFrame(() => trigger.scrollIntoView({ block: 'nearest' }))
  }
  function showNext() {
    if (hovering.current) return
    setProgress(0)
    setOpenId((current) => {
      const index = useCases.findIndex((useCase) => useCase.id === current)
      return useCases[(index + 1) % useCases.length].id
    })
  }
  return (
    <div
      className="usecase-explorer"
      onPointerEnter={() => {
        hovering.current = true
      }}
      onPointerLeave={() => {
        hovering.current = false
      }}
      onFocus={() => setTouring(false)}
    >
      {useCases.map(({ id, category, title, text, Scene }) => {
        const isOpen = id === openId
        return (
          <Fragment key={id}>
            <h3 className="usecase-item">
              <button
                id={`usecase-${id}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`usecase-panel-${id}`}
                style={
                  { '--progress': touring ? progress : 1 } as CSSProperties
                }
                onClick={(event) => open(id, event)}
              >
                <span className="usecase-category">{category}</span>
                <span className="usecase-title">{title}</span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={`usecase-panel-${id}`}
                className="usecase-panel"
                role="region"
                aria-labelledby={`usecase-${id}`}
              >
                <div className="usecase-stage" aria-hidden="true">
                  <Scene
                    onProgress={touring ? setProgress : undefined}
                    onDone={touring ? showNext : undefined}
                  />
                </div>
                <p>{text}</p>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

// Dark and light meet through an ordered dither instead of a hard line.
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
function DitherEdge({ id, flip = false }: { id: string; flip?: boolean }) {
  const rows = 6
  return (
    <svg
      className={`dither-edge${flip ? ' dither-edge-flip' : ''}`}
      width="100%"
      height={rows * 6}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={id}
          width="24"
          height={rows * 6}
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: rows * 4 }, (_, index) => {
            const x = index % 4
            const y = Math.floor(index / 4)
            return (
              (bayer[(y % 4) * 4 + x] + 0.5) / 16 < (y + 0.5) / rows && (
                <rect key={index} x={x * 6} y={y * 6} width="6" height="6" />
              )
            )
          })}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Both marks are flattened to the same grey and height as the home logo row.
const schools = [
  { id: 'essec', name: 'ESSEC Business School', width: 727 },
  { id: 'centralesupelec', name: 'CentraleSupélec', width: 618 },
]

export default function ConsultingPage() {
  return (
    <main id="main" className="events-page consulting-page">
      <section className="events-intro events-intro-ascii">
        <AsciiBackground
          src="/utopia-consulting-counsel-hero.webp"
          preset={consultingDither}
          showMotionControl={false}
          imageOffsetY={0.5}
        />
        <div className="events-intro-layout">
          <div>
            <h1>Consulting</h1>
            <p>
              We help companies put AI to work — from first use case to a tool
              your team actually uses.
            </p>
            <div className="consulting-actions">
              <a
                className="button button-light"
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
              >
                Book a free diagnostic <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section school-strip"
        aria-label="Schools our consultants come from"
      >
        <div className="school-list">
          {schools.map((school, index) => (
            <Fragment key={school.id}>
              {index > 0 && (
                <span className="school-cross" aria-hidden="true">
                  ×
                </span>
              )}
              <img
                className={`school-logo school-logo--${school.id}`}
                src={`/logos/${school.id}-logo.webp`}
                width={school.width}
                height={320}
                alt={school.name}
              />
            </Fragment>
          ))}
        </div>
      </section>

      <section className="activities section consulting-values">
        <div className="section-heading">
          <h2>What we do</h2>
        </div>
        <div className="wwd-grid">
          {values.map(({ Scene, ...value }) => (
            <article className="wwd-card" key={value.title}>
              <div className="wwd-art">
                <Scene />
              </div>
              <div className="wwd-body">
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="use-cases">
        <div className="section-heading">
          <h2>Use cases</h2>
        </div>
        <UseCaseExplorer />
        <div className="usecase-cta">
          <a
            className="button button-light"
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
          >
            Book a free diagnostic <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <DitherEdge id="dither-into-light" />
      <section className="section section-light consulting-mission">
        <div className="section-heading">
          <h2>How a mission works</h2>
        </div>
        <ol className="mission-steps">
          {steps.map((step, index) => (
            <li className="mission-step" key={step.title}>
              <span className="mission-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mission-track" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="mission-tag">{step.tag}</span>
            </li>
          ))}
        </ol>
        <a
          className="button button-light mission-cta"
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
        >
          Book a free diagnostic <ArrowUpRight size={18} />
        </a>
      </section>
      <DitherEdge id="dither-out-of-light" flip />

      <section className="section consulting-work">
        <div className="section-heading">
          <h2>Selected work</h2>
          <p>Client names kept confidential</p>
        </div>
        <div className="case-list">
          {cases.map((item, index) => (
            <article className="case-row" key={item.client}>
              <div>
                <RedactedName seed={index + 1} />
                <h3>{item.client}</h3>
              </div>
              <ul>
                {item.delivered.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section consulting-who">
        <div>
          <h2>Who we are</h2>
          <p>
            Utopia’s consulting team: ESSEC × CentraleSupélec students working
            in teams of 4 that pair business and technical profiles.
          </p>
        </div>
        <dl className="detail-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="join-section consulting-cta">
        <div className="consulting-cta-copy">
          <h2>Let’s find your first AI use case</h2>
          <p>It starts with a free 30-minute diagnostic.</p>
          <div className="consulting-actions">
            <a
              className="button button-light"
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
            >
              Book a free diagnostic <ArrowUpRight size={20} />
            </a>
            <a className="text-link" href="/contact?topic=consulting">
              Or send us a message <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <PixelAssembly />
      </section>
    </main>
  )
}
