export type PersonLink = {
  label: string
  href: string
}

export type Person = {
  id: string
  slug: string
  name: string
  role: string
  image: string
  summary: string
  biography: string[]
  highlights: string[]
  links: PersonLink[]
}

export const people: Person[] = [
  {
    id: '01',
    slug: 'weiming-zhi',
    name: 'Weiming (William) Zhi',
    role: 'Lab lead · Lecturer',
    image: '/weiming-zhi.webp',
    summary: 'Robotics and Embodied AI researcher developing robots that see and act in unstructured environments.',
    biography: [
      'William is a tenure-track faculty member in the School of Computer Science at the University of Sydney. His research connects robot perception, motion generation, and machine learning so robots can operate beyond carefully engineered settings.',
      'Before joining Sydney, he held postdoctoral appointments at Carnegie Mellon University and Vanderbilt University, and conducted robotics research with NVIDIA during his doctoral studies.',
    ],
    highlights: [
      'L4DC Best Paper Award · 2022',
      'Robotics: Science and Systems Pioneer · 2020',
      'School Outstanding Thesis Award',
    ],
    links: [
      { label: 'Profile', href: 'https://www.weimingzhi.com/' },
      { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=Y6MWNsQAAAAJ' },
      { label: 'Email', href: 'mailto:weiming.zhi@sydney.edu.au' },
    ],
  },
]
