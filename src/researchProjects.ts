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
    image: '/long-horizon-manipulation-poster.webp',
    hoverImage: '/long-horizon-manipulation.gif',
    videos: [
      {
        title: 'Long-horizon toaster demo',
        src: '/long-horizon-manipulation.mp4',
        poster: '/long-horizon-manipulation-poster.webp',
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
    hoverImage: '/triman-autonomous-hover.gif',
    externalUrl: '/research/trimanpolicy/',
    summary: 'Coordinated tri-manual visuomotor imitation learning for complex manipulation.',
    description: 'An in-progress project studying coordinated visuomotor policies across three robotic arms.',
  },
  {
    id: '04',
    slug: 'autointervene',
    title: 'AutoIntervene',
    subtitle: 'Calibrated Intervention for Action-Chunking Imitation Learning Policies',
    type: 'Robot intervention',
    image: '/autointervene-bag-poster.webp',
    hoverImage: '/autointervene-bag-hover.gif',
    videos: [
      {
        title: 'Bag packing',
        src: '/autointervene-bag.mp4',
        poster: '/autointervene-bag-poster.webp',
        caption: 'Multi-stage manipulation for organising objects and packing a soft bag.',
      },
      {
        title: 'Object disassembly',
        src: '/autointervene-disassembly.mp4',
        poster: '/autointervene-disassembly-poster.webp',
        caption: 'Coordinated manipulation for disassembling and separating object components.',
      },
      {
        title: 'Towel folding',
        src: '/autointervene-towel.mp4',
        poster: '/autointervene-towel-poster.webp',
        caption: 'Bimanual handling and folding of deformable fabric.',
      },
      {
        title: 'Vegetable sorting',
        src: '/autointervene-vegetable.mp4',
        poster: '/autointervene-vegetable-poster.webp',
        caption: 'Sorting and placing small objects into a structured tray.',
      },
    ],
    summary: 'Calibrated intervention for action-chunking imitation learning policies.',
    description: 'AutoIntervene monitors action-chunking policies and provides calibrated intervention across long-horizon manipulation tasks.',
  },
]
