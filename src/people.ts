// Everyone who has judged, mentored, coached, or spoken at a Utopia event.
// Add a person once here, then tag them on any event in src/events.ts:
//   people: [{ id: 'eliot-andres', roles: ['judge', 'mentor'] }]
// Photos live in public/people/<id>.webp (square, about 480px).
export type PersonRole = 'judge' | 'mentor' | 'coach' | 'speaker' | 'host'

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
  return list.map(({ id, roles, title }) => ({
    id,
    roles,
    ...people[id],
    title: title ?? people[id].title,
  }))
}
