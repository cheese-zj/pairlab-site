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
  role: 'Lab Lead • Faculty',
  image: '/weiming-zhi.webp',
  summary: 'Robotics and Embodied AI researcher developing robots that see and act in unstructured environments.',
  links: [
    { label: 'Profile', href: 'https://www.weimingzhi.com/', kind: 'profile' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?hl=en&user=Y6MWNsQAAAAJ&view_op=list_works&sortby=pubdate', kind: 'scholar' },
    { label: 'Email', href: 'mailto:weiming.zhi@sydney.edu.au', kind: 'email' },
  ],
}

export const labMembers: Person[] = ([
  {
    id: '09',
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
    id: '13',
    slug: 'zara-cui',
    name: 'Zara Cui',
    surname: 'Cui',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [],
  },
  {
    id: '10',
    slug: 'rubin-dai',
    name: 'Rubin Dai',
    surname: 'Dai',
    role: 'Member',
    image: '/people/rubin-dai.webp',
    links: [
      { label: 'LinkedIn', href: 'https://au.linkedin.com/in/rubin-dai-a30477285', kind: 'linkedin' },
    ],
  },
  {
    id: '05',
    slug: 'isa-he',
    name: 'Isa He',
    surname: 'He',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [],
  },
  {
    id: '15',
    slug: 'zihao-li',
    name: 'Zihao Li',
    surname: 'Li',
    role: 'Member',
    image: '/people/zihao-li.webp',
    links: [
      { label: 'Profile', href: 'https://jeong-zju.github.io/', kind: 'profile' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/%E5%AD%90%E8%B1%AA-%E6%9D%8E-418583386/', kind: 'linkedin' },
    ],
  },
  {
    id: '07',
    slug: 'jieting-long',
    name: 'Jieting (Monica) Long',
    surname: 'Long',
    role: 'Member',
    image: '/people/jieting-long.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jieting-long/', kind: 'linkedin' },
    ],
  },
  {
    id: '12',
    slug: 'yijie-lu',
    name: 'Yijie Lu',
    surname: 'Lu',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yijie-lu-252318299/', kind: 'linkedin' },
    ],
  },
  {
    id: '02',
    slug: 'bill-nguyen',
    name: 'Bill Nguyen',
    surname: 'Nguyen',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [],
  },
  {
    id: '03',
    slug: 'dave-pu',
    name: 'Dave Pu',
    surname: 'Pu',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [],
  },
  {
    id: '14',
    slug: 'zhaoyan-qian',
    name: 'Zhaoyan Qian',
    surname: 'Qian',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhaoyan-qian-a531a2248/', kind: 'linkedin' },
    ],
  },
  {
    id: '08',
    slug: 'jinhe-tang',
    name: 'Jinhe Tang',
    surname: 'Tang',
    role: 'Member',
    image: '/people/linkedin-default-avatar.svg',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jinhe-tang-199aaa407/', kind: 'linkedin' },
      { label: 'Email', href: 'mailto:jtan0428@uni.sydney.edu.au', kind: 'email' },
    ],
  },
  {
    id: '04',
    slug: 'ellen-wang',
    name: 'Ellen Wang',
    surname: 'Wang',
    role: 'Member',
    image: '/people/ellen-wang.webp',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ellen-wang-8905bb15a/', kind: 'linkedin' },
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
    id: '11',
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
] satisfies Person[]).sort((a, b) => a.name.localeCompare(b.name, 'en'))
