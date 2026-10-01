/** The three research themes. Each owns an accent hue, so colour reads as navigation. */
export type ResearchTheme = 'learning' | 'dexterous' | 'reliable'

export type ResearchProject = {
  slug: string
  title: string
  subtitle?: string
  type: string
  theme: ResearchTheme
  /** When the project joined the site (YYYY-MM-DD): the first commit that
   *  added it to the catalogue. The research page sorts by it. */
  added: string
  /**
   * Set when the opening image is a light diagram rather than a dark photograph,
   * so the site bar swaps its scrim for its own ground. Measured, not guessed:
   * the strip behind the bar averages ~0.86 relative luminance on these two,
   * against 0.20–0.46 for the photographic heroes.
   */
  heroTone?: 'bright'
  image: string
  /** A short muted loop (public/media/hover-*.mp4) shown while a card is hovered or focused. */
  hoverVideo?: string
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

/** The lab's three research themes, in the order the research page presents them. */
export const researchThemes: Array<{ id: ResearchTheme, title: string, summary: string }> = [
  {
    id: 'learning',
    title: 'Learning from demonstration',
    summary: 'Visuomotor and action-chunking policies for robots learning coordinated behaviour from physical examples.',
  },
  {
    id: 'dexterous',
    title: 'Dexterous manipulation',
    summary: 'Hands, tools and multiple robotic arms working through contact-rich, long-horizon tasks.',
  },
  {
    id: 'reliable',
    title: 'Reliable autonomy',
    summary: 'Monitoring, calibrated intervention and constraint-aware adaptation for learned robot policies.',
  },
]

export const researchProjects: ResearchProject[] = [
  {
    slug: 'patch',
    title: 'PATCH',
    subtitle: 'Action-Chunk-Conditioned Latent Patch Innovation Monitoring for Robot Manipulation',
    type: 'Robot monitoring',
    theme: 'reliable',
    added: '2026-07-12',
    heroTone: 'bright',
    image: '/patch-method.webp',
    hoverVideo: '/media/hover-patch.mp4',
    externalUrl: '/research/patch/#towel-demo',
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
    slug: 'nestdex',
    title: 'NestDex',
    subtitle: 'Nested Policy Learning with Copilot Assisted Teleoperation for Dexterous Manipulation',
    type: 'Dexterous manipulation',
    theme: 'dexterous',
    added: '2026-08-13',
    image: '/nestdex-overview.webp',
    hoverVideo: '/media/hover-nestdex.mp4',
    externalUrl: '/research/nestdex/',
    externalLabel: 'Visit project site',
    topics: ['Dexterous manipulation', 'Shared autonomy', 'Imitation learning'],
    details: [
      'NestDex places learned, state-conditioned hand skills inside the demonstration-collection loop, allowing an operator to guide task-level arm motion while a copilot handles fine-grained finger coordination.',
      'The resulting complete-task demonstrations train a separate visuomotor policy that controls the arm and dexterous hand independently at deployment.',
    ],
    summary: 'Copilot-assisted demonstration collection for autonomous dexterous manipulation.',
    description: 'A nested policy-learning framework that turns reusable hand skills into reliable complete-task demonstrations and independent autonomous policies.',
  },
  {
    slug: 'trimanpolicy',
    title: 'TriManPolicy',
    subtitle: 'Coordinated Tri-Manual Visuomotor Imitation Learning',
    type: 'Tri-manual learning',
    theme: 'learning',
    added: '2026-07-12',
    image: '/trimanpolicy-baseline-dats.png',
    hoverVideo: '/media/hover-trimanpolicy.mp4',
    externalUrl: '/research/trimanpolicy/',
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
    slug: 'autointervene',
    title: 'AutoIntervene',
    subtitle: 'Calibrated Intervention for Action-Chunking Imitation Learning Policies',
    type: 'Robot intervention',
    theme: 'reliable',
    added: '2026-07-13',
    image: '/autointervene-bag-poster.webp',
    hoverVideo: '/media/hover-autointervene.mp4',
    externalUrl: '/research/autointervene/',
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
    slug: 'constraint-aware-streaming-flow',
    title: 'CASF',
    subtitle: 'Constraining Streaming Flow Models for Adapting Learned Robot Trajectory Distributions',
    type: 'Robot safety',
    theme: 'reliable',
    added: '2026-08-07',
    heroTone: 'bright',
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
  {
    slug: 'stereopatch',
    title: 'StereoPatch',
    subtitle: 'Patch-Aligned RGB–Depth Fusion for Spatial Perception in Robot Manipulation',
    type: 'Spatial perception',
    theme: 'learning',
    added: '2026-09-06',
    image: '/stereopatch-bowl.jpg',
    externalUrl: '/research/stereopatch/',
    externalLabel: 'Visit project site',
    topics: ['Spatial perception', 'RGB–depth fusion', 'Imitation learning'],
    details: [
      'StereoPatch retrieves registered DeFM geometry into DINOv3 RGB patch addresses before action decoding, forming a shared visual representation for ACT or Diffusion Policy.',
      'Real-robot experiments examine spatially demanding manipulation tasks, including bowl extraction, cup transfer and peg insertion.',
    ],
    summary: 'Patch-aligned RGB–depth fusion for spatially demanding robot manipulation.',
    description: 'StereoPatch connects visual appearance with metric geometry at the patches a robot policy already uses to choose its actions.',
  },
  {
    slug: 'mavp',
    title: 'MAVP',
    subtitle: 'Map-Aware Visuomotor Policies for Mobile Manipulation',
    type: 'Mobile manipulation',
    theme: 'learning',
    added: '2026-09-23',
    image: '/mavp-bag-packing.webp',
    hoverVideo: '/media/hover-mavp.mp4',
    externalUrl: '/research/mavp/',
    externalLabel: 'Visit project site',
    topics: ['Mobile manipulation', 'Visuomotor learning', 'Map-based localisation'],
    details: [
      'MAVP reconstructs a static map from demonstrations, aligns base poses in a shared map frame, and predicts base-pose targets alongside arm and gripper actions.',
      'Localisation feedback tracks these targets during execution. Real-world experiments span six mobile manipulation tasks, including drawer packing, conveyor picking and bag packing.',
    ],
    summary: 'Map-aware visuomotor policies that coordinate mobile base motion with manipulation.',
    description: 'MAVP gives mobile manipulation policies a shared spatial reference through map-frame base-pose targets and localisation feedback.',
  },
  {
    slug: 'saki',
    title: 'SAKI',
    subtitle: 'Skill Assembly and Kinematic Imitation from Human Videos for Long-Horizon Mobile Manipulation',
    type: 'Mobile manipulation',
    theme: 'learning',
    added: '2026-09-23',
    image: '/saki-overview.webp',
    hoverVideo: '/media/hover-saki.mp4',
    externalUrl: '/research/saki/',
    externalLabel: 'Visit project site',
    topics: ['Mobile manipulation', 'Object-centric imitation', 'Skill composition'],
    details: [
      'SAKI prepares reusable interaction requirements from human videos, retaining contact, orientation and terminal relations while allowing robot motion to adapt to the current scene.',
      'Object-role bindings and whole-body kinematic imitation coordinate base, arm and gripper motion. Retained scene estimates and the preceding robot configuration connect independently prepared skills into longer mobile tasks.',
    ],
    summary: 'Reusable interactions from human videos, assembled into longer mobile manipulation tasks.',
    description: 'SAKI separates reusable interaction requirements from scene-dependent robot motion, connecting human demonstrations through object-role binding and whole-body kinematic imitation.',
  },
]

/* Orders a visitor can choose on the research page. Ties on the same day
   fall back to catalogue position: later entries were added later. */
export type ProjectOrder = 'newest' | 'oldest' | 'theme' | 'title'

const cataloguePosition = new Map(researchProjects.map((project, index) => [project.slug, index]))
const position = (project: ResearchProject) => cataloguePosition.get(project.slug) ?? 0

export function newestFirst(left: ResearchProject, right: ResearchProject) {
  return right.added.localeCompare(left.added) || position(right) - position(left)
}

export function sortProjects(projects: readonly ResearchProject[], order: Exclude<ProjectOrder, 'theme'>) {
  const sorted = [...projects].sort(newestFirst)
  if (order === 'oldest') return sorted.reverse()
  if (order === 'title') return sorted.sort((left, right) => left.title.localeCompare(right.title, 'en', { sensitivity: 'base' }))
  return sorted
}
