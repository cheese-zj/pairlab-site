import type { VideoGroup, WallVideo } from '../videos'

export type Box = { x: number, y: number, w: number, h: number }

export type WallLayout = {
  tiles: Map<string, Box>
  boards: Map<string, Box>
  /** Wall-order position of each tile, top to bottom, for the entrance cascade. */
  rank: Map<string, number>
  height: number
}

/** Columns for a wall of this width: Pinterest-dense, never fewer than two. */
export function columnsFor(width: number) {
  if (width < 560) return 2
  if (width < 880) return 3
  if (width < 1180) return 4
  return 5
}

type Options = {
  width: number
  columns: number
  gap: number
  /** Keep a project's clips together on one board. */
  grouped: boolean
  /** Board padding and the height of its name row. */
  boardPad: number
  boardHead: number
}

type Unit =
  | { kind: 'tile', video: WallVideo, span: number }
  | { kind: 'board', group: VideoGroup, span: number }

/* A tile may be cropped to fill a hole or the wall's foot, within these
   bounds of its own height, so the footage never turns into a sliver. */
const minStretch = 0.7
const maxStretch = 1.45

/* Shortest-column masonry. A tile or board spanning several columns takes
   the run of columns whose tallest is lowest, leftmost on a tie. When that
   leaves a hole beside a shorter column, the next single tile that fits is
   pulled forward into it, so the wall stays dense while keeping roughly
   the curated order. */
export function layoutWall(groups: readonly VideoGroup[], options: Options): WallLayout {
  const { width, columns, gap, grouped, boardPad, boardHead } = options
  const columnWidth = (width - gap * (columns - 1)) / columns
  const spanWidth = (span: number) => span * columnWidth + (span - 1) * gap
  const heights = new Array<number>(columns).fill(0)
  // The single-column tile ending each column, if a tile ends it.
  const lastTile = new Array<Box | null>(columns).fill(null)
  const tiles = new Map<string, Box>()
  const boards = new Map<string, Box>()

  const units: Unit[] = groups.flatMap((group): Unit[] => {
    const span = Math.min(columns, group.span ?? 1)
    if (grouped && group.videos.length > 1) return [{ kind: 'board', group, span: Math.min(columns, Math.max(2, span)) }]
    return group.videos.map((video) => ({ kind: 'tile', video, span }))
  })
  const used = new Set<Unit>()

  const fillHole = (column: number, top: number, bottom: number, from: number) => {
    const room = bottom - top
    const fit = units.slice(from).find((unit) => {
      if (used.has(unit) || unit.kind !== 'tile' || unit.span !== 1) return false
      const natural = columnWidth / unit.video.aspect
      return room >= natural * minStretch && room <= natural * maxStretch
    })
    if (!fit || fit.kind !== 'tile') return
    used.add(fit)
    tiles.set(fit.video.id, { x: column * (columnWidth + gap), y: top, w: columnWidth, h: room })
  }

  const place = (span: number, height: number, from: number) => {
    let best = 0
    let bestTop = Infinity
    for (let start = 0; start + span <= columns; start += 1) {
      const top = Math.max(...heights.slice(start, start + span))
      if (top < bestTop) {
        best = start
        bestTop = top
      }
    }
    for (let column = best; column < best + span; column += 1) {
      if (bestTop - heights[column] > gap) fillHole(column, heights[column], bestTop - gap, from)
      heights[column] = bestTop + height + gap
      lastTile[column] = null
    }
    return { x: best * (columnWidth + gap), y: bestTop, w: spanWidth(span), h: height }
  }

  /* A board: the project's clips in two inner columns, the first taking the
     full width when the count is odd. The shorter column's last clip grows
     to close the board level. */
  const layoutBoard = (group: VideoGroup, span: number, from: number) => {
    const innerWidth = spanWidth(span) - boardPad * 2
    const innerGap = Math.round(gap * 0.75)
    const innerColumn = (innerWidth - innerGap) / 2
    const inner = [0, 0]
    const last: Array<Box | null> = [null, null]
    const placed: Array<[string, Box]> = []
    group.videos.forEach((video, index) => {
      if (index === 0 && group.videos.length % 2 === 1) {
        const h = innerWidth / video.aspect
        placed.push([video.id, { x: 0, y: 0, w: innerWidth, h }])
        inner[0] = inner[1] = h + innerGap
        return
      }
      const column = inner[0] <= inner[1] ? 0 : 1
      const box = { x: column * (innerColumn + innerGap), y: inner[column], w: innerColumn, h: innerColumn / video.aspect }
      placed.push([video.id, box])
      last[column] = box
      inner[column] += box.h + innerGap
    })
    const innerBottom = Math.max(...inner)
    last.forEach((box, column) => {
      if (box) box.h += innerBottom - inner[column]
    })
    const board = place(span, boardHead + innerBottom - innerGap + boardPad, from)
    boards.set(group.id, board)
    for (const [id, box] of placed) {
      tiles.set(id, { ...box, x: board.x + boardPad + box.x, y: board.y + boardHead + box.y })
    }
  }

  units.forEach((unit, index) => {
    if (used.has(unit)) return
    used.add(unit)
    if (unit.kind === 'board') {
      layoutBoard(unit.group, unit.span, index + 1)
      return
    }
    const box = place(unit.span, spanWidth(unit.span) / unit.video.aspect, index + 1)
    tiles.set(unit.video.id, box)
    if (unit.span === 1) lastTile[Math.round(box.x / (columnWidth + gap))] = box
  })

  /* The wall's foot: a column ending in a single tile lets that tile grow
     toward the lowest column, so the last row ends nearly level. */
  const floor = Math.max(...heights)
  lastTile.forEach((box, column) => {
    if (!box) return
    const grow = Math.min(floor - heights[column], box.h * (maxStretch - 1))
    box.h += grow
    heights[column] += grow
  })

  const rank = new Map(
    [...tiles.entries()]
      .sort(([, left], [, right]) => left.y + left.x * 0.35 - (right.y + right.x * 0.35))
      .map(([id], index) => [id, index]),
  )

  return { tiles, boards, rank, height: Math.max(0, ...heights) - gap }
}
