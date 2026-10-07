import { researchProjects } from './researchProjects'
import type { ResearchProject, ResearchTheme } from './researchProjects'

/* The /videos wall. Media is made by scripts/encode-video-wall.sh: every
   entry has a full clip, a short muted loop cropped to the tile's shape and
   the loop's first frame, all under public/media/wall/. */

export type WallVideo = {
  id: string
  /** Shown on hover and in the expanded view. Omit to use the project's name alone. */
  title?: string
  /** Tile shape, width / height. Must match the crop in the encode script. */
  aspect: number
  /** Shape of the full clip, so the expanded view can size its frame before it loads. */
  sourceAspect: number
  /** How much faster the tile loop runs than the footage. */
  loopSpeed?: number
  /** Labels laid over the footage, in fractions of the frame. */
  marks?: Array<{ label: string, x: number, y: number }>
}

export type VideoGroup = {
  id: string
  /** The project the footage belongs to; its name labels the group. */
  project?: string
  /** Used when the group has no project. */
  label?: string
  /** How many wall columns the group's tiles want. A group of several always takes two. */
  span?: number
  videos: WallVideo[]
}

/* Array order is the curated ("Featured") order: move an entry to rerank the
   wall. Clips from one project form a group and sit together. */
export const videoGroups: VideoGroup[] = [
  {
    id: 'real-to-sim',
    label: 'Real to sim',
    span: 3,
    videos: [
      {
        id: 'real-to-sim',
        aspect: 1320 / 540,
        sourceAspect: 2640 / 1080,
        marks: [
          { label: 'Real', x: 1920 / 2640, y: 0 },
          { label: 'Sim', x: 1920 / 2640, y: 0.5 },
        ],
      },
    ],
  },
  {
    id: 'trimanpolicy',
    project: 'trimanpolicy',
    videos: [
      { id: 'triman-cloth', title: 'Tri-manual garment hanging', aspect: 1.6, sourceAspect: 16 / 9, loopSpeed: 3 },
      { id: 'triman-autonomous', title: 'Autonomous three-arm policy', aspect: 0.8, sourceAspect: 16 / 9, loopSpeed: 2 },
      { id: 'triman-collection', title: 'Tri-manual demo collection', aspect: 1, sourceAspect: 16 / 9, loopSpeed: 2 },
    ],
  },
  {
    id: 'saki',
    project: 'saki',
    videos: [{ id: 'saki-reel', aspect: 0.8, sourceAspect: 16 / 9 }],
  },
  {
    id: 'nestdex',
    project: 'nestdex',
    videos: [
      { id: 'nestdex-reel', title: 'Dexterity', aspect: 16 / 9, sourceAspect: 16 / 9 },
      { id: 'nestdex-toaster', title: 'Long-horizon toaster demo', aspect: 1.6, sourceAspect: 1138 / 640, loopSpeed: 3 },
      { id: 'nestdex-wujihand', title: 'Autonomous WuJi hand', aspect: 1, sourceAspect: 16 / 9, loopSpeed: 1.5 },
      { id: 'nestdex-paper', title: 'Punch paper and file it', aspect: 0.8, sourceAspect: 16 / 9, loopSpeed: 3 },
    ],
  },
  {
    id: 'autointervene',
    project: 'autointervene',
    videos: [
      { id: 'autointervene-bag', title: 'Bag packing', aspect: 1, sourceAspect: 16 / 9, loopSpeed: 2 },
      { id: 'autointervene-disassembly', title: 'Object disassembly', aspect: 0.8, sourceAspect: 16 / 9, loopSpeed: 2 },
      { id: 'autointervene-towel', title: 'Towel folding', aspect: 718 / 540, sourceAspect: 16 / 9, loopSpeed: 2 },
      { id: 'autointervene-vegetable', title: 'Vegetable sorting', aspect: 0.75, sourceAspect: 16 / 9, loopSpeed: 1.5 },
    ],
  },
  {
    id: 'mavp',
    project: 'mavp',
    videos: [{ id: 'mavp-reel', aspect: 0.75, sourceAspect: 16 / 9 }],
  },
  {
    id: 'patch',
    project: 'patch',
    videos: [{ id: 'patch-towel', title: 'Towel rollout', aspect: 0.8, sourceAspect: 16 / 9, loopSpeed: 1.5 }],
  },
  {
    id: 'core',
    project: 'core',
    videos: [{ id: 'core-box', title: 'Box assembly', aspect: 1, sourceAspect: 16 / 9, loopSpeed: 1.5 }],
  },
]

export const wallMedia = (id: string) => ({
  src: `/media/wall/${id}.mp4`,
  loop: `/media/wall/${id}-loop.mp4`,
  poster: `/media/wall/${id}.webp`,
})

export function groupProject(group: VideoGroup): ResearchProject | undefined {
  return group.project ? researchProjects.find((project) => project.slug === group.project) : undefined
}

export function groupLabel(group: VideoGroup) {
  return groupProject(group)?.title ?? group.label ?? ''
}

export function groupTheme(group: VideoGroup): ResearchTheme | undefined {
  return groupProject(group)?.theme
}

/* Shuffle is seeded, so one deal stays stable across renders and each
   press of Shuffle deals a new one. */
function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled<T>(items: readonly T[], random: () => number) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

/** Seed 0 is the curated order; any other seed deals a shuffle. */
export function orderGroups(seed: number): VideoGroup[] {
  if (seed === 0) return videoGroups
  const random = seededRandom(seed)
  return shuffled(videoGroups, random).map((group) => ({ ...group, videos: shuffled(group.videos, random) }))
}
