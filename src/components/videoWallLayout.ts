import type { VideoGroup } from '../videos'

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

/* Tiles crop to fill whatever box they are given, so the layout may stretch
   or squash a tile within these bounds of its own shape. Beyond them the
   footage would turn into a sliver. */
const minStretch = 0.7
const maxStretch = 1.45

type Tile = { id: string, aspect: number, span: number, rigid: boolean }

function rankOf(tiles: Map<string, Box>) {
  return new Map(
    [...tiles.entries()]
      .sort(([, left], [, right]) => left.y + left.x * 0.35 - (right.y + right.x * 0.35))
      .map(([id], index) => [id, index]),
  )
}

/** One tile per clip (a synced group is one tile), in group order. */
function tilesOf(groups: readonly VideoGroup[], columns: number): Tile[] {
  return groups.flatMap((group): Tile[] => {
    const span = Math.min(columns, group.span ?? 1)
    if (group.synced) return [{ id: group.id, aspect: group.synced.aspect, span, rigid: true }]
    return group.videos.map((video) => ({ id: video.id, aspect: video.aspect, span, rigid: false }))
  })
}

export function layoutWall(groups: readonly VideoGroup[], options: Options): WallLayout {
  return options.grouped ? layoutBoards(groups, options) : layoutLoose(groups, options)
}

/* Loose: shortest-column masonry over every clip. A tile spanning several
   columns takes the run of columns whose tallest is lowest, leftmost on a
   tie. When that leaves a hole beside a shorter column, the next single tile
   that fits is pulled forward into it, and at the foot each column's last
   tile grows toward the lowest, so the wall stays dense and nearly level
   while keeping roughly the curated order. */
function layoutLoose(groups: readonly VideoGroup[], options: Options): WallLayout {
  const { width, columns, gap } = options
  const columnWidth = (width - gap * (columns - 1)) / columns
  const spanWidth = (span: number) => span * columnWidth + (span - 1) * gap
  const heights = new Array<number>(columns).fill(0)
  const lastTile = new Array<Box | null>(columns).fill(null)
  const boxes = new Map<string, Box>()
  const units = tilesOf(groups, columns)
  const used = new Set<Tile>()

  const fillHole = (column: number, top: number, bottom: number, from: number) => {
    const room = bottom - top
    const fit = units.slice(from).find((unit) => {
      if (used.has(unit) || unit.span !== 1) return false
      const natural = columnWidth / unit.aspect
      return room >= natural * minStretch && room <= natural * maxStretch
    })
    if (!fit) return
    used.add(fit)
    boxes.set(fit.id, { x: column * (columnWidth + gap), y: top, w: columnWidth, h: room })
  }

  units.forEach((unit, index) => {
    if (used.has(unit)) return
    used.add(unit)
    let best = 0
    let bestTop = Infinity
    for (let start = 0; start + unit.span <= columns; start += 1) {
      const top = Math.max(...heights.slice(start, start + unit.span))
      if (top < bestTop) {
        best = start
        bestTop = top
      }
    }
    const box = { x: best * (columnWidth + gap), y: bestTop, w: spanWidth(unit.span), h: spanWidth(unit.span) / unit.aspect }
    for (let column = best; column < best + unit.span; column += 1) {
      if (bestTop - heights[column] > gap) fillHole(column, heights[column], bestTop - gap, index + 1)
      heights[column] = bestTop + box.h + gap
      lastTile[column] = null
    }
    boxes.set(unit.id, box)
    if (unit.span === 1 && !unit.rigid) lastTile[best] = box
  })

  const floor = Math.max(...heights)
  lastTile.forEach((box, column) => {
    if (!box) return
    const grow = Math.min(floor - heights[column], box.h * (maxStretch - 1))
    box.h += grow
    heights[column] += grow
  })

  return { tiles: boxes, boards: new Map(), rank: rankOf(boxes), height: Math.max(0, ...heights) - gap }
}

/* A board's clips in k inner columns, before it is fitted to a row. On a
   narrow board the first clip takes the full width when it would otherwise
   be left over. */
type InnerPlan = {
  k: number
  lead: { id: string, h: number } | null
  columns: Array<Array<{ id: string, h: number }>>
  natural: number
  /** How unevenly the inner columns end: the crop needed to level them. */
  cost: number
}

function planBoard(group: VideoGroup, innerWidth: number, k: number, innerGap: number, columnWidth: number): InnerPlan {
  const innerColumn = (innerWidth - innerGap * (k - 1)) / k
  const columns: InnerPlan['columns'] = Array.from({ length: k }, () => [])
  const heights = new Array<number>(k).fill(0)
  let lead: InnerPlan['lead'] = null
  // Only a landscape clip can lead: a tall crop blown up across the board turns to blur.
  const leader = k > 1 && k <= 3 && group.videos.length % k === 1 ? group.videos.find((video) => video.aspect >= 1.2) : undefined
  if (leader) lead = { id: leader.id, h: innerWidth / Math.max(leader.aspect, 1.5) }
  group.videos.forEach((video) => {
    if (video === leader) return
    const column = heights.indexOf(Math.min(...heights))
    const h = innerColumn / video.aspect
    columns[column].push({ id: video.id, h })
    heights[column] += h + innerGap
  })
  const tallest = Math.max(...heights)
  /* Uneven endings need cropping to level; clips much wider or narrower
     than a wall column read out of scale with the rest of the wall. */
  const cost = heights.reduce((sum, height) => sum + Math.abs(Math.log(tallest / height)), 0) / k
    + 0.6 * Math.abs(Math.log(innerColumn / columnWidth))
    // A column that would have to stretch past the crop bound is a last resort.
    + (heights.some((height) => tallest / height > maxStretch) ? 10 : 0)
  const leadHeight = (lead as InnerPlan['lead'])?.h ?? 0
  return { k, lead, columns, natural: (lead ? leadHeight + innerGap : 0) + tallest - innerGap, cost }
}

