import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PixelField from './PixelField'
import { getEvents, type ClubEvent, type EventCategory } from './events'
import './events.css'
import AsciiBackground from './components/ascii/AsciiBackground'
import { conferenceDither, hackathonDither } from './components/ascii/presets'
import imageManifest from './event-images.json'

const previews: Record<
  string,
  { src: string; srcSet: string; width: number; height: number }
> = imageManifest

function EventCard({ event, index }: { event: ClubEvent; index: number }) {
  const [failed, setFailed] = useState(false)
  const preview = previews[event.id]
  const date = new Date(`${event.date}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const artwork = (
    <>
      {failed || (!preview && !event.image) ? (
        <div className="poster-fallback event-generated-cover">
          <PixelField
            variant={event.category === 'hackathons' ? 'grid' : 'signal'}
          />
          <h3>{event.title}</h3>
          {event.url && (
            <span>
              View event details <ArrowUpRight size={16} />
            </span>
          )}
        </div>
      ) : (
        <img
          src={preview?.src ?? event.image}
          srcSet={preview?.srcSet}
          sizes="(max-width: 700px) 90vw, (max-width: 1000px) 44vw, 29vw"
          width={preview?.width}
          height={preview?.height}
          alt={`Poster for ${event.title}`}
          loading={index < 3 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {event.url && (
        <span className="poster-open" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      )}
    </>
  )
  return (
    <article className="event-card">
      {event.url ? (
        <a
          className="event-poster"
          href={event.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${event.title}`}
        >
          {artwork}
        </a>
      ) : (
        <div className="event-poster">{artwork}</div>
      )}
      <div className="event-info">
        <time dateTime={event.date}>{date}</time>
        <h2>{event.title}</h2>
        {event.description && <p>{event.description}</p>}
      </div>
    </article>
  )
}

export default function EventsPage({ category }: { category: EventCategory }) {
  const conference = category === 'conferences'
  const title = conference ? 'Conferences' : 'Hackathons'
  const items = getEvents(category)
  return (
    <main id="main" className="events-page">
      <section
        className={`events-intro events-intro-ascii${conference ? ' events-intro-conferences' : ''}`}
      >
        <AsciiBackground
          src={
            conference
              ? '/utopia-conferences-philosophy-hero.webp'
              : '/utopia-hackathons-temple-hero.webp'
          }
          preset={conference ? conferenceDither : hackathonDither}
          showMotionControl={false}
          imageOffsetX={0.08}
          imageOffsetY={conference ? 0.15 : 0}
        />
        <div className="events-intro-layout">
          <div>
            <h1>{title}</h1>
            <p>
              {conference
                ? 'Conversations with the people shaping AI, business, and society.'
                : 'Bringing people together to build, experiment, and put AI into practice.'}
            </p>
          </div>
        </div>
      </section>
      <section className="event-archive" aria-label={`${title} newest first`}>
        <div className="archive-summary">
          <span>{items.length} events</span>
          <span>Newest first</span>
        </div>
        <div className="events-grid">
          {items.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </section>
      <section className="archive-contact">
        <h2>{conference ? 'Start a conversation' : 'Build with Utopia'}</h2>
        <a className="button button-light" href="/contact">
          Contact us <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  )
}
