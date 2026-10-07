import { researchProjects } from './researchProjects'
import type { ResearchProject, ResearchTheme } from './researchProjects'

/* The /videos wall. scripts/encode-video-wall.sh makes every clip's short
   muted loop (cropped to the tile's shape) and its poster under
   public/media/wall/. The full clip is either beside them or, for footage a
   project site already publishes, streamed from that site. */

export type WallVideo = {
  id: string
  /** Shown on hover and in the expanded view. Omit to use the group's name alone. */
  title?: string
  /** Tile shape, width / height. Must match the crop in the encode script. */
  aspect: number
  /** Shape of the full clip, so the expanded view can size its frame before it loads. */
  sourceAspect: number
  /** The full clip, when a project site publishes it. Otherwise /media/wall/<id>.mp4. */
  src?: string
  /** Playback speed of the full clip as published, when the project states it. */
  sourceSpeed?: number
  /** How much faster the tile loop runs than the full clip. */
  loopSpeed?: number
  /** A short label laid over the footage, such as which view is real. */
  mark?: string
  /** Where the clip sits in a synced group's tile (a CSS grid-area). */
  area?: string
}

export type VideoGroup = {
  id: string
  /** The project the footage belongs to; its page is linked from the group. */
  project?: string
  /** The group's name. Defaults to the project's title. */
  label?: string
  /** How many wall columns the group wants. A board of several always takes two or more. */
  span?: number
  /**
   * Clips recorded together. The wall shows them as one tile playing in step
   * (laid out by `columns` and each clip's `area`); the expanded view plays
   * them together or one at a time.
   */
  synced?: { aspect: number, columns: string, rows: string }
  videos: WallVideo[]
}

const sites = {
  stereopatch: 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/',
  core: 'https://yananzhou.me/core/assets/media/',
  patch: 'https://yananzhou.me/PATCH/media/offline-cases/',
  saki: 'https://cheese-zj.github.io/saki-site/assets/clips/',
  trimanpolicy: 'https://cheese-zj.github.io/trimanpolicy-site/videos/',
  nestdex: 'https://cheese-zj.github.io/nestdex-site/videos/',
  autointervene: 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/',
  mavp: 'https://123qwedsa123.github.io/mavp/assets/videos/',
}

const wide = 16 / 9

/* Array order is the curated ("Featured") order: move an entry to rerank the
   wall. Clips from one project form a group and sit together. Titles and
   speeds are the ones each project site uses. */
