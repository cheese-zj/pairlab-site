export type ResearchProject = {
  id: string
  slug: string
  title: string
  subtitle?: string
  type: string
  image: string
  hoverImage?: string
  externalUrl?: string
  videos?: Array<{
    title: string
    src: string
    poster?: string
    caption?: string
  }>
  summary: string
  description: string
}

export const researchProjects: ResearchProject[] = [
  {
    id: '01',
    slug: 'patch',
    title: 'PATCH',
    subtitle: 'Action-Chunk-Conditioned Latent Patch Innovation Monitoring for Robot Manipulation',
    type: 'Robot monitoring',
    image: '/patch-method.webp',
    hoverImage: '/patch-towel-rollout.gif',
    externalUrl: 'https://yananzhou5555.github.io/PATCH/#towel-demo',
    summary: 'Action-chunk-conditioned robot monitoring for timely, structured intervention.',
    description: 'PATCH monitors robot behaviour through action-conditioned perception and routes structured intervention when execution needs support.',
  },
  {
    id: '02',
    slug: 'motion-and-manipulation',
    title: 'Dexterous hands using tools',
    subtitle: 'Autonomous and teleoperated manipulation demos',
    type: 'In progress',
    image: '/long-horizon-manipulation.gif',
    videos: [
      {
        title: 'Long-horizon toaster demo',
        src: '/long-horizon-manipulation.mp4',
        caption: 'Robot manipulation and teleoperation data collection in a multi-stage toaster task.',
      },
      {
        title: 'Punch paper and file it',
        src: '/dexterous-paper-folder.mp4',
        caption: 'Dexterous tool use for punching holes in paper and placing it into a folder.',
      },
      {
        title: 'WuJi hand — autonomous',
        src: '/dexterous-wujihand.mp4',
        caption: 'Autonomous dexterous hand manipulation with the WuJi hand platform.',
      },
    ],
    summary: 'Dexterous hands using everyday tools across autonomous and teleoperated tasks.',
    description: 'An in-progress demo collection exploring dexterous tool use, multi-stage manipulation, and long-horizon data collection.',
  },
  {
    id: '03',
    slug: 'trimanpolicy',
    title: 'TriManPolicy',
    subtitle: 'Coordinated Tri-Manual Visuomotor Imitation Learning',
    type: 'In progress',
    image: '/trimanpolicy-baseline-dats.png',
    videos: [
      {
        title: 'Autonomous three-arm policy',
        src: '/triman-autonomous.mp4',
        poster: '/triman-autonomous-poster.webp',
        caption: 'A coordinated autonomous three-arm policy for multi-stage object manipulation.',
      },
      {
        title: 'Tri-manual demo collection',
        src: '/triman-demo-collection.mp4',
        poster: '/triman-collection-poster.webp',
        caption: 'A collection of coordinated tri-manual manipulation tasks and behaviours.',
      },
      {
        title: 'Coordinated cloth manipulation',
        src: '/triman-cloth.mp4',
        poster: '/triman-cloth-poster.webp',
        caption: 'Three robotic arms coordinating to lift and manipulate deformable cloth.',
      },
    ],
    summary: 'Coordinated tri-manual visuomotor imitation learning for complex manipulation.',
    description: 'An in-progress project studying coordinated visuomotor policies across three robotic arms.',
  },
  {
    id: '04',
    slug: 'robotic-systems',
    title: 'Robotic systems',
    type: 'Systems',
    image: '/research-systems.svg',
    summary: 'Platforms, data and evaluation infrastructure for real robots.',
    description: 'Our systems research connects hardware, data, software, and evaluation infrastructure so new methods can be tested on real robots in meaningful settings.',
  },
]
