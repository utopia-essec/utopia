import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react'
import AsciiHero from './AsciiHero'
import PixelField from './PixelField'
import PixelOrbit from './PixelOrbit'
import LogoStrip from './components/LogoStrip'
import EventsPage from './EventsPage'
import PageMetadata from './PageMetadata'
import UnaiteNetwork from './UnaiteNetwork'
import InterwovenLines from './InterwovenLines'
import ContactPage from './ContactPage'

const activities = [
  {
    number: '01',
    title: 'Conferences',
    type: 'CONFERENCES',
    text: 'Conversations with researchers, founders, and industry leaders on the technologies and decisions shaping AI.',
  },
  {
    number: '02',
    title: 'Hackathons',
    type: 'HACKATHONS',
    text: 'Bring technical and business perspectives together to build and test solutions to real-world challenges.',
  },
  {
    number: '03',
    title: 'Consulting',
    type: 'CONSULTING',
    text: 'Explore AI use cases and develop practical approaches to business challenges with our student community.',
  },
  {
    number: '04',
    title: 'Partnerships',
    type: 'PARTNERSHIPS',
    text: 'Work with Utopia on conferences, hackathons, and initiatives connecting students with the AI ecosystem.',
  },
]

const links = [
  ['Conferences', '/conferences'],
  ['Hackathons', '/hackathons'],
  ['About', '/#about'],
]

function Logo() {
  return (
    <a href="/" className="wordmark" aria-label="Utopia home">
      <img className="moon-logo" src="/utopia-moons.svg" alt="" />
      Utopia
    </a>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const path = window.location.pathname.replace(/\/$/, '')
  const archive =
    path === '/conferences'
      ? 'conferences'
      : path === '/hackathons'
        ? 'hackathons'
        : null
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.section-heading, .about > div, .activity-card, .highlights-grid > a, .join-section',
    )
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    elements.forEach((element) => {
      element.classList.add('reveal')
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      elements.forEach((element) => element.classList.remove('reveal'))
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])
  return (
    <>
      <PageMetadata />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={href === path ? 'page' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-cta"
          href="/contact"
          aria-current={path === '/contact' ? 'page' : undefined}
        >
          Contact us <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[...links, ['Contact us', '/contact']].map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={href === path ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      {path === '/contact' ? (
        <ContactPage />
      ) : archive ? (
        <EventsPage category={archive} />
      ) : (
        <main id="main">
          <section className="hero hero-ascii" aria-labelledby="hero-title">
            <AsciiHero />
            <div className="hero-layout">
              <div className="hero-copy">
                <h1 id="hero-title">
                  AI starts
                  <br />
                  with us
                </h1>
                <p>
                  A generation of curious minds.
                  <br />A shared ambition to build what comes next.
                  <br />
                  Welcome to Utopia.
                </p>
                <div className="hero-actions">
                  <a className="text-link" href="#activities">
                    Explore Utopia <ArrowDown size={16} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <LogoStrip />

          <section className="about section" id="about">
            <div className="collective-visual">
              <PixelOrbit />
            </div>
            <div>
              <h2>
                Connecting people
                <br />
                <span className="muted">Advancing AI</span>
              </h2>
              <div className="about-columns">
                <p>
                  Utopia is the AI association
                  <br />
                  of ESSEC Business School.
                </p>
                <div>
                  <p>
                    We bring students and the AI ecosystem together through
                    conferences, hackathons, consulting, workshops and company
                    partnerships.
                  </p>
                  <p>
                    Technical and non-technical members learn through hands-on
                    training, exchange ideas with industry leaders, and build
                    together.
                  </p>
                  <a
                    className="text-link"
                    href="https://www.linkedin.com/company/utopiaessec"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Meet our community <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="activities section" id="activities">
            <div className="section-heading">
              <div>
                <h2>What we do</h2>
              </div>
            </div>
            <div className="activity-grid">
              {activities.map((activity, index) => {
                const hasArchive =
                  activity.type === 'CONFERENCES' ||
                  activity.type === 'HACKATHONS'
                return (
                  <article
                    className="activity-card"
                    id={activity.type.toLowerCase()}
                    key={activity.number}
                  >
                    <PixelField
                      variant={
                        (['signal', 'grid', 'wave', 'converge'] as const)[index]
                      }
                    />
                    <h3>{activity.title}</h3>
                    <p>{activity.text}</p>
                    <a
                      className="text-link activity-link"
                      href={
                        hasArchive
                          ? `/${activity.type.toLowerCase()}`
                          : '/contact'
                      }
                    >
                      {hasArchive
                        ? 'See more'
                        : activity.type === 'PARTNERSHIPS'
                          ? 'Partner with us'
                          : 'Get in touch'}
                      <ArrowUpRight size={16} />
                    </a>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="highlights section" id="highlights">
            <div className="section-heading">
              <h2>Selected initiatives</h2>
              <a
                className="text-link"
                href="https://www.linkedin.com/company/utopiaessec/"
                target="_blank"
                rel="noreferrer"
              >
                Follow the latest <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="highlights-grid">
              <a
                className="feature-story"
                href="https://www.essec.edu/fr/actualites/etudiants-essec-assaut-intelligence-artificielle/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="story-art">
                  <div className="story-title">
                    A generation
                    <br />
                    shaping AI
                  </div>
                  <InterwovenLines />
                  <span className="story-caption">LEARN · CONNECT · BUILD</span>
                </div>
                <div className="story-info">
                  <div>
                    <h3>AI beyond the classroom</h3>
                    <p>
                      How Utopia and ESSEC’s student community turn curiosity
                      into learning, collaboration, and real-world AI projects.
                    </p>
                  </div>
                  <ArrowUpRight />
                </div>
              </a>
              <a
                className="network-story"
                href="https://metalab.essec.edu/education/associations/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="metalab-artwork">
                  <UnaiteNetwork />
                  <img
                    className="metalab-corner-logo"
                    src="/logos/essec-metalab-logo.png"
                    width="496"
                    height="107"
                    alt="ESSEC Metalab"
                    loading="lazy"
                  />
                </div>
                <div className="story-info">
                  <div>
                    <h3>A connected AI community</h3>
                    <p>
                      Utopia is the founding organization behind Unaite,
                      connecting AI student associations.
                    </p>
                  </div>
                  <ArrowUpRight />
                </div>
              </a>
            </div>
          </section>

          <section className="join-section" id="contact">
            <h2 id="join">
              Work with <span>Utopia</span>
            </h2>
            <div className="join-bottom">
              <p>
                Conferences, hackathons, consulting, and partnerships.
                <br />
                Get in touch with our team.
              </p>
              <a className="button button-light" href="/contact">
                Contact us <ArrowUpRight size={20} />
              </a>
            </div>
            <PixelField variant="wave" />
          </section>
        </main>
      )}

      <footer>
        <div className="footer-top">
          <Logo />
          <div>
            <a
              href="https://www.instagram.com/utopia.essec/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.linkedin.com/company/utopiaessec"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.youtube.com/@Utopia-ESSEC"
              target="_blank"
              rel="noreferrer"
            >
              YouTube <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Utopia · ESSEC Business School
          </span>
          <a href="#">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </footer>
    </>
  )
}
