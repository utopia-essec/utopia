import { useEffect, useState, type KeyboardEvent } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
} from 'lucide-react'
import { formatEventDate, type ClubEvent } from './events'
import { peopleLabel, resolvePeople, roleName } from './people'
import imageManifest from './event-images.json'
import './event-page.css'

const previews: Record<string, { src: string; srcSet: string }> = imageManifest

// LinkedIn brand mark (Simple Icons, CC0); Lucide's outline version is hard to recognize.
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

type Tab = 'overview' | 'prizes' | 'people' | 'photos'

function status({ date, endDate }: ClubEvent) {
  const today = new Date().toLocaleDateString('en-CA')
  if (today < date) return 'Upcoming'
  if (today <= (endDate ?? date)) return 'Happening now'
  return 'Finished'
}

export default function EventPage({ event }: { event: ClubEvent }) {
  const people = resolvePeople(event.people)
  const tabs = (
    [
      ['overview', 'Overview', true],
      ['prizes', 'Prizes', !!event.prizes?.length],
      ['people', peopleLabel(event.people ?? []), people.length > 0],
      ['photos', 'Photos', !!event.photos?.length],
    ] as const
  ).filter(([, , visible]) => visible)
  const tabFromHash = () => {
    const hash = window.location.hash.slice(1)
    return tabs.some(([id]) => id === hash) ? (hash as Tab) : 'overview'
  }
  const [tab, setTab] = useState<Tab>(tabFromHash)
  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  })
  const select = (id: Tab) => {
    setTab(id)
    const { pathname } = window.location
    history.replaceState(null, '', id === 'overview' ? pathname : `#${id}`)
  }
  const onKeyDown = (keyEvent: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[keyEvent.key]
    if (!step) return
    const index = tabs.findIndex(([id]) => id === tab)
    const [next] = tabs[(index + step + tabs.length) % tabs.length]
    select(next)
    document.getElementById(`tab-${next}`)?.focus()
  }
  const stats =
    event.category === 'hackathons'
      ? ([
          ['Duration', event.stats?.duration],
          ['Participants', event.stats?.participants],
          ['Prize pool', event.stats?.prizePool],
          [
            'Tracks',
            event.stats?.tracks ?? (event.tracks?.length || undefined),
          ],
        ] as const)
      : ([
          ['Format', event.stats?.format],
          ['Speakers', event.stats?.speakers ?? (people.length || undefined)],
          ['Attendees', event.stats?.attendees],
          ['Language', event.stats?.language],
        ] as const)
  // Only partners are shown; other credit groups are kept in the data for later.
  const credits = event.credits?.filter((group) => group.label === 'Partners')
  const preview = previews[event.id]
  const poster = preview?.src ?? event.image
  const overview =
    event.overview ?? (event.description ? [event.description] : [])

  return (
    <main id="main" className="detail-page">
      <aside className="detail-sidebar">
        <a className="detail-back" href={`/${event.category}`}>
          <ArrowLeft size={16} /> All {event.category}
        </a>
        {poster && (
          <img
            className="detail-poster"
            src={poster}
            srcSet={preview?.srcSet}
            sizes="(max-width: 900px) 90vw, 360px"
            alt={`Poster for ${event.title}`}
          />
        )}
        <span className="detail-status">{status(event)}</span>
        <h1>{event.title}</h1>
        <ul className="detail-meta">
          <li>
            <CalendarDays size={16} />
            <time dateTime={event.date}>{formatEventDate(event)}</time>
          </li>
          {event.time && (
            <li>
              <Clock size={16} />
              {event.time}
            </li>
          )}
          {event.location && (
            <li>
              <MapPin size={16} />
              <span>
                <a
                  className="detail-address"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([event.location, event.address].filter(Boolean).join(', '))}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${event.location} in Google Maps`}
                >
                  {event.location}
                  <ArrowUpRight size={14} />
                </a>
                {event.address && <small>{event.address}</small>}
              </span>
            </li>
          )}
        </ul>
        <dl className="detail-facts">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>
        {!!event.links?.length && (
          <div className="detail-links">
            {event.links.map((link) => (
              <a
                key={link.url}
                className="button button-light"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        )}
      </aside>

      <div className="detail-content">
        {tabs.length > 1 && (
          <div
            className="detail-tabs"
            role="tablist"
            aria-label={`${event.title} details`}
            onKeyDown={onKeyDown}
          >
            {tabs.map(([id, label]) => (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls="detail-panel"
                tabIndex={tab === id ? 0 : -1}
                onClick={() => select(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <section
          id="detail-panel"
          className="detail-panel"
          role={tabs.length > 1 ? 'tabpanel' : undefined}
          aria-labelledby={tabs.length > 1 ? `tab-${tab}` : undefined}
        >
          {tab === 'overview' && (
            <div className="detail-overview">
              {overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {!!event.tracks?.length && (
                <>
                  <h2>Tracks</h2>
                  <ol className="track-list">
                    {event.tracks.map((track) => (
                      <li key={track.name}>
                        <h3>{track.name}</h3>
                        {track.detail && <p>{track.detail}</p>}
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {event.sections?.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.list ? (
                    <ul className="agenda-list">
                      {section.items.map((item) => (
                        <li key={item.name}>
                          <strong>{item.name}</strong>
                          {item.detail && ` — ${item.detail}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="track-list">
                      {section.items.map((item) => (
                        <li key={item.name}>
                          <h3>{item.name}</h3>
                          {item.detail && <p>{item.detail}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              {credits?.map((group) => (
                <section key={group.label}>
                  <h2>{group.label}</h2>
                  <p className="detail-partners">{group.names.join(' · ')}</p>
                </section>
              ))}
              {event.note && <p className="detail-note">{event.note}</p>}
            </div>
          )}
          {tab === 'prizes' && (
            <div className="prize-grid">
              {event.prizes?.map((prize) => (
                <article key={prize.amount} className="prize-card">
                  <span>{prize.label}</span>
                  <strong>{prize.amount}</strong>
                  {prize.detail && <p>{prize.detail}</p>}
                </article>
              ))}
            </div>
          )}
          {tab === 'people' && (
            <div className="judge-grid">
              {people.map((person) => (
                <article key={person.id} className="judge-card">
                  <div className="person-photo">
                    {person.photo ? (
                      <img src={person.photo} alt="" loading="lazy" />
                    ) : (
                      <span className="judge-initials" aria-hidden="true">
                        {person.name
                          .split(' ')
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <ul className="person-roles">
                    {person.roles.map((role) => (
                      <li key={role}>{roleName(role)}</li>
                    ))}
                  </ul>
                  <div className="person-name">
                    <h2>{person.name}</h2>
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${person.name} on LinkedIn`}
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                  </div>
                  <p>{person.title}</p>
                </article>
              ))}
            </div>
          )}
          {tab === 'photos' && (
            <div className="photo-grid">
              {event.photos?.map((photo) => (
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
