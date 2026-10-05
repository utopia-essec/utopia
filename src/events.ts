// Imported from https://utopia-website-nine.vercel.app/data/events.json.
// Source category "event" is labeled Conferences on the original site.
// Training ("forma") is intentionally not included in either archive.
export type EventCategory = 'conferences' | 'hackathons'
export interface ClubEvent {
  id: string
  title: string
  date: string
  category: EventCategory
  image?: string
  url?: string
  description?: string
}
const origin = 'https://utopia-website-nine.vercel.app'
// Only verified event destinations belong here; never fall back to poster URLs.
const archiveLinks: Record<string, string> = {
  event_2: 'https://luma.com/68rouecy',
}
const conferences = [
  ['1', 'Future of AI', '2024-09-27'],
  ['2', 'IA à tout prix ?', '2024-10-15'],
  ['3', "L'IA en entreprise", '2024-10-31'],
  ['4', 'ARC Prize', '2024-11-26'],
  ['5', 'Conférence Inaugurale Unaite', '2024-12-02'],
  ['6', 'Meetup Alan', '2024-12-11'],
  ['7', 'Start From Scratch', '2025-01-22'],
  ['8', 'Table Ronde Droit et IA', '2025-01-27'],
  ['9', 'Unaite x Perplexity', '2025-02-11'],
  ['10', "Les Rôles Des Femmes Dans L'IA", '2025-02-20'],
  [
    '11',
    'Building Outliers: An Evening With Top French Founders',
    '2025-02-26',
  ],
  ['12', 'HealthCare x AI', '2025-03-12'],
]
const hackathons = [
  ['1', 'Spotlight: Consumer Edge Hack', '2024-11-22'],
  ['2', 'From LLM to Agentic AI Hackathon', '2025-04-04'],
]
export const events: ClubEvent[] = [
  {
    id: 'paris-builds-2026',
    title: 'Paris Builds',
    date: '2026-06-27',
    category: 'hackathons',
    url: 'https://luma.com/8ucy347o',
    description:
      '27–28 June in Paris. A 36-hour hackathon organized by Unaite with Y Combinator as a partner, featuring tracks in software for agents, robotics, and startup building.',
  },
  {
    id: 'ai-venture-sprint-2026',
    title: 'AI Venture Sprint',
    date: '2026-01-30',
    category: 'hackathons',
    description:
      'A six-hour no-code hackathon at ESSEC, organized with Utopia and supported by ESSEC Metalab. Teams built and pitched AI prototypes using Lovable, with a €500 prize pool.',
  },
  {
    id: 'secure-horizons-2026',
    title: 'Secure Horizons',
    date: '2026-10-10',
    category: 'hackathons',
    url: 'https://luma.com/cky3ka9w',
    description:
      '10–11 October at ESSEC Cergy. A 36-hour AI and cybersecurity hackathon organized by Utopia, Kryptosphère, and ESSEC Metalab.',
  },
  {
    id: 'echos-2050-2026',
    title: 'Echos of 2050',
    date: '2026-06-16',
    category: 'conferences',
    url: 'https://www.linkedin.com/posts/utopiaessec_echos-of-2050-is-back-what-will-our-world-activity-7468693187516268544-fdHg',
    description:
      'At Maison des ESSEC, Paris. AI, technological sovereignty, and societal transformations, with Club ESSEC Alumni Digital & Technology and in partnership with VivaTech.',
  },
  {
    id: 'investment-banking-2026',
    title: 'AI × Investment Banking',
    date: '2026-04-02',
    category: 'conferences',
    url: 'https://luma.com/wccsk0q4',
    description:
      'A roundtable co-organized with DAU’IA, featuring speakers from BNP Paribas, Société Générale, Goldman Sachs, and Blackroom.',
  },
  {
    id: 'kpmg-2026',
    title: 'AI in Action — KPMG',
    date: '2026-03-25',
    category: 'conferences',
    url: 'https://luma.com/yb94ic9k',
    description:
      'At KPMG La Défense, Tour Eqho, with ESCP AI Society. Exploring AI in audit, advisory, and cybersecurity with KPMG professionals.',
  },
  ...conferences.map(([id, title, date]): ClubEvent => ({
    id: `event_${id}`,
    title,
    date,
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_${id}.png`,
    url: archiveLinks[`event_${id}`],
  })),
  ...hackathons.map(([id, title, date]): ClubEvent => ({
    id: `hack_${id}`,
    title,
    date,
    category: 'hackathons',
    image: `${origin}/affiches/affiches_hack/hack_${id}.png`,
  })),
] satisfies ClubEvent[]
events.sort((a, b) => b.date.localeCompare(a.date))

export function getEvents(category: EventCategory) {
  return events.filter((event) => event.category === category)
}
