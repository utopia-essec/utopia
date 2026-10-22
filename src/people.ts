// Everyone who has judged, mentored, coached, or spoken at a Utopia event.
// Add a person once here, then tag them on any event in src/events.ts:
//   people: [{ id: 'eliot-andres', roles: ['judge', 'mentor'] }]
// Photos live in public/people/<id>.webp (square, about 480px).
export type PersonRole =
  'judge' | 'mentor' | 'coach' | 'speaker' | 'moderator' | 'host'

export interface Person {
  name: string
  // Current role; an event can override it with the role held at the time.
  title: string
  photo?: string
  linkedin?: string
}

export const people = {
  'laurent-mazare': {
    name: 'Laurent Mazaré',
    title: 'Co-founder, Gradium',
    photo: '/people/laurent-mazare.webp',
    linkedin: 'https://www.linkedin.com/in/laurent-mazare-ab01a53',
  },
  'eliot-andres': {
    name: 'Eliot Andres',
    title: 'Co-founder, Photoroom',
    photo: '/people/eliot-andres.webp',
    linkedin: 'https://www.linkedin.com/in/eliotandres',
  },
  'xavier-fischer': {
    name: 'Xavier Fischer',
    title: 'Founder, Datakalab',
    photo: '/people/xavier-fischer.webp',
    linkedin: 'https://www.linkedin.com/in/xfischer',
  },
  // Conference speakers; titles are as of their event.
  'william-el-sayed': {
    name: 'William El Sayed',
    title: 'Founder Associate, Mistral AI',
    linkedin: 'https://www.linkedin.com/in/letsgomistral',
    photo: '/people/william-el-sayed.webp',
  },
  'anne-claire-baschet': {
    name: 'Anne-Claire Baschet',
    title: 'Chief Data & AI Officer, Mirakl',
    photo: '/people/anne-claire-baschet.webp',
    linkedin: 'https://www.linkedin.com/in/anneclairefortinbaschet',
  },
  'ivan-smets': {
    name: 'Ivan Smets',
    title: 'Sales Leader, Snowflake',
    photo: '/people/ivan-smets.webp',
  },
  'chloe-timsit': {
    name: 'Chloé Timsit',
    title: 'Partner, Kima Ventures',
    linkedin: 'https://www.linkedin.com/in/chloe-timsit-561658a0',
    photo: '/people/chloe-timsit.webp',
  },
  'paul-midy': {
    name: 'Paul Midy',
    title: 'Member of the French National Assembly',
    photo: '/people/paul-midy.webp',
    linkedin: 'https://www.linkedin.com/in/paulmidy',
  },
  'isabelle-ryl': {
    name: 'Isabelle Ryl',
    title: 'Director, PRAIRIE (Paris AI Research Institute)',
    photo: '/people/isabelle-ryl.webp',
    linkedin: 'https://www.linkedin.com/in/isabelle-ryl-82a799b',
  },
  'victoire-mine': {
    name: 'Victoire Mine',
    title: 'VC & Startups Lead, Meta',
    linkedin: 'https://www.linkedin.com/in/victoire-mine-goebel-90845b25',
    photo: '/people/victoire-mine.webp',
  },
  'vincent-luciani': {
    name: 'Vincent Luciani',
    title: 'Co-founder & CEO, Artefact',
    photo: '/people/vincent-luciani.webp',
    linkedin: 'https://www.linkedin.com/in/vincent-luciani-51653016',
  },
  'emma-pariente': {
    name: 'Emma Pariente',
    title: 'Co-founder & CEO, AI Sisters',
    photo: '/people/emma-pariente.webp',
  },
  'guillaume-besson': {
    name: 'Guillaume Besson',
    title: 'AI Strategist, AI Builders',
    linkedin: 'https://www.linkedin.com/in/guillaumebesson',
    photo: '/people/guillaume-besson.webp',
  },
  'francois-chollet': {
    name: 'François Chollet',
    title: 'Creator of Keras and ARC-AGI',
    photo: '/people/francois-chollet.webp',
    linkedin: 'https://www.linkedin.com/in/fchollet',
  },
  'mathis-federico': {
    name: 'Mathïs Federico',
    title: 'Founder, Automatants and Bycelium',
    photo: '/people/mathis-federico.webp',
    linkedin: 'https://www.linkedin.com/in/mathis-federico',
  },
  'alexandre-defossez': {
    name: 'Alexandre Défossez',
    title: 'Chief Exploration Officer, Kyutai',
    photo: '/people/alexandre-defossez.webp',
    linkedin: 'https://www.linkedin.com/in/alexandre-d%C3%A9fossez-b099ba7b',
  },
  'francis-bach': {
    name: 'Francis Bach',
    title: 'Researcher, Inria & ENS',
    photo: '/people/francis-bach.webp',
    linkedin: 'https://www.linkedin.com/in/francis-bach-31b499a',
  },
  'gregoire-mialon': {
    name: 'Grégoire Mialon',
    title: 'Researcher, Llama team, Meta',
    photo: '/people/gregoire-mialon.webp',
    linkedin: 'https://www.linkedin.com/in/gr%C3%A9goire-mialon-676669b6',
  },
  'yann-lechelle': {
    name: 'Yann Lechelle',
    title: 'Co-founder & CEO, :probabl.',
    photo: '/people/yann-lechelle.webp',
    linkedin: 'https://www.linkedin.com/in/ylechelle',
  },
  'mehdi-ghissassi': {
    name: 'Mehdi Ghissassi',
    title: 'Chief Product Officer, AI71',
    photo: '/people/mehdi-ghissassi.webp',
    linkedin: 'https://www.linkedin.com/in/mghissassi',
  },
  'yohann-ralle': {
    name: 'Yohann Ralle',
    title: 'Deputy Coordinator, French National AI Strategy',
    photo: '/people/yohann-ralle.webp',
    linkedin: 'https://www.linkedin.com/in/yohann-ralle-a6325083',
  },
  'charles-gorintin': {
    name: 'Charles Gorintin',
    title: 'Co-founder & CTO, Alan',
    photo: '/people/charles-gorintin.webp',
    linkedin: 'https://www.linkedin.com/in/charles-gorintin',
  },
  'laodis-menard': {
    name: 'Laodis Menard',
    title: 'Co-founder, Argil (YC S24)',
    photo: '/people/laodis-menard.webp',
    linkedin: 'https://www.linkedin.com/in/laodis',
  },
  'pierre-edouard-lieb': {
    name: 'Pierre-Edouard Lieb',
    title: 'Go-to-market, OpenAI',
    photo: '/people/pierre-edouard-lieb.webp',
    linkedin: 'https://www.linkedin.com/in/pelieb',
  },
  'ethan-safar': {
    name: 'Ethan Safar',
    title: 'Top 5 creator worldwide, OpenAI GPT Store',
    linkedin: 'https://www.linkedin.com/in/ethan-safar',
    photo: '/people/ethan-safar.webp',
  },
  'mahasti-razavi': {
    name: 'Mahasti Razavi',
    title: 'Managing Director, August Debouzy',
    photo: '/people/mahasti-razavi.webp',
    linkedin: 'https://www.linkedin.com/in/mahastirazavi',
  },
  'blanche-savary-de-beauregard': {
    name: 'Blanche Savary de Beauregard',
    title: 'General Counsel & Board Secretary, Mistral AI',
    photo: '/people/blanche-savary-de-beauregard.webp',
    linkedin: 'https://www.linkedin.com/in/blanche-savary',
  },
  'mounir-mahjoubi': {
    name: 'Mounir Mahjoubi',
    title:
      'Partner, Matin Partners; former Secretary of State for Digital Affairs',
    photo: '/people/mounir-mahjoubi.webp',
    linkedin: 'https://www.linkedin.com/in/mounirmahjoubi',
  },
  'christophe-roquilly': {
    name: 'Christophe Roquilly',
    title: 'Professor, EDHEC Augmented Law Institute',
    photo: '/people/christophe-roquilly.webp',
    linkedin: 'https://www.linkedin.com/in/roquilly-christophe-524492b',
  },
  'aravind-srinivas': {
    name: 'Aravind Srinivas',
    title: 'Co-founder & CEO, Perplexity',
    photo: '/people/aravind-srinivas.webp',
    linkedin: 'https://www.linkedin.com/in/aravind-srinivas-16051987',
  },
  'ysens-de-france': {
    name: 'Ysens de France',
    title: 'Doctor of International Law, AI ethics & security',
    photo: '/people/ysens-de-france.webp',
    linkedin: 'https://www.linkedin.com/in/ysens-de-france-phd-8061672b',
  },
  'angela-naser': {
    name: 'Angela Naser',
    title: 'Director, Women in Tech',
    linkedin: 'https://www.linkedin.com/in/angela-naser-11ba4911',
    photo: '/people/angela-naser.webp',
  },
  'delphine-o': {
    name: 'Delphine O',
    title: 'Secretary General, Generation Equality Forum',
    photo: '/people/delphine-o.webp',
    linkedin: 'https://www.linkedin.com/in/delphine-o-27159127',
  },
  'alexia-toulmet': {
    name: 'Alexia Toulmet',
    title: 'Founder, MeiMei',
    linkedin: 'https://www.linkedin.com/in/alexia-toulmet-55742383',
    photo: '/people/alexia-toulmet.webp',
  },
  'jordane-giuly': {
    name: 'Jordane Giuly',
    title: 'Co-founder, Defacto',
    linkedin: 'https://www.linkedin.com/in/jordane-giuly',
    photo: '/people/jordane-giuly.webp',
  },
  'alexandre-berriche': {
    name: 'Alexandre Berriche',
    title: 'Co-founder, Fleet',
    photo: '/people/alexandre-berriche.webp',
    linkedin: 'https://www.linkedin.com/in/berriche',
  },
  'raphael-vullierme': {
    name: 'Raphaël Vullierme',
    title: 'Co-founder, Luko',
    photo: '/people/raphael-vullierme.webp',
    linkedin: 'https://www.linkedin.com/in/raphaelvullierme',
  },
  'willy-braun': {
    name: 'Willy Braun',
    title: 'Co-founder & Partner, Galion.exe',
    linkedin: 'https://www.linkedin.com/in/willybraun',
    photo: '/people/willy-braun.webp',
  },
  'iris-marechal': {
    name: 'Iris Maréchal',
    title: 'Co-founder & CEO, Theremia',
    photo: '/people/iris-marechal.webp',
    linkedin: 'https://www.linkedin.com/in/iris-marechal',
  },
  'florent-edouard': {
    name: 'Florent Edouard',
    title: 'Head of Accelerator, Sanofi',
    photo: '/people/florent-edouard.webp',
    linkedin: 'https://www.linkedin.com/in/florentedouard',
  },
  'henri-ngo': {
    name: 'Henri Ngo',
    title: 'Author, conviction.log',
    photo: '/people/henri-ngo.webp',
  },
  'xavier-niffle': {
    name: 'Xavier Niffle',
    title: 'Head of Digital Audit & Innovation, KPMG',
    photo: '/people/xavier-niffle.webp',
  },
  'marion-letemplier': {
    name: 'Marion Letemplier',
    title: 'Senior Consultant, Tech Strategy & Transformation, KPMG',
  },
  'baptiste-dedieu': {
    name: 'Baptiste Dedieu',
    title: 'Director, Digital Audit & Innovation, KPMG',
    linkedin: 'https://www.linkedin.com/in/baptiste-dedieu-44020a12',
    photo: '/people/baptiste-dedieu.webp',
  },
  'loic-vervisch': {
    name: 'Loïc Vervisch',
    title: 'Manager, Offensive Cybersecurity, KPMG',
    linkedin: 'https://www.linkedin.com/in/loicvervisch389',
  },
  'su-yang': {
    name: 'Su Yang',
    title: 'Head of AI for Transaction Banking, BNP Paribas',
    photo: '/people/su-yang.webp',
    linkedin: 'https://www.linkedin.com/in/su-yang-6037914a',
  },
  'delphine-de-montbert': {
    name: 'Delphine de Montabert',
    title: 'Secretary General of Investment Banking, Société Générale',
    linkedin: 'https://www.linkedin.com/in/delphine-de-montabert-7524b096',
  },
  'issam-moatassim': {
    name: 'Issam Moatassim',
    title: 'Executive Director, Goldman Sachs',
    photo: '/people/issam-moatassim.webp',
    linkedin: 'https://www.linkedin.com/in/issammoatassim',
  },
  'loic-moisand': {
    name: 'Loïc Moisand',
    title: 'CEO, Blackroom',
    linkedin: 'https://www.linkedin.com/in/loicmoisand',
    photo: '/people/loic-moisand.webp',
  },
  'fatih-balyeli': {
    name: 'Fatih Balyeli',
    title: 'CEO, Exaion',
    linkedin: 'https://www.linkedin.com/in/fatih-balyeli-b010153',
    photo: '/people/fatih-balyeli.webp',
  },
  'laurent-alexandre': {
    name: 'Laurent Alexandre',
    title: 'Author and Entrepreneur',
    photo: '/people/laurent-alexandre.webp',
    linkedin: 'https://www.linkedin.com/in/laurent-alexandre-2954426',
  },
  'maxime-fournes': {
    name: 'Maxime Fournes',
    title: 'CEO, Pause IA',
    photo: '/people/maxime-fournes.webp',
    linkedin: 'https://www.linkedin.com/in/maximefournes',
  },
  'bernard-benhamou': {
    name: 'Bernard Benhamou',
    title: 'Secretary General, Institut de la Souveraineté Numérique',
    linkedin: 'https://www.linkedin.com/in/bernard-benhamou-9234ba1',
    photo: '/people/bernard-benhamou.webp',
  },
  'vincent-casillas': {
    name: 'Vincent Casillas',
    title: 'CTO, SiPearl',
    photo: '/people/vincent-casillas.webp',
    linkedin: 'https://www.linkedin.com/in/vincent-casillas-5b95822',
  },
  'alain-garnier': {
    name: 'Alain Garnier',
    title: 'CEO, Jamespot',
    linkedin: 'https://www.linkedin.com/in/garniera',
    photo: '/people/alain-garnier.webp',
  },
  'fadila-leturcq': {
    name: 'Fadila Leturcq',
    title: 'Chief Learning Officer to the French Prime Minister',
    photo: '/people/fadila-leturcq.webp',
    linkedin: 'https://www.linkedin.com/in/fadilaleturcq',
  },
  'guillaume-chevillon': {
    name: 'Guillaume Chevillon',
    title: 'Academic Director, ESSEC Metalab',
    photo: '/people/guillaume-chevillon.webp',
    linkedin: 'https://www.linkedin.com/in/guillaumechevillon',
  },
} satisfies Record<string, Person>

export type PersonId = keyof typeof people

export interface EventPerson {
  id: PersonId
  roles: PersonRole[]
  // Role held at the time of the event, if different from the current title.
  title?: string
}

const roleNames: Record<PersonRole, [string, string]> = {
  judge: ['Judge', 'Judges'],
  mentor: ['Mentor', 'Mentors'],
  coach: ['Coach', 'Coaches'],
  speaker: ['Speaker', 'Speakers'],
  moderator: ['Moderator', 'Moderators'],
  host: ['Host', 'Hosts'],
}

export function roleName(role: PersonRole) {
  return roleNames[role][0]
}

// "Judges", "Judges & mentors", or "People" when more than two roles appear.
export function peopleLabel(list: EventPerson[]) {
  const roles = [...new Set(list.flatMap((person) => person.roles))]
  if (roles.length > 2) return 'People'
  const names = roles.map((role) => roleNames[role][1])
  return [names[0], ...names.slice(1).map((name) => name.toLowerCase())].join(
    ' & ',
  )
}

export function resolvePeople(list: EventPerson[] = []) {
  return list.map(({ id, roles, title }) => {
    const person: Person = people[id]
    return { id, roles, ...person, title: title ?? person.title }
  })
}