export const videoGroups: VideoGroup[] = [
  {
    id: 'real-to-sim',
    // A new line of work in the lab, not yet a research project.
    label: 'Real to sim',
    span: 3,
    synced: { aspect: 2640 / 1080, columns: '1920fr 720fr', rows: '1fr 1fr' },
    videos: [
      { id: 'real-to-sim-third', title: 'Sim, third person', mark: 'Sim', aspect: wide, sourceAspect: wide, area: '1 / 1 / 3 / 2' },
      { id: 'real-to-sim-real', title: 'Real', mark: 'Real', aspect: 4 / 3, sourceAspect: 4 / 3, area: '1 / 2 / 2 / 3' },
      { id: 'real-to-sim-sim', title: 'Sim', mark: 'Sim', aspect: 4 / 3, sourceAspect: 4 / 3, area: '2 / 2 / 3 / 3' },
    ],
  },
  {
    id: 'trimanpolicy',
    project: 'trimanpolicy',
    videos: [
      { id: 'triman-towelhang', title: 'TowelHang', aspect: 1.6, sourceAspect: wide, src: `${sites.trimanpolicy}towelhang/primary.mp4` },
      { id: 'triman-totecards', title: 'ToteCards', aspect: 0.8, sourceAspect: wide, src: `${sites.trimanpolicy}totecards/primary.mp4` },
      { id: 'triman-bagtape', title: 'BagTape', aspect: 1, sourceAspect: wide, src: `${sites.trimanpolicy}bagtape/primary.mp4` },
      { id: 'triman-lideraser', title: 'LidEraser', aspect: 0.75, sourceAspect: wide, src: `${sites.trimanpolicy}lideraser/primary.mp4` },
      { id: 'triman-traywipe', title: 'TrayWipe', aspect: 1.25, sourceAspect: wide, src: `${sites.trimanpolicy}traywipe/primary.mp4` },
      { id: 'triman-bintowel', title: 'BinTowel', aspect: 0.8, sourceAspect: wide, src: `${sites.trimanpolicy}bintowel/primary.mp4` },
      { id: 'triman-autonomous', title: 'Autonomous three-arm policy', aspect: 0.8, sourceAspect: wide, loopSpeed: 2 },
      { id: 'triman-collection', title: 'Tri-manual demo collection', aspect: 1, sourceAspect: wide, loopSpeed: 2 },
    ],
  },
  {
    id: 'saki',
    project: 'saki',
    videos: [
      { id: 'saki-reel', aspect: 0.8, sourceAspect: wide },
      { id: 'saki-tidy', title: 'Tidy and wipe', aspect: 1.25, sourceAspect: wide, src: `${sites.saki}tidy.mp4`, sourceSpeed: 8 },
      { id: 'saki-pour', title: 'Collect a ball, carry the cup and pour', aspect: 0.8, sourceAspect: wide, src: `${sites.saki}pour.mp4`, sourceSpeed: 16 },
      { id: 'saki-collect', title: 'Carry a basket, collect at two tables', aspect: 1, sourceAspect: 996 / 720, src: `${sites.saki}collect.mp4`, sourceSpeed: 12 },
      { id: 'saki-wipe', title: 'Wipe the whiteboard', aspect: 0.75, sourceAspect: wide, src: `${sites.saki}wipe.mp4`, sourceSpeed: 4 },
      { id: 'saki-door', title: 'Turn the handle and open the door', aspect: 0.8, sourceAspect: wide, src: `${sites.saki}door.mp4`, sourceSpeed: 4 },
      { id: 'saki-box', title: 'Hold the lid, place inside, close', aspect: 1.25, sourceAspect: wide, src: `${sites.saki}box.mp4`, sourceSpeed: 5 },
      { id: 'saki-grid', title: 'Works in layouts it has never seen', aspect: 1, sourceAspect: 768 / 420, src: `${sites.saki}grid.mp4` },
    ],
  },
  {
    id: 'nestdex',
    project: 'nestdex',
    videos: [
      { id: 'nestdex-reel', title: 'Dexterity', aspect: wide, sourceAspect: wide },
      { id: 'nestdex-tongs', title: 'Tongs transfer', aspect: 0.8, sourceAspect: wide, src: `${sites.nestdex}tongs/01.mp4` },
      { id: 'nestdex-wujihand', title: 'Autonomous WuJi hand', aspect: 1, sourceAspect: wide, loopSpeed: 1.5 },
      { id: 'nestdex-bottle', title: 'Bottle disposal', aspect: 0.75, sourceAspect: wide, src: `${sites.nestdex}bottle/01.mp4` },
      { id: 'nestdex-dual-object', title: 'Dual-object transfer', aspect: 1, sourceAspect: wide, src: `${sites.nestdex}dual-object/01.mp4` },
      { id: 'nestdex-toast', title: 'Toast preparation', aspect: 1.25, sourceAspect: wide, src: `${sites.nestdex}toast/01.mp4` },
      { id: 'nestdex-binder', title: 'Binder filing', aspect: 0.8, sourceAspect: wide, src: `${sites.nestdex}binder/01.mp4` },
    ],
  },
  {
    id: 'stereopatch',
    project: 'stereopatch',
    videos: [
      { id: 'stereopatch-bowl', title: 'Bowl extraction', aspect: 1.25, sourceAspect: wide, src: `${sites.stereopatch}bowl-1080p60.mp4`, sourceSpeed: 4 },
      { id: 'stereopatch-placement', title: 'Placement', aspect: 0.8, sourceAspect: wide, src: `${sites.stereopatch}placement-1080p60.mp4`, sourceSpeed: 2 },
      { id: 'stereopatch-picking', title: 'Object picking', aspect: 1, sourceAspect: wide, src: `${sites.stereopatch}picking-1080p60.mp4`, sourceSpeed: 2 },
      { id: 'stereopatch-peg', title: 'Peg insertion', aspect: 0.75, sourceAspect: wide, src: `${sites.stereopatch}peg-1080p60.mp4`, sourceSpeed: 4 },
      { id: 'stereopatch-picnic', title: 'Picnic-bag packing', aspect: 1, sourceAspect: wide, src: `${sites.stereopatch}picnic-1080p60.mp4`, sourceSpeed: 4 },
      { id: 'stereopatch-cup', title: 'Cup transfer', aspect: 0.8, sourceAspect: wide, src: `${sites.stereopatch}cup-1080p60.mp4`, sourceSpeed: 4 },
    ],
  },
  {
    id: 'core',
    project: 'core',
    videos: [
      { id: 'core-box', title: 'Box assembly', aspect: 1, sourceAspect: wide, src: `${sites.core}box.mp4`, sourceSpeed: 2, loopSpeed: 1.5 },
      { id: 'core-pan', title: 'Pan transport', aspect: 0.8, sourceAspect: wide, src: `${sites.core}pan.mp4` },
      { id: 'core-bridge', title: 'Bridge assembly', aspect: 1.25, sourceAspect: wide, src: `${sites.core}bridge.mp4` },
      { id: 'core-stack', title: 'Block stacking', aspect: 0.75, sourceAspect: wide, src: `${sites.core}stack.mp4` },
      { id: 'core-exchange', title: 'Block exchange', aspect: 1, sourceAspect: wide, src: `${sites.core}exchange.mp4` },
      { id: 'core-box-perturbed', title: 'Box assembly, perturbed', aspect: 0.8, sourceAspect: 1080 / 608, src: `${sites.core}box_success_perturbed.mp4`, sourceSpeed: 4 },
    ],
  },
  {
    id: 'autointervene',
    project: 'autointervene',
    videos: [
      { id: 'ai-towel-bag', title: 'Towel bagging', aspect: 1.25, sourceAspect: wide, src: `${sites.autointervene}towel-bagging.mp4` },
      { id: 'ai-peg', title: 'Peg disassembly', aspect: 0.8, sourceAspect: wide, src: `${sites.autointervene}peg-disassembly.mp4` },
      { id: 'ai-potato', title: 'Potato transfer', aspect: 1, sourceAspect: wide, src: `${sites.autointervene}potato-transfer.mp4` },
      { id: 'ai-towel-fold', title: 'Towel folding', aspect: 0.75, sourceAspect: wide, src: `${sites.autointervene}towel-folding.mp4` },
      { id: 'ai-lidded', title: 'Lidded box packing', aspect: 1, sourceAspect: wide, src: `${sites.autointervene}lidded-box-packing.mp4` },
      { id: 'ai-plant', title: 'Plant sorting', aspect: 0.8, sourceAspect: wide, src: `${sites.autointervene}plant-sorting.mp4` },
      { id: 'ai-towel-box', title: 'Towel box packing', aspect: 1.25, sourceAspect: wide, src: `${sites.autointervene}towel-box-packing.mp4` },
      { id: 'ai-two-towel', title: 'Two-towel box packing', aspect: 0.8, sourceAspect: wide, src: `${sites.autointervene}two-towel-box-packing.mp4` },
      { id: 'ai-cable', title: 'Towels-and-cable bagging', aspect: 1, sourceAspect: wide, src: `${sites.autointervene}towels-and-cable-bagging.mp4` },
    ],
  },
  {
    id: 'mavp',
    project: 'mavp',
    videos: [
      { id: 'mavp-reel', aspect: 0.75, sourceAspect: wide },
      { id: 'mavp-drawer', title: 'Drawer packing', aspect: 1.25, sourceAspect: wide, src: `${sites.mavp}01-drawer-packing.mp4` },
      { id: 'mavp-deliver', title: 'Disassemble and deliver', aspect: 0.8, sourceAspect: wide, src: `${sites.mavp}02-disassemble-and-deliver.mp4` },
      { id: 'mavp-lidded', title: 'Lidded box packing', aspect: 1, sourceAspect: wide, src: `${sites.mavp}03-lidded-box-packing.mp4` },
      { id: 'mavp-conveyor', title: 'Conveyor picking', aspect: 0.8, sourceAspect: wide, src: `${sites.mavp}04-conveyor-picking.mp4` },
      { id: 'mavp-dual-drawer', title: 'Dual-drawer return', aspect: 1, sourceAspect: wide, src: `${sites.mavp}05-dual-drawer-return.mp4` },
      { id: 'mavp-bag', title: 'Bag packing', aspect: 1.25, sourceAspect: wide, src: `${sites.mavp}06-bag-packing.mp4` },
    ],
  },
  {
    id: 'patch',
    project: 'patch',
    videos: [
      { id: 'patch-towel', title: 'Towel rollout', aspect: 0.8, sourceAspect: wide, loopSpeed: 1.5 },
      { id: 'patch-clean', title: 'Clean execution', aspect: 1, sourceAspect: 4 / 3, src: `${sites.patch}left-c1-clean-h264.mp4` },
      { id: 'patch-static', title: 'Static change', aspect: 0.8, sourceAspect: 4 / 3, src: `${sites.patch}left-c2-static-change-h264.mp4` },
      { id: 'patch-transient', title: 'Transient obstruction', aspect: 1, sourceAspect: 4 / 3, src: `${sites.patch}left-c3-transient-obstruction-h264.mp4` },
      { id: 'patch-persistent', title: 'Persistent obstruction', aspect: 0.8, sourceAspect: 4 / 3, src: `${sites.patch}left-c4-persistent-obstruction-h264.mp4` },
    ],
  },
  {
    id: 'core-sim',
    project: 'core',
    label: 'CoRE in simulation',
    videos: [
      { id: 'core-sim-threestack', title: 'Three-robot stacking', aspect: 1, sourceAspect: 960 / 620, src: `${sites.core}RoboFactory_ThreeStack.mp4`, sourceSpeed: 2 },
      { id: 'core-sim-takephoto', title: 'Take photo', aspect: 0.8, sourceAspect: 960 / 670, src: `${sites.core}RoboFactory_TakePhoto.mp4`, sourceSpeed: 2 },
      { id: 'core-sim-carry', title: 'Carry pot', aspect: 1.25, sourceAspect: wide, src: `${sites.core}DuoBench_Carry.mp4` },
      { id: 'core-sim-ballmaze', title: 'Ball maze', aspect: 1, sourceAspect: wide, src: `${sites.core}DuoBench_BallMaze.mp4` },
    ],
  },
]

export const wallMedia = (video: WallVideo) => ({
  src: video.src ?? `/media/wall/${video.id}.mp4`,
  loop: `/media/wall/${video.id}-loop.mp4`,
  poster: `/media/wall/${video.id}.webp`,
})

/** The speed a tile's loop runs at against real time, when it is known to differ. */
export function loopSpeedLabel(video: WallVideo) {
  const speed = (video.sourceSpeed ?? 1) * (video.loopSpeed ?? 1)
  return speed > 1 ? `${+speed.toFixed(1)}×` : null
}

export function groupProject(group: VideoGroup): ResearchProject | undefined {
  return group.project ? researchProjects.find((project) => project.slug === group.project) : undefined
}

export function groupLabel(group: VideoGroup) {
  return group.label ?? groupProject(group)?.title ?? ''
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

/** Seed 0 is the curated order; any other seed deals a shuffle. Synced clips keep their places. */
export function orderGroups(seed: number): VideoGroup[] {
  if (seed === 0) return videoGroups
  const random = seededRandom(seed)
  return shuffled(videoGroups, random).map((group) => (group.synced ? group : { ...group, videos: shuffled(group.videos, random) }))
}