/* Grouped: justified rows of boards. Each row holds one board across the
   wall, or two side by side with the split chosen so their heights nearly
   match; each board's clips then crop to fill the row exactly, so every row
   and the wall's foot end level. */
function layoutBoards(groups: readonly VideoGroup[], options: Options): WallLayout {
  const { width, columns, gap, boardPad, boardHead } = options
  const columnWidth = (width - gap * (columns - 1)) / columns
  const spanWidth = (span: number) => span * columnWidth + (span - 1) * gap
  const innerGap = Math.round(gap * 0.75)
  const tiles = new Map<string, Box>()
  const boards = new Map<string, Box>()

  type Fit = { natural: number, low: number, high: number, cost: number, place: (x: number, y: number, h: number) => void }

  /* How a group sits in a given number of columns: its natural height, the
     heights it can stretch or squash to, and how to place it at one. */
  const fitGroup = (group: VideoGroup, span: number): Fit | null => {
    const w = spanWidth(span)
    if (group.synced || group.videos.length === 1) {
      const id = group.synced ? group.id : group.videos[0].id
      const natural = w / (group.synced?.aspect ?? group.videos[0].aspect)
      // Clips laid out together keep their shape more strictly.
      const [low, high] = group.synced ? [0.9, 1.12] : [0.8, 1.25]
      return {
        natural,
        low: natural * low,
        high: natural * high,
        cost: 0,
        place: (x, y, h) => tiles.set(id, { x, y, w, h }),
      }
    }

    const innerWidth = w - boardPad * 2
    const options = [span - 1, span, span + 1]
      .filter((k) => k >= 1 && k <= group.videos.length)
      .filter((k) => {
        const innerColumn = (innerWidth - innerGap * (k - 1)) / k
        return innerColumn >= columnWidth * 0.55 && innerColumn <= columnWidth * 1.7
      })
    if (options.length === 0) return null
    const plan = options.map((k) => planBoard(group, innerWidth, k, innerGap, columnWidth)).sort((a, b) => a.cost - b.cost)[0]
    const chrome = boardHead + boardPad
    return {
      natural: chrome + plan.natural,
      low: chrome + plan.natural * minStretch,
      high: chrome + plan.natural * maxStretch,
      cost: plan.cost,
      place: (x, y, h) => {
        boards.set(group.id, { x, y, w, h })
        const inner = h - chrome
        const scale = inner / plan.natural
        const innerColumn = (innerWidth - innerGap * (plan.k - 1)) / plan.k
        let top = y + boardHead
        if (plan.lead) {
          const leadHeight = plan.lead.h * scale
          tiles.set(plan.lead.id, { x: x + boardPad, y: top, w: innerWidth, h: leadHeight })
          top += leadHeight + innerGap
        }
        const room = y + boardHead + inner - top
        plan.columns.forEach((column, index) => {
          const content = column.reduce((sum, clip) => sum + clip.h, 0)
          const fill = (room - innerGap * (column.length - 1)) / content
          let clipTop = top
          for (const clip of column) {
            const h = clip.h * fill
            tiles.set(clip.id, { x: x + boardPad + index * (innerColumn + innerGap), y: clipTop, w: innerColumn, h })
            clipTop += h + innerGap
          }
        })
      },
    }
  }

  /* A row of fitted groups: the height they agree on, and what it costs in
     cropping. Null when their ranges do not overlap. */
  const settle = (fits: Fit[]) => {
    const low = Math.max(...fits.map((fit) => fit.low))
    const high = Math.min(...fits.map((fit) => fit.high))
    if (low > high) return null
    const mean = Math.exp(fits.reduce((sum, fit) => sum + Math.log(fit.natural), 0) / fits.length)
    const height = Math.min(high, Math.max(low, mean))
    const cost = fits.reduce((sum, fit) => sum + Math.abs(Math.log(height / fit.natural)) + fit.cost, 0)
    return { height, cost }
  }

  let y = 0
  let index = 0
  while (index < groups.length) {
    type Choice = { members: Array<{ fit: Fit, span: number }>, height: number, cost: number }
    const choices: Choice[] = []
    const alone = fitGroup(groups[index], columns)
    if (alone) {
      const row = settle([alone])
      // A wall of two-up rows reads denser; a board alone pays a little for its row.
      if (row) choices.push({ members: [{ fit: alone, span: columns }], height: row.height, cost: row.cost + (columns >= 4 ? 0.3 : 0) })
    }
    if (index + 1 < groups.length) {
      for (let left = 2; left <= columns - 2; left += 1) {
        const first = fitGroup(groups[index], left)
        const second = fitGroup(groups[index + 1], columns - left)
        if (!first || !second) continue
        const row = settle([first, second])
        if (row) choices.push({ members: [{ fit: first, span: left }, { fit: second, span: columns - left }], height: row.height, cost: row.cost })
      }
    }
    const best = choices.sort((a, b) => a.cost - b.cost)[0]
    if (!best) {
      // Nothing fits within the crop bounds: lay the group out at its own height.
      const fit = alone ?? fitGroup(groups[index], columns)
      if (fit) {
        fit.place(0, y, fit.natural)
        y += fit.natural + gap
      }
      index += 1
      continue
    }
    let x = 0
    for (const member of best.members) {
      member.fit.place(x, y, best.height)
      x += spanWidth(member.span) + gap
    }
    y += best.height + gap
    index += best.members.length
  }

  return { tiles, boards, rank: rankOf(tiles), height: Math.max(0, y - gap) }
}
