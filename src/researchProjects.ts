export type ResearchProject = {
  id: string
  slug: string
  title: string
  subtitle?: string
  type: string
  image: string
  hoverImage?: string
  externalUrl?: string
  externalLabel?: string
  topics: string[]
  details: string[]
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
    externalLabel: 'Visit project site',
    topics: ['Robot monitoring', 'Imitation learning', 'Reliable autonomy'],
    details: [
      'Learned robot policies can drift away from the intended task before a failure is obvious. PATCH studies action-conditioned perception as a way to recognise those execution changes earlier.',
      'The project focuses on structured intervention during long-horizon manipulation, connecting robot learning with practical monitoring for real-world deployment.',
    ],
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
    topics: ['Dexterous manipulation', 'Robot learning', 'Teleoperation'],
    details: [
      'This ongoing collection tests robotic hands on everyday tools and multi-stage tasks that demand contact, sequencing and recovery across longer horizons.',
      'The demonstrations combine autonomous execution with teleoperated data collection to study how capable manipulation behaviours can be learned from physical interaction.',
    ],
  },
  {
    id: '03',
    slug: 'trimanpolicy',
    title: 'TriManPolicy',
    subtitle: 'Coordinated Tri-Manual Visuomotor Imitation Learning',
    type: 'Tri-manual learning',
    image: '/trimanpolicy-baseline-dats.png',
    hoverImage: '/triman-autonomous-hover.gif',
    externalUrl: 'https://cheese-zj.github.io/trimanpolicy-site/',
    externalLabel: 'Visit project site',
    topics: ['Visuomotor imitation learning', 'Multi-arm manipulation', 'Robot learning'],
    details: [
      'TriManPolicy studies coordinated visuomotor policies for tasks involving three robotic arms, where perception and action must remain coupled across multiple manipulators.',
      'The work explores how imitation learning can represent coordinated tri-manual behaviour for complex physical tasks.',
    ],
    summary: 'Coordinated tri-manual visuomotor imitation learning for complex manipulation.',
    description: 'An in-progress project studying coordinated visuomotor policies across three robotic arms.',
  },
  {
    id: '04',
    slug: 'sai-dual-robot-collaboration',
    title: 'SAI',
    subtitle: 'A three-stage curriculum for dual-robot collaboration',
    type: 'Demo',
    image: '/sai-dual-robot-poster.webp',
    hoverImage: '/sai-dual-robot.gif',
    videos: [
      {
        title: 'Dual-robot collaborative manipulation',
        src: '/sai-dual-robot.mp4',
        poster: '/sai-dual-robot-poster.webp',
        caption: 'Coupled policies for dual-robot collaboration without synchronised dual-operator demonstrations or explicit inter-robot communication.',
      },
    ],
    summary: 'A three-stage curriculum for learning coupled dual-robot collaboration policies.',
    description: 'A collaborative mobile manipulation demo spanning bed making, laundry collection, and household interaction tasks.',
    topics: ['Collaborative robotics', 'Mobile manipulation', 'Robot learning'],
    details: [
      'SAI explores a three-stage learning curriculum for collaborative robots carrying out coupled household manipulation tasks.',
      'The demonstrations span bed making, laundry collection and household interaction without requiring synchronised dual-operator demonstrations or explicit inter-robot communication.',
    ],
  },
  {
    id: '05',
    slug: 'autointervene',
    title: 'AutoIntervene',
    subtitle: 'Calibrated Intervention for Action-Chunking Imitation Learning Policies',
    type: 'Robot intervention',
    image: '/autointervene-bag-poster.webp',
    hoverImage: '/autointervene-bag-hover.gif',
    externalUrl: 'https://123qwedsa123.github.io/AutoIntervene/',
    externalLabel: 'Visit project site',
    topics: ['Robot intervention', 'Imitation learning', 'Long-horizon manipulation'],
    details: [
      'AutoIntervene investigates calibrated intervention for action-chunking imitation learning policies operating across long-horizon manipulation tasks.',
      'The project connects policy confidence with timely human support, aiming to make learned robot behaviour more practical to supervise in real environments.',
    ],
    summary: 'Calibrated intervention for action-chunking imitation learning policies.',
    description: 'AutoIntervene monitors action-chunking policies and provides calibrated intervention across long-horizon manipulation tasks.',
  },
  {
    id: '06',
    slug: 'constraint-aware-streaming-flow',
    title: 'CASF',
    subtitle: 'Constraining Streaming Flow Models for Adapting Learned Robot Trajectory Distributions',
    type: 'Robot safety',
    image: '/casf-overview.webp',
    externalUrl: 'https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=11610877',
    externalLabel: 'Read the paper',
    topics: ['Robot safety', 'Motion generation', 'Constraint-aware learning'],
    details: [
      'CASF adapts learned robot trajectory distributions after training by reshaping streaming-flow velocity fields with constraint-dependent metrics.',
      'The method addresses collision avoidance, joint limits and feasible workspaces without retraining the underlying policy.',
    ],
    summary: 'Constraint-aware post-training adaptation for safe, collision-free streaming flow policies.',
    description: 'CASF reshapes learned streaming-flow velocity fields with constraint-dependent metrics, enforcing collision avoidance, joint limits, and feasible workspaces without retraining.',
  },
]
