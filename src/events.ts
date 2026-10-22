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
  // Events with a slug get their own page at /<category>/<slug>.
  // Each one also needs an entry in src/seo.json.
  slug?: string
  location?: string
  address?: string
  time?: string
  // The same four facts are shown for every event of a category; leave one
  // out to show "—".
  stats?: {
    // Hackathons
    duration?: string
    participants?: string
    prizePool?: string
    // Defaults to the number of tracks listed below.
    tracks?: string
    // Conferences, e.g. "Roundtable", "French"
    format?: string
    // Defaults to the number of people listed below.
    speakers?: string
    attendees?: string
    language?: string
  }
  overview?: string[]
  tracks?: { name: string; detail?: string }[]
  // Extra lists under the overview, e.g. challenges, mentors, judging criteria.
  // Agenda-style sections ("18:30 – Welcome") render as a plain list.
  sections?: {
    title: string
    list?: boolean
    items: { name: string; detail?: string }[]
  }[]
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
    slug: 'echos-of-2050',
    location: 'Maison des ESSEC',
    address: '11 Av. de Friedland, 75008 Paris',
    time: '18:30 – 21:30',
    stats: { format: 'Conference', attendees: '100+', language: 'French' },
    credits: [
      {
        label: 'Organized by',
        names: ['ESSEC Alumni Club Digital & Technology'],
      },
      { label: 'Partners', names: ['VivaTech', 'Web3 Talent Fair'] },
    ],
    overview: [
      '“Échos de 2050 : révolution sociologique et technologique à venir.” A conference at the Maison des ESSEC in Paris on the technological, social, and geopolitical shifts that may shape the decades ahead, held the day before VivaTech 2026 opened.',
      'Organized by the ESSEC Alumni Club Digital & Technology with VivaTech and Utopia, it was open to alumni, professionals, students, and researchers, in person and online.',
    ],
    sections: [
      {
        title: 'Program',
        list: true,
        items: [
          { name: '18:30', detail: 'Welcome' },
          {
            name: '18:45 · Opening fireside chat',
            detail: 'Energy, computing, and AI, with Fatih Balyeli (Exaion).',
          },
          {
            name: '19:15 · The future of humanity in the age of AI',
            detail: 'Panel with Laurent Alexandre and Maxime Fournes.',
          },
          {
            name: '20:00 · Europe’s digital sovereignty',
            detail:
              'Panel with Bernard Benhamou, Vincent Casillas, Alain Garnier, and Fadila Leturcq.',
          },
          {
            name: '20:45 · Closing keynote',
            detail: 'Guillaume Chevillon (ESSEC Metalab).',
          },
          { name: '21:00', detail: 'Networking cocktail' },
        ],
      },
    ],
    people: [
      { id: 'fatih-balyeli', roles: ['speaker'] },
      { id: 'laurent-alexandre', roles: ['speaker'] },
      { id: 'maxime-fournes', roles: ['speaker'] },
      { id: 'bernard-benhamou', roles: ['speaker'] },
      { id: 'vincent-casillas', roles: ['speaker'] },
      { id: 'alain-garnier', roles: ['speaker'] },
      { id: 'fadila-leturcq', roles: ['speaker'] },
      { id: 'guillaume-chevillon', roles: ['speaker'] },
    ],
    links: [
      {
        label: 'View on ESSEC Alumni',
        url: 'https://www.essecalumni.com/fr/event/echos-de-2050-revolution-sociologique-et-technologique-a-venir/2026/06/16/8313',
      },
    ],
    description:
      'At Maison des ESSEC, Paris. AI, technological sovereignty, and societal transformations, with Club ESSEC Alumni Digital & Technology and in partnership with VivaTech.',
  },
  {
    id: 'investment-banking-2026',
    title: 'AI × Investment Banking',
    date: '2026-04-02',
    category: 'conferences',
    url: 'https://luma.com/wccsk0q4',
    slug: 'ai-investment-banking',
    location: 'Université PSL',
    address: '16 bis Rue de l’Estrapade, 75005 Paris',
    time: '19:30 – 21:30',
    stats: { format: 'Roundtable', language: 'French' },
    credits: [{ label: 'Organized by', names: ['Utopia', 'DAU’IA'] }],
    overview: [
      'A roundtable co-organized with DAU’IA, the AI association of Université Paris Dauphine-PSL, with four executives living the AI transformation of investment banking from the inside.',
      'Speakers from BNP Paribas, Société Générale, Goldman Sachs, and Blackroom discussed how AI is changing the way banks work.',
    ],
    people: [
      { id: 'su-yang', roles: ['speaker'] },
      { id: 'delphine-de-montbert', roles: ['speaker'] },
      { id: 'issam-moatassim', roles: ['speaker'] },
      { id: 'loic-moisand', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/wccsk0q4' }],
    description:
      'A roundtable co-organized with DAU’IA, featuring speakers from BNP Paribas, Société Générale, Goldman Sachs, and Blackroom.',
  },
  {
    id: 'kpmg-2026',
    title: 'AI in Action — KPMG',
    date: '2026-03-25',
    category: 'conferences',
    url: 'https://luma.com/yb94ic9k',
    slug: 'kpmg-ai-in-action',
    location: 'KPMG, Tour Eqho',
    address: '2 Av. Gambetta, 92400 Courbevoie',
    time: '17:30 – 21:00',
    stats: { format: 'Conference', attendees: '70+' },
    credits: [
      { label: 'Organized by', names: ['Utopia', 'ESCP AI Society'] },
      { label: 'Partners', names: ['KPMG'] },
    ],
    overview: [
      'AI in Action: How KPMG Is Transforming Audit, Advisory & Cyber. A conference at KPMG’s La Défense offices, co-organized with the ESCP AI Society.',
      'Four KPMG professionals showed how the firm uses AI across audit, advisory, and offensive cybersecurity.',
    ],
    people: [
      { id: 'xavier-niffle', roles: ['speaker'] },
      { id: 'marion-letemplier', roles: ['speaker'] },
      { id: 'baptiste-dedieu', roles: ['speaker'] },
      { id: 'loic-vervisch', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/yb94ic9k' }],
    description:
      'At KPMG La Défense, Tour Eqho, with ESCP AI Society. Exploring AI in audit, advisory, and cybersecurity with KPMG professionals.',
  },
  {
    id: 'event_1',
    title: 'Future of AI',
    date: '2024-09-27',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_1.png`,
    url: 'https://luma.com/bakyq9l9',
    slug: 'future-of-ai',
    location: 'Albert School',
    address: '18 Rue de Paradis, 75010 Paris',
    time: '18:30 – 21:30',
    // Attendee counts are rounded "went" numbers from Luma.
    stats: { format: 'Roundtable', attendees: '400' },
    credits: [{ label: 'Organized by', names: ['Utopia', 'Unaite'] }],
    overview: [
      'A roundtable on the future of artificial intelligence in France, organized by Utopia and Unaite at Albert School in Paris.',
      'Speakers from Mistral AI, Mirakl, Snowflake, and Kima Ventures discussed where French AI is heading, followed by questions from the audience.',
    ],
    sections: [
      {
        title: 'Agenda',
        list: true,
        items: [
          {
            name: '18:30 – 19:00',
            detail:
              'Welcome and introduction to Utopia, Unaite, and the guests',
          },
          { name: '19:00 – 20:00', detail: 'Roundtable and Q&A' },
          { name: '20:00 – 21:30', detail: 'Cocktail and networking' },
        ],
      },
    ],
    people: [
      { id: 'william-el-sayed', roles: ['speaker'] },
      { id: 'anne-claire-baschet', roles: ['speaker'] },
      { id: 'ivan-smets', roles: ['speaker'] },
      {
        id: 'chloe-timsit',
        roles: ['speaker'],
        title: 'Venture Capital, Kima Ventures',
      },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/bakyq9l9' }],
  },
  {
    id: 'event_2',
    title: 'IA à tout prix ?',
    date: '2024-10-15',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_2.png`,
    url: 'https://luma.com/68rouecy',
    slug: 'ia-a-tout-prix',
    location: 'ESSEC Business School',
    address: '3 Av. Bernard Hirsch, 95000 Cergy',
    time: '19:30 – 21:30',
    stats: { format: 'Roundtable', attendees: '340+', language: 'French' },
    credits: [
      { label: 'Organized by', names: ['Utopia', 'Les Mardis de l’ESSEC'] },
      {
        label: 'Partners',
        names: [
          'Forvis Mazars',
          'ODDO BHF',
          'BearingPoint',
          'LCP Assemblée nationale',
        ],
      },
    ],
    overview: [
      'A roundtable on the major questions raised by artificial intelligence, co-organized with Les Mardis de l’ESSEC in the Grand Amphithéâtre of ESSEC’s Cergy campus.',
      'The panel brought together policy, research, investment, and industry: a member of the French National Assembly, the director of the PRAIRIE research institute, Meta’s VC and startups lead, and the CEO of Artefact.',
    ],
    sections: [
      {
        title: 'Agenda',
        list: true,
        items: [
          { name: '19:30', detail: 'Doors open' },
          { name: '20:00', detail: 'Roundtable and Q&A' },
          { name: '21:30', detail: 'Cocktail' },
        ],
      },
    ],
    people: [
      { id: 'paul-midy', roles: ['speaker'] },
      { id: 'isabelle-ryl', roles: ['speaker'] },
      { id: 'victoire-mine', roles: ['speaker'] },
      { id: 'vincent-luciani', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/68rouecy' }],
  },
  {
    id: 'event_3',
    title: "L'IA en entreprise",
    date: '2024-10-31',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_3.png`,
    slug: 'ia-en-entreprise',
    location: 'Albert School',
    address: '18 Rue de Paradis, 75010 Paris',
    time: '19:00 – 21:30',
    stats: { format: 'Conference', language: 'French' },
    credits: [
      {
        label: 'Partners',
        names: ['Albert School', 'AI Sisters', 'AI Builders'],
      },
    ],
    overview: [
      '“L’IA en entreprise, qu’est-ce que ça change vraiment ?” A conference at Albert School in Paris on what AI actually changes inside companies.',
      'Emma Pariente, co-founder and CEO of AI Sisters, and Guillaume Besson, AI strategist at AI Builders, shared how organizations are adopting AI in practice.',
    ],
    people: [
      { id: 'emma-pariente', roles: ['speaker'] },
      { id: 'guillaume-besson', roles: ['speaker'] },
    ],
  },
  {
    id: 'event_4',
    title: 'ARC Prize',
    date: '2024-11-26',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_4.png`,
    url: 'https://luma.com/2cdo8hgu',
    slug: 'arc-prize',
    time: '19:00 – 21:00',
    stats: { format: 'Talk', attendees: '100+', language: 'French' },
    credits: [{ label: 'Organized by', names: ['ARC Prize', 'Unaite'] }],
    overview: [
      'The Paris stop of the ARC Prize 2024 University Tour, hosted by the Unaite federation of student AI associations, of which Utopia is a founding member.',
      'The session covered ARC-AGI, a benchmark for measuring progress toward general intelligence, technical approaches to beating it, and the past, present, and future of ARC Prize, a $1M+ competition for open AGI progress.',
      'François Chollet, creator of Keras and ARC-AGI, joined remotely. The event was open to university students and staff.',
    ],
    people: [
      { id: 'francois-chollet', roles: ['speaker'] },
      { id: 'mathis-federico', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/2cdo8hgu' }],
  },
  {
    id: 'event_5',
    title: 'Conférence Inaugurale Unaite',
    date: '2024-12-02',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_5.png`,
    url: 'https://luma.com/rje0m487',
    slug: 'unaite-inaugural-conference',
    location: 'Amphithéâtre de l’Estrapade, Université PSL',
    address: '16 bis Rue de l’Estrapade, 75005 Paris',
    time: '18:45 – 22:15',
    stats: { format: 'Conference', language: 'French' },
    credits: [
      {
        label: 'Organized by',
        names: ['Unaite', 'X-AI', 'Utopia', 'Automatants', 'Ponts', 'DAU’IA'],
      },
    ],
    overview: [
      'The inaugural conference of Unaite, the federation of student AI associations that Utopia helped found.',
      'Two roundtables brought together researchers and industry leaders from PRAIRIE, Kyutai, Inria and ENS, Meta, :probabl., AI71, and the French National AI Strategy: one on research, the other on AI issues and business.',
    ],
    sections: [
      {
        title: 'Agenda',
        list: true,
        items: [
          {
            name: '18:45 – 19:15',
            detail: 'Welcome and presentation of Unaite and the guests',
          },
          { name: '19:15 – 20:15', detail: 'Research roundtable and Q&A' },
          {
            name: '20:20 – 21:20',
            detail: 'AI issues and business roundtable and Q&A',
          },
          { name: '21:20 – 22:15', detail: 'Cocktail and networking' },
        ],
      },
    ],
    people: [
      { id: 'isabelle-ryl', roles: ['speaker'] },
      { id: 'alexandre-defossez', roles: ['speaker'] },
      { id: 'francis-bach', roles: ['speaker'] },
      { id: 'gregoire-mialon', roles: ['speaker'] },
      { id: 'yann-lechelle', roles: ['speaker'] },
      { id: 'mehdi-ghissassi', roles: ['speaker'] },
      { id: 'yohann-ralle', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/rje0m487' }],
  },
  {
    id: 'event_6',
    title: 'Meetup Alan',
    date: '2024-12-11',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_6.png`,
    slug: 'meetup-alan',
    location: 'Alan',
    address: '117 Quai de Valmy, 75010 Paris',
    time: '19:00 – 21:00',
    stats: { format: 'Meetup', attendees: '70+', language: 'French' },
    credits: [
      {
        label: 'Organized by',
        names: [
          'Unaite',
          'X-AI',
          'Utopia',
          'Automatants',
          'Télécom IA',
          'Ponts',
          'DAU’IA',
        ],
      },
      { label: 'Partners', names: ['Alan'] },
    ],
    overview: [
      'A meetup at Alan’s offices in Paris for members of Unaite’s student AI associations, including Utopia.',
      'Students met Alan’s engineers and learned how the health insurance company uses AI to simplify contract management, reimbursements, and customer support. Charles Gorintin, Alan’s co-founder and CTO, joined as a special guest.',
    ],
    people: [{ id: 'charles-gorintin', roles: ['speaker'] }],
  },
  {
    id: 'event_7',
    title: 'Start From Scratch',
    date: '2025-01-22',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_7.png`,
    url: 'https://luma.com/fhgvzqxh',
    slug: 'start-from-scratch',
    location: 'Albert School',
    address: '18 Rue de Paradis, 75010 Paris',
    time: '18:30 – 21:30',
    stats: { format: 'Roundtable', attendees: '250+' },
    credits: [
      {
        label: 'Organized by',
        names: ['HEC Venture Lab', 'Utopia', 'Unaite', 'French Tech Leaders'],
      },
      { label: 'Partners', names: ['Albert School'] },
    ],
    overview: [
      'A roundtable on building in AI from the ground up, bringing together an investor, a founder, and builders at Albert School in Paris.',
      'The panel featured Kima Ventures, Argil (YC S24), OpenAI’s go-to-market team, and one of the top five creators on the OpenAI GPT Store.',
    ],
    sections: [
      {
        title: 'Agenda',
        list: true,
        items: [
          { name: '18:30 – 19:00', detail: 'Welcome and introduction' },
          { name: '19:00 – 20:00', detail: 'Roundtable and Q&A' },
          { name: '20:00 – 21:30', detail: 'Cocktail and networking' },
        ],
      },
    ],
    people: [
      { id: 'chloe-timsit', roles: ['speaker'] },
      { id: 'laodis-menard', roles: ['speaker'] },
      { id: 'pierre-edouard-lieb', roles: ['speaker'] },
      { id: 'ethan-safar', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/fhgvzqxh' }],
  },
  {
    id: 'event_8',
    title: 'Table Ronde Droit et IA',
    date: '2025-01-27',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_8.png`,
    url: 'https://luma.com/e19tf90i',
    slug: 'droit-et-ia',
    location: 'August Debouzy',
    address: '7 Rue de Téhéran, 75008 Paris',
    time: '18:30 – 22:00',
    stats: { format: 'Roundtable', attendees: '110+', language: 'French' },
    credits: [
      { label: 'Organized by', names: ['Lex ESSEC', 'Utopia', 'Unaite'] },
      { label: 'Partners', names: ['August Debouzy'] },
    ],
    overview: [
      'A roundtable on law and artificial intelligence, co-organized with Lex ESSEC and hosted by the law firm August Debouzy.',
      'The panel brought together August Debouzy’s managing director, Mistral AI’s general counsel, a former French Secretary of State for Digital Affairs, and a professor from the EDHEC Augmented Law Institute to discuss the legal questions raised by AI.',
      'Legal tech startups Ordalie and Jimini were invited to present short demos before the cocktail.',
    ],
    sections: [
      {
        title: 'Agenda',
        list: true,
        items: [
          { name: '18:30 – 19:00', detail: 'Arrival' },
          { name: '19:00 – 20:30', detail: 'Roundtable and Q&A' },
          { name: '20:30 – 22:00', detail: 'Cocktail and networking' },
        ],
      },
    ],
    people: [
      { id: 'mahasti-razavi', roles: ['speaker'] },
      { id: 'blanche-savary-de-beauregard', roles: ['speaker'] },
      { id: 'mounir-mahjoubi', roles: ['speaker'] },
      { id: 'christophe-roquilly', roles: ['speaker'] },
    ],
    links: [{ label: 'View on Luma', url: 'https://luma.com/e19tf90i' }],
  },
  {
    id: 'event_9',
    title: 'Unaite x Perplexity',
    date: '2025-02-11',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_9.png`,
    url: 'https://luma.com/uan55g3p',
    slug: 'unaite-perplexity',
    location: 'Université PSL',
    address: '3 Rue Amyot, 75005 Paris',
    time: '17:30 – 20:30',
    stats: { format: 'Fireside chat', attendees: '200+', language: 'English' },
    credits: [
      { label: 'Organized by', names: ['Unaite'] },
      { label: 'Partners', names: ['Perplexity'] },
    ],
    overview: [
      'During the AI Action Summit week in Paris, Unaite hosted a fireside chat with Aravind Srinivas, co-founder and CEO of Perplexity.',
      'He spoke about Perplexity’s journey and its work on AI-powered search, then took questions from the audience. The event was open to students and researchers from Unaite’s member schools: ESSEC, CentraleSupélec, École des Ponts, École polytechnique, Télécom Paris, and Université Paris Dauphine-PSL.',
    ],
    sections: [
      {
        title: 'Agenda',
        list: true,
        items: [
          { name: '17:30 – 18:00', detail: 'Registration' },
          {
            name: '18:00 – 18:40',
            detail: 'Fireside chat with Aravind Srinivas',
          },
          { name: '18:40 – 19:00', detail: 'Q&A' },
          { name: '19:00 – 20:30', detail: 'Closing remarks and networking' },
        ],
      },
    ],
    people: [{ id: 'aravind-srinivas', roles: ['speaker'] }],
    links: [{ label: 'View on Luma', url: 'https://luma.com/uan55g3p' }],
  },
  {
    id: 'event_10',
    title: "Les Rôles Des Femmes Dans L'IA",
    date: '2025-02-20',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_10.png`,
    slug: 'women-in-ai',
    location: 'Université Paris Dauphine-PSL',
    address: 'Place du Maréchal de Lattre de Tassigny, 75016 Paris',
    time: '20:00',
    stats: { format: 'Roundtable', language: 'French' },
    overview: [
      '“Le rôle des femmes dans l’IA : l’enjeu de la mixité.” A roundtable on the place of women in artificial intelligence and why gender diversity matters in the field, held in the Salle Raymond Aron at Université Paris Dauphine-PSL.',
      'The panel brought together an international law expert working on AI ethics and security, the director of Women in Tech, the Secretary General of the Generation Equality Forum, and the founder of MeiMei.',
    ],
    people: [
      { id: 'ysens-de-france', roles: ['speaker'] },
      { id: 'angela-naser', roles: ['speaker'] },
      { id: 'delphine-o', roles: ['speaker'] },
      { id: 'alexia-toulmet', roles: ['speaker'] },
    ],
  },
  {
    id: 'event_11',
    title: 'Building Outliers: An Evening With Top French Founders',
    date: '2025-02-26',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_11.png`,
    url: 'https://hecalumni.fr/en/event/fireside-chat-with-leading-tech-founders/2025/02/26/12281',
    slug: 'building-outliers',
    location: 'HEC Paris Alumni House',
    address: '9 Av. Franklin Delano Roosevelt, 75008 Paris',
    time: '19:00 – 21:00',
    stats: { format: 'Panel' },
    credits: [
      {
        label: 'Organized by',
        names: [
          'Utopia',
          'HEC Paris',
          'French Tech Leaders',
          'X-HEC Entrepreneurs Alumni',
        ],
      },
    ],
    overview: [
      'An evening with three French founders who built and scaled European startups and now invest in early-stage companies, held at the HEC Paris Alumni House.',
      'The co-founders of Defacto, Fleet, and Luko shared what it takes to build an outlier company, followed by audience questions and networking.',
    ],
    people: [
      { id: 'jordane-giuly', roles: ['speaker'] },
      { id: 'alexandre-berriche', roles: ['speaker'] },
      { id: 'raphael-vullierme', roles: ['speaker'] },
    ],
    links: [
      {
        label: 'View on HEC Alumni',
        url: 'https://hecalumni.fr/en/event/fireside-chat-with-leading-tech-founders/2025/02/26/12281',
      },
    ],
  },
  {
    id: 'event_12',
    title: 'HealthCare x AI',
    date: '2025-03-12',
    category: 'conferences',
    image: `${origin}/affiches/affiches_event/event_12.png`,
    url: 'https://convictionlog.substack.com/p/healthcare-x-ai-moving-fast-in-a',
    slug: 'healthcare-ai',
    location: 'Albert School',
    address: '18 Rue de Paradis, 75010 Paris',
    time: '20:00',
    stats: { format: 'Panel', language: 'English' },
    credits: [
      { label: 'Organized by', names: ['Utopia', 'Unaite'] },
      { label: 'Partners', names: ['Albert School'] },
    ],
    overview: [
      'A panel on how artificial intelligence is changing healthcare, bringing together a venture investor, a healthtech founder, and Sanofi’s accelerator at Albert School in Paris.',
    ],
    sections: [
      {
        title: 'Topics discussed',
        items: [
          {
            name: 'Where AI helps most',
            detail:
              'Pattern recognition across patient data, diagnostics, and drug discovery.',
          },
          {
            name: 'Trusting AI with our health',
            detail:
              'Transparency, building models with doctors and pharma, and regulation such as GDPR, HDS, and the EU AI Act.',
          },
          {
            name: 'Pharma and startups',
            detail:
              'How pharma companies assess and partner with startups, data quality, and finding real pain points.',
          },
          {
            name: 'Funding TechBio',
            detail:
              'Investor timelines, founding teams, clear business models, and expanding to the US.',
          },
        ],
      },
    ],
    people: [
      { id: 'willy-braun', roles: ['speaker'] },
      { id: 'iris-marechal', roles: ['speaker'] },
      { id: 'florent-edouard', roles: ['speaker'] },
      { id: 'henri-ngo', roles: ['moderator'] },
    ],
    links: [
      {
        label: 'Read the recap',
        url: 'https://convictionlog.substack.com/p/healthcare-x-ai-moving-fast-in-a',
      },
    ],
  },
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
      'Utopia partnered with Meta, Hugging Face, Scaleway, PyTorch, and Entrepreneur First on the Consumer AI Edge Hackathon, focused on building cutting-edge AI applications that run on-device. Teams could use the latest AI libraries from Hugging Face and Meta, with access to GPUs provided by Scaleway.',
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

export function getEvent(category: EventCategory, slug: string) {
  return events.find(
    (event) => event.category === category && event.slug === slug,
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
