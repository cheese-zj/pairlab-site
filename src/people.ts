export type PersonLink = {
  label: string
  href: string
  kind: 'linkedin' | 'scholar' | 'email' | 'profile'
}

export type Person = {
  id: string
  slug: string
  name: string
  surname: string
  role: string
  image: string
  summary?: string
  links: PersonLink[]
}

export const labLead: Person = {
  id: '01',
  slug: 'weiming-zhi',
  name: 'Weiming (William) Zhi',
  surname: 'Zhi',
  role: 'Lab lead · Lecturer',
  image: '/weiming-zhi.webp',
  summary: 'Robotics and Embodied AI researcher developing robots that see and act in unstructured environments.',
  links: [
    { label: 'Profile', href: 'https://www.weimingzhi.com/', kind: 'profile' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=Y6MWNsQAAAAJ', kind: 'scholar' },
    { label: 'Email', href: 'mailto:weiming.zhi@sydney.edu.au', kind: 'email' },
  ],
}

export const labMembers: Person[] = ([
  {
    id: '02',
    slug: 'mingyuan-ba',
    name: 'Mingyuan Ba',
    surname: 'Ba',
    role: 'Member',
    image: '/people/mingyuan-ba.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mingyuan-ba-425258412/', kind: 'linkedin' },
    ],
  },
  {
    id: '03',
    slug: 'yijie-lu',
    name: 'Yijie Lu',
    surname: 'Lu',
    role: 'Member',
    image: '/people/yijie-lu.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yijie-lu-252318299/', kind: 'linkedin' },
    ],
  },
  {
    id: '04',
    slug: 'zhaoyan-qian',
    name: 'Zhaoyan Qian',
    surname: 'Qian',
    role: 'Member',
    image: '/people/zhaoyan-qian.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhaoyan-qian-a531a2248/', kind: 'linkedin' },
    ],
  },
  {
    id: '05',
    slug: 'jinhe-tang',
    name: 'Jinhe Tang',
    surname: 'Tang',
    role: 'Member',
    image: '/people/jinhe-tang.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jinhe-tang-199aaa407/', kind: 'linkedin' },
      { label: 'Email', href: 'mailto:jtan0428@uni.sydney.edu.au', kind: 'email' },
    ],
  },
  {
    id: '06',
    slug: 'james-zhao',
    name: 'James Zhao',
    surname: 'Zhao',
    role: 'Member',
    image: '/people/james-zhao.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/james-zhao-4947a121a/', kind: 'linkedin' },
      { label: 'Email', href: 'mailto:jzha0385@uni.sydney.edu.au', kind: 'email' },
    ],
  },
  {
    id: '07',
    slug: 'yanan-zhou',
    name: 'Yanan Zhou',
    surname: 'Zhou',
    role: 'Member',
    image: '/people/yanan-zhou.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yanan-zhou-6420a0288/', kind: 'linkedin' },
      { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=5LHIpm4AAAAJ&hl=zh-CN', kind: 'scholar' },
      { label: 'Email', href: 'mailto:yzho5556@uni.sydney.edu.au', kind: 'email' },
    ],
  },
] satisfies Person[]).sort((a, b) => a.surname.localeCompare(b.surname, 'en'))
