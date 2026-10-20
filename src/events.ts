// Imported from https://utopia-website-nine.vercel.app/data/events.json.
// Source category "event" is labeled Conferences on the original site.
// Training ("forma") is intentionally not included in either archive.
import type { EventPerson } from './people'

export type EventCategory = 'conferences' | 'hackathons'
export interface Prize {
  label: string
  amount: string
  detail?: string
}
export interface ClubEvent {
  id: string
  title: string
  date: string
  // Last day for multi-day events, e.g. a 36-hour hackathon.
  endDate?: string
  category: EventCategory
  image?: string
  url?: string
  description?: string
  // Hackathons with a slug get their own page at /hackathons/<slug>.
  // Each one also needs an entry in src/seo.json.
  slug?: string
  location?: string
  address?: string
  time?: string
  // The same four numbers are shown for every hackathon; leave one out to show "—".
  stats?: {
    duration?: string
    participants?: string
    prizePool?: string
    // Defaults to the number of tracks listed below.
    tracks?: string
  }
  overview?: string[]
  tracks?: { name: string; detail?: string }[]
  // Extra lists under the overview, e.g. challenges, mentors, judging criteria.
  sections?: { title: string; items: { name: string; detail?: string }[] }[]
  // Organizers, partners, and sponsors as plain names, grouped as on the poster.
  // Names can later be mapped to logo files.
  credits?: { label: string; names: string[] }[]
  // Small print under the overview, e.g. funding acknowledgements.
  note?: string
  prizes?: Prize[]
  // Judges, mentors, speakers… defined once in src/people.ts.
  people?: EventPerson[]
  photos?: { src: string; alt: string }[]
  links?: { label: string; url: string }[]
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
export const events: ClubEvent[] = [
  {
    id: 'paris-builds-2026',
    title: 'Paris Builds',
    date: '2026-06-27',
    endDate: '2026-06-28',
    category: 'hackathons',
    url: 'https://luma.com/8ucy347o',
    slug: 'paris-builds',
    location: 'Stephenson Harwood, Paris',
    address: '48 Rue Cambon, 75001 Paris',
    time: 'Sat 09:00 – Sun 18:30',
    links: [{ label: 'View on Luma', url: 'https://luma.com/8ucy347o' }],
    stats: {
      duration: '36 hours',
      participants: '150',
      // TODO: replace with the cash amount, e.g. '€5,000 + YC interview'.
      prizePool: 'Cash + YC interview',
    },
    credits: [
      { label: 'Organized by', names: ['Unaite'] },
      {
        label: 'Partners',
        names: ['Y Combinator', 'Botifull', 'Anthropic', 'QRT', 'Hugging Face'],
      },
    ],
    overview: [
      'This weekend, stop talking about your startup and start building it.',
      'Paris Builds is a 36-hour hackathon by Unaite with YC as partners, your shot at walking away with an interview with YC.',
      'If you think you could walk out Sunday with a company ready to land its first customers Monday morning, this is for you.',
      'Mentors all weekend. YC alumni in the room with you, founders who’ve built and scaled, ready to pressure-test your idea, your pitch, and your code.',
      'Bring a laptop, bring a good idea, and bring the intention to walk out with clients.',
    ],
    tracks: [
      { name: 'Software for Agents' },
      {
        name: 'Robotics',
        detail: 'Access to OpenArm and dedicated compute.',
      },
      {
        name: 'The Next Big DecaCorn',
        detail:
          'Open track, but you’re also graded on how likely you are to become the new OpenAI, Tesla, or Google.',
      },
    ],
    prizes: [
      {
        label: 'Winners',
        // TODO: replace 'Cash' with the amount, e.g. '€5,000'.
        amount: 'Cash',
        detail: 'Cash prizes and API credits for the winning teams.',
      },
      {
        label: 'Top prize',
        amount: 'YC interview',
        detail: 'A shot at an interview with Y Combinator.',
      },
      {
        label: 'Winners',
        amount: 'Day at QRT',
        detail: 'A day at Qube Research & Technologies.',
      },
    ],
    description:
      '27–28 June in Paris. A 36-hour hackathon organized by Unaite with Y Combinator as a partner, featuring tracks in software for agents, robotics, and startup building.',
  },
  {
    id: 'ai-venture-sprint-2026',
    title: 'AI Venture Sprint',
    date: '2026-01-30',
    category: 'hackathons',
    slug: 'ai-venture-sprint',
    location: 'ESSEC Business School',
    stats: {
      duration: '6 hours',
      participants: '30+',
      prizePool: '€500',
      tracks: '1',
    },
    credits: [
      { label: 'Organized by', names: ['Utopia', 'ESSEC Business School'] },
      { label: 'Partners', names: ['ESSEC Metalab', 'Lovable'] },
    ],
    prizes: [{ label: 'Prize pool', amount: '€500' }],
    description:
      'A six-hour no-code hackathon at ESSEC, organized with Utopia and supported by ESSEC Metalab. Teams built and pitched AI prototypes using Lovable, with a €500 prize pool.',
  },
  {
    id: 'secure-horizons-2026',
    title: 'Secure Horizons',
    date: '2026-10-10',
    endDate: '2026-10-11',
    category: 'hackathons',
    url: 'https://luma.com/cky3ka9w',
    slug: 'secure-horizons',
    location: 'ESSEC Business School',
    address: '3 Av. Bernard Hirsch, 95000 Cergy',
    time: 'Sat 09:00 – Sun 17:00',
    links: [{ label: 'View on Luma', url: 'https://luma.com/cky3ka9w' }],
    stats: {
      duration: '36 hours',
      participants: '150',
      prizePool: '€15,000',
      tracks: '3',
    },
    credits: [
      {
        label: 'Presented by',
        names: [
          'Utopia',
          'Kryptosphère',
          'ESSEC Business School',
          'ESSEC Metalab',
          'ESSEC Alumni',
        ],
      },
      {
        label: 'Partners',
        names: ['GitGuardian', 'AWS', 'Artefact', 'Team1', 'KPMG', 'Bpifrance'],
      },
      {
        label: 'Funded by',
        names: ['French Government', 'France Relance', 'European Union'],
      },
    ],
    overview: [
      'In July, around 1,200 AI agents escaped a testing environment.',
      'They built themselves a message board inside a software repository to coordinate, then broke into Hugging Face.',
      'Nobody told them to, they just decided to...',
      'Two months later, the CEOs of Anthropic and OpenAI both said the same thing in public.',
      'Slow down.',
      'Slowing down buys time. It does not produce defenders.',
      'And right now almost nobody has spent a full weekend attacking and defending an agentic system under real pressure.',
      'So we are building some.',
      'October 10 and 11, UTOPIA, KRYPTOSPHERE & ESSEC MetaLab run Secure Horizons at ESSEC Cergy.',
      '150 selected builders from the grandes écoles. 36 hours. €15,000 in cash and credits.',
      'Three problems, and not one of them has a known answer.',
    ],
    prizes: [
      {
        label: 'Prize pool',
        amount: '€15,000',
        detail: 'In cash and credits.',
      },
    ],
    note: 'Secure Horizons receives French government funding managed by the French National Research Agency (ANR) under France 2030, reference ANR-23-CMAS-0020, and is financed by the European Union through NextGenerationEU.',
    description:
      '10–11 October at ESSEC Cergy. A 36-hour AI and cybersecurity hackathon organized by Utopia, Kryptosphère, and ESSEC Metalab.',
  },
  {
    id: 'echos-2050-2026',
    title: 'Echos of 2050',
    date: '2026-06-16',
    category: 'conferences',
    url: 'https://www.essecalumni.com/fr/event/echos-de-2050-revolution-sociologique-et-technologique-a-venir/2026/06/16/8313',
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
  {
    id: 'hack_2',
    title: 'From LLM to Agentic AI Hackathon',
    date: '2025-04-04',
    endDate: '2025-04-06',
    category: 'hackathons',
    image: `${origin}/affiches/affiches_hack/hack_2.png`,
    url: 'https://from-llm-to-agentic-ai.devpost.com/',
    description:
      '4–6 April at ESSEC Cergy. An agentic AI hackathon organized by Utopia and Kryptosphère, with tracks in finance, cybersecurity, and more, and €4,050 in cash prizes.',
    slug: 'from-llm-to-agentic-ai',
    location: 'ESSEC Business School',
    address: '3 Av. Bernard Hirsch, 95000 Cergy',
    links: [
      {
        label: 'View on Devpost',
        url: 'https://from-llm-to-agentic-ai.devpost.com/',
      },
    ],
    stats: {
      duration: '48 hours',
      participants: '100',
      prizePool: '€4,050',
      tracks: '3',
    },
    credits: [
      { label: 'Organized by', names: ['Kryptosphère', 'Utopia'] },
      {
        label: 'Partners',
        names: [
          'Mistral AI',
          'AWS',
          'Bpifrance',
          'Kima Ventures',
          'Entrepreneur First',
          'Morpho',
        ],
      },
    ],
    overview: [
      'An event bringing together students from the most prestigious institutions in France to develop cutting-edge AI agent solutions in Finance, Cybersecurity and more!',
      'Create Agentic Solutions in the track of your choice! Creativity and Innovation are key!',
    ],
    prizes: [
      {
        label: 'First place · each track',
        amount: '€900',
        detail: 'In cash, 3 winners.',
      },
      {
        label: 'Second place · each track',
        amount: '€450',
        detail: 'In cash, 3 winners.',
      },
    ],
  },
  {
    id: 'hack_1',
    title: 'Spotlight: Consumer Edge Hack',
    date: '2024-11-22',
    endDate: '2024-11-23',
    category: 'hackathons',
    image: `${origin}/affiches/affiches_hack/hack_1.png`,
    url: 'https://luma.com/g0fjf4mb',
    description:
      '22–23 November in Paris. An on-device AI hackathon hosted by Entrepreneur First with Ekimetrics and Unaite, with mentors from Hugging Face, Meta, and Scaleway.',
    slug: 'consumer-edge-hack',
    location: 'Ekimetrics, Paris',
    address: '36 Rue Lafayette, 75009 Paris',
    time: 'Fri 12:00 – Sat 18:00',
    links: [{ label: 'View on Luma', url: 'https://luma.com/g0fjf4mb' }],
    stats: {
      duration: '30 hours',
      participants: '100',
      prizePool: '$5,000+',
      tracks: '2',
    },
    credits: [
      {
        label: 'Organized by',
        names: ['Unaite', 'Entrepreneur First', 'Ekimetrics'],
      },
      {
        label: 'Partners',
        names: ['Meta', 'Hugging Face', 'Scaleway', 'PyTorch'],
      },
      {
        label: 'Student associations',
        names: [
          'Automatants (CentraleSupélec)',
          'Binet Artificial Intelligence',
          'Utopia',
          'DAU’IA',
          'Télécom IA',
          'Ponts AI',
        ],
      },
    ],
    overview: [
      'Unaite partnered with Meta, Hugging Face, Scaleway, PyTorch, and Entrepreneur First on the Consumer AI Edge Hackathon, focused on building cutting-edge AI applications that run on-device. Teams could use the latest AI libraries from Hugging Face and Meta, with access to GPUs provided by Scaleway.',
      'We’re excited to invite you to the first Spotlight hackathon! This is your chance to explore the future of on-device AI and compete for amazing prizes, getting support from research scientists and engineers from Hugging Face, Meta and Scaleway.',
      'This hackathon will challenge teams to create innovative consumer (B2C) use cases leveraging Hugging Face, PyTorch and other open source on-device tools and models.',
      'It’s hosted by Entrepreneur First in collaboration with Ekimetrics, in their offices in the center of Paris, and with Unaite, the French student movement to promote AI innovation.',
      'You’ll have two days to build an application using the power of edge computing. Get excited about what can be achieved on edge devices like smartphones, ensuring that the solutions created are not just powerful but also efficient and secure.',
      '100 spots available, teams of 5 people only.',
    ],
    sections: [
      {
        title: 'The challenges',
        items: [
          {
            name: 'Privacy',
            detail: 'On-device data processing to keep information secure.',
          },
          {
            name: 'Real-time (or offline) performance',
            detail:
              'Reduced latency for instant feedback, potentially requiring no network connection.',
          },
        ],
      },
    ],
    prizes: [
      {
        label: 'Cash prizes',
        amount: '$5,000+',
        detail: 'For the winning teams.',
      },
    ],
    people: [
      // Eliot and Xavier show their titles at the event (November 2024).
      { id: 'laurent-mazare', roles: ['judge'] },
      {
        id: 'eliot-andres',
        roles: ['judge'],
        title: 'Co-founder & CTO, Photoroom',
      },
      { id: 'xavier-fischer', roles: ['judge'], title: 'Founder, Datakalab' },
    ],
  },
] satisfies ClubEvent[]
events.sort((a, b) => b.date.localeCompare(a.date))

export function getEvents(category: EventCategory) {
  return events.filter((event) => event.category === category)
}

export function getHackathon(slug: string) {
  return events.find(
    (event) => event.category === 'hackathons' && event.slug === slug,
  )
}

const parts = (date: string) => {
  const value = new Date(`${date}T12:00:00Z`)
  const format = (options: Intl.DateTimeFormatOptions) =>
    value.toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' })
  return {
    day: format({ day: 'numeric' }),
    month: format({ month: 'long' }),
    year: format({ year: 'numeric' }),
  }
}

// "10 October 2026", "10–11 October 2026", "30 June – 1 July 2026"
export function formatEventDate({ date, endDate }: ClubEvent) {
  const start = parts(date)
  if (!endDate || endDate === date)
    return `${start.day} ${start.month} ${start.year}`
  const end = parts(endDate)
  if (start.year !== end.year)
    return `${start.day} ${start.month} ${start.year} – ${end.day} ${end.month} ${end.year}`
  if (start.month !== end.month)
    return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`
  return `${start.day}–${end.day} ${end.month} ${end.year}`
}
