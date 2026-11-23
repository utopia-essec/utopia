import { useState, type ComponentType } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  ConferenceScene,
  ConsultingScene,
  HackathonScene,
  PartnershipScene,
} from './IsoScenes'
import './iso-scenes.css'
import './what-we-do.css'

interface Activity {
  number: string
  title: string
  id: string
  text: string
  href: string
  cta: string
  Scene: ComponentType
}

const activities: Activity[] = [
  {
    number: '01',
    title: 'Conferences',
    id: 'conferences',
    text: 'Conversations with researchers, founders, and industry leaders on the technologies and decisions shaping AI.',
    href: '/conferences',
    cta: 'See more',
    Scene: ConferenceScene,
  },
  {
    number: '02',
    title: 'Hackathons',
    id: 'hackathons',
    text: 'Bring technical and business perspectives together to build and test solutions to real-world challenges.',
    href: '/hackathons',
    cta: 'See more',
    Scene: HackathonScene,
  },
  {
    number: '03',
    title: 'Consulting',
    id: 'consulting',
    text: 'Explore AI use cases and develop practical approaches to business challenges with our student community.',
    href: '/consulting',
    cta: 'See more',
    Scene: ConsultingScene,
  },
  {
    number: '04',
    title: 'Partnerships',
    id: 'partnerships',
    text: 'Work with Utopia on conferences, hackathons, and initiatives connecting students with the AI ecosystem.',
    href: '/contact',
    cta: 'Partner with us',
    Scene: PartnershipScene,
  },
]

function Cta({ activity }: { activity: Activity }) {
  return (
    <a className="text-link activity-link" href={activity.href}>
      {activity.cta}
      <ArrowUpRight size={16} />
    </a>
  )
}

/* ---------- Expanding panels ---------- */

function Panels() {
  const [active, setActive] = useState(0)
  return (
    <div className="wwd-panels">
      {activities.map(({ Scene, ...activity }, index) => {
        const open = index === active
        return (
          <article
            className={`wwd-panel${open ? ' is-open' : ''}`}
            id={activity.id}
            key={activity.id}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <span className="wwd-index">{activity.number}</span>
            <div className="panel-art">
              <Scene />
            </div>
            <div className="panel-body">
              <h3>{activity.title}</h3>
              <div className="panel-reveal">
                <p>{activity.text}</p>
                <Cta activity={{ ...activity, Scene }} />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function WhatWeDo() {
  return (
    <section className="activities section wwd-section" id="activities">
      <div className="section-heading">
        <h2>What we do</h2>
      </div>
      <Panels />
    </section>
  )
}
