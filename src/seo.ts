import { labLead, labMembers } from './people'
import { researchProjects } from './researchProjects'

export const siteUrl = 'https://aus.bot'

export function normalisePath(pathname: string) {
  if (pathname.length > 1) return pathname.replace(/\/+$/, '')
  return pathname
}

export function canonicalUrl(pathname: string) {
  const path = normalisePath(pathname)
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}/`
}

export type SeoData = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  structuredData: Record<string, unknown>[]
}

const organisation = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  '@id': `${siteUrl}/#organisation`,
  name: 'PAIR Lab',
  alternateName: 'Physical AI and Robotics Lab',
  url: siteUrl,
  logo: `${siteUrl}/pairlab-emblem.png`,
  image: `${siteUrl}/pairlab-humanoid.webp`,
  description: 'A University of Sydney research lab advancing physical AI, robot learning and robotic manipulation in Australia.',
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: 'The University of Sydney',
    url: 'https://www.sydney.edu.au/',
  },
  founder: {
    '@type': 'Person',
    name: labLead.name,
    url: 'https://www.weimingzhi.com/',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sydney',
    addressRegion: 'NSW',
    postalCode: '2006',
    addressCountry: 'AU',
  },
  knowsAbout: [
    'Physical intelligence',
    'Robot learning',
    'Robotic manipulation',
    'Imitation learning',
    'Collaborative robotics',
    'Reliable autonomy',
  ],
}

function breadcrumb(path: string, name: string, parent?: { path: string, name: string }) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'PAIR Lab', item: siteUrl },
  ]

  if (parent) items.push({ '@type': 'ListItem', position: 2, name: parent.name, item: `${siteUrl}${parent.path}` })
  items.push({ '@type': 'ListItem', position: items.length + 1, name, item: `${siteUrl}${path}` })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

const staticPages: Record<string, Omit<SeoData, 'path'>> = {
  '/': {
    title: 'Robotics & Physical AI Lab in Australia | PAIR Lab',
    description: 'PAIR Lab at the University of Sydney researches physical AI, robot learning, imitation learning and dexterous robotic manipulation in Australia.',
    image: '/pairlab-humanoid.webp',
    type: 'website',
    structuredData: [organisation],
  },
  '/research': {
    title: 'Robotics Research & Publications | PAIR Lab Sydney',
    description: 'Explore PAIR Lab projects and publications in physical intelligence, robot learning, manipulation, motion generation and collaborative robotics.',
    image: '/pairlab-dual-arm.webp',
    type: 'website',
    structuredData: [
      breadcrumb('/research', 'Research'),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'PAIR Lab robotics research',
        url: `${siteUrl}/research`,
        description: 'Research projects and publications in physical AI, robot learning and robotic manipulation at the University of Sydney.',
        isPartOf: { '@id': `${siteUrl}/#organisation` },
      },
    ],
  },
  '/people': {
    title: 'Robotics Researchers at PAIR Lab | University of Sydney',
    description: 'Meet the PAIR Lab researchers working on physical AI, robot learning and robotic manipulation at the University of Sydney.',
    image: '/weiming-zhi.webp',
    type: 'website',
    structuredData: [
      breadcrumb('/people', 'People'),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'PAIR Lab people',
        url: `${siteUrl}/people`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [labLead, ...labMembers].map((person, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Person',
              name: person.name,
              affiliation: { '@id': `${siteUrl}/#organisation` },
              ...(person.links.length > 0 ? { sameAs: person.links.filter((link) => link.href.startsWith('http')).map((link) => link.href) } : {}),
            },
          })),
        },
      },
    ],
  },
  '/join': {
    title: 'Robotics Research Opportunities in Sydney | PAIR Lab',
    description: 'Enquire about PhD research, student projects, academic collaboration and industry partnerships in robot learning and physical AI at PAIR Lab.',
    image: '/pairlab-demo.webp',
    type: 'website',
    structuredData: [breadcrumb('/join', 'Join PAIR Lab')],
  },
}

export function getSeoData(pathname: string): SeoData {
  const path = normalisePath(pathname)
  const staticPage = staticPages[path]
  if (staticPage) return { ...staticPage, path }

  const project = researchProjects.find((item) => `/research/preview/${item.slug}` === path)
  if (project) {
    return {
      title: `${project.title}: ${project.topics[0]} | PAIR Lab`,
      description: project.summary,
      path,
      image: project.image,
      type: 'article',
      structuredData: [
        breadcrumb(path, project.title, { path: '/research', name: 'Research' }),
        {
          '@context': 'https://schema.org',
          '@type': 'ResearchProject',
          name: project.title,
          alternateName: project.subtitle,
          url: `${siteUrl}${path}`,
          image: `${siteUrl}${project.image}`,
          description: project.description,
          keywords: project.topics,
          parentOrganization: { '@id': `${siteUrl}/#organisation` },
        },
      ],
    }
  }

  return {
    title: 'Page not found | PAIR Lab',
    description: 'The requested page could not be found.',
    path,
    noindex: true,
    type: 'website',
    structuredData: [],
  }
}

export const prerenderPaths = [
  '/',
  '/research',
  ...researchProjects.map((project) => `/research/preview/${project.slug}`),
  '/people',
  '/join',
]

export const sitemapPaths = [
  ...prerenderPaths,
  '/research/patch/',
  '/research/trimanpolicy/',
  '/research/autointervene/',
]
