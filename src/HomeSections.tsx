import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { events } from './events'
import { people, type Person } from './people'
import './home-sections.css'

/* ------------------------------------------------------------------ */
/* Utopia in numbers — every figure is derived from events.ts/people.ts */
/* ------------------------------------------------------------------ */

const firstNumber = (value?: string) => {
  const match = value?.replace(/[,\s]/g, '').match(/\d+/)
  return match ? Number(match[0]) : 0
}
const conferences = events.filter((event) => event.category === 'conferences')
const hackathons = events.filter((event) => event.category === 'hackathons')
const attendance = events.reduce(
  (sum, event) =>
    sum + firstNumber(event.stats?.attendees ?? event.stats?.participants),
  0,
)
// Only prize pools stated in euros are added up; the rest make it a lower bound.
const euroPrizes = hackathons.reduce(
  (sum, event) =>
    event.stats?.prizePool?.includes('€')
      ? sum + firstNumber(event.stats.prizePool)
      : sum,
  0,
)
const hackHours = hackathons.reduce(
  (sum, event) => sum + firstNumber(event.stats?.duration),
  0,
)
const guests = Object.keys(people).length
// The archive only lists some prize pools; the club's own count across all
// hackathons is at least this. Raise it when the real total is confirmed.
const PRIZE_FLOOR = 30000
const roundDown = (value: number, step: number) =>
  Math.floor(value / step) * step

const stats = [
  {
    value: events.length,
    // A few past events are not in the archive yet.
    suffix: '+',
    label: 'Events organised',
    detail: `${conferences.length} conferences · ${hackathons.length} hackathons`,
  },
  {
    value: roundDown(attendance, 100),
    suffix: '+',
    label: 'Attendees & participants',
    detail: 'Across talks, roundtables and builds',
  },
  {
    value: guests,
    suffix: '',
    label: 'Speakers, judges & mentors',
    detail: 'From startups, labs and industry',
  },
  {
    value: Math.max(PRIZE_FLOOR, roundDown(euroPrizes, 500)),
    suffix: '€+',
    label: 'In hackathon prizes',
    detail: `Over ${hackHours} hours of building`,
  },
]

const format = (value: number) => value.toLocaleString('en-US')

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const element = ref.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    setShown(0)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          // Ease-out expo: fast start, long settle on the real figure.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          setShown(Math.round(value * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])
  return (
    <span ref={ref} className="stat-value">
      <span aria-hidden="true">
        {format(shown)}
        <span className="stat-suffix">{suffix}</span>
      </span>
      <span className="visually-hidden">
        {format(value)}
        {suffix}
      </span>
    </span>
  )
}

export function UtopiaNumbers() {
  return (
    <section className="section numbers-section" aria-labelledby="numbers">
      <div className="section-heading">
        <h2 id="numbers">Utopia in numbers</h2>
      </div>
      <dl className="numbers-grid">
        {stats.map((stat) => (
          <div className="number-cell" key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className="stat-detail">{stat.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* People we've hosted — two slow, opposing rows of portraits           */
/* ------------------------------------------------------------------ */

type Guest = Person & { id: string }
const withPhotos: Guest[] = Object.entries(people)
  .map(([id, person]) => ({ id, ...(person as Person) }))
  .filter((person) => person.photo)
const half = Math.ceil(withPhotos.length / 2)
const rows = [withPhotos.slice(0, half), withPhotos.slice(half)]

function GuestCard({ guest, hidden }: { guest: Guest; hidden?: boolean }) {
  const content = (
    <>
      <img
        src={guest.photo}
        alt=""
        width="480"
        height="480"
        loading="lazy"
        decoding="async"
      />
      <span className="guest-name">{guest.name}</span>
      <span className="guest-title">{guest.title}</span>
    </>
  )
  return guest.linkedin ? (
    <a
      className="guest"
      href={guest.linkedin}
      target="_blank"
      rel="noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {content}
    </a>
  ) : (
    <div className="guest" aria-hidden={hidden || undefined}>
      {content}
    </div>
  )
}

export function PeopleWall() {
  return (
    <section className="section people-section" aria-labelledby="people">
      <div className="section-heading">
        <h2 id="people">People we’ve hosted</h2>
      </div>
      <div className="people-rows">
        {rows.map((row, index) => (
          <div
            className={`people-row${index ? ' people-row--reverse' : ''}`}
            key={index}
          >
            <div
              className="people-track"
              style={{ animationDuration: `${row.length * 3.2}s` }}
            >
              {row.map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
              {row.map((guest) => (
                <GuestCard key={`${guest.id}-loop`} guest={guest} hidden />
              ))}
            </div>
          </div>
        ))}
      </div>
      <a
        className="text-link people-link"
        href="/conferences"
        aria-label="Browse past conferences"
      >
        Browse past events <ArrowUpRight size={16} />
      </a>
    </section>
  )
}
