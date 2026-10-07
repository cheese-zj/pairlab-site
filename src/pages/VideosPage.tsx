import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, Layers, Pause, Play, Shuffle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { columnsFor, layoutWall } from '../components/videoWallLayout'
import type { Box } from '../components/videoWallLayout'
import { groupLabel, groupProject, groupTheme, orderGroups, wallMedia } from '../videos'
import type { VideoGroup, WallVideo } from '../videos'

const motionQuery = '(prefers-reduced-motion: reduce)'
function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const prefersReducedMotion = () => window.matchMedia(motionQuery).matches
const serverReducedMotion = () => true

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } }
const subscribeNever = () => () => {}
const prefersSavingData = () => Boolean((navigator as SaveDataNavigator).connection?.saveData)
const serverSaveData = () => true

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}
const pageIsVisible = () => document.visibilityState === 'visible'
const serverPageIsVisible = () => false

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
}

/* The prerendered wall is laid out for a typical desktop; the client
   re-measures before the tiles are revealed. */
const serverWidth = 1280
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

type Entry = { video: WallVideo, group: VideoGroup }

/* Positions are fractions of the wall's width, set in container units, so the
   prerendered wall already scales to any screen before JavaScript arrives. */
function boxStyle(box: Box, width: number): CSSProperties {
  const unit = (value: number) => +(value / width * 100).toFixed(3)
  return { '--x': unit(box.x), '--y': unit(box.y), '--w': unit(box.w), '--h': unit(box.h) } as CSSProperties
}

function Marks({ video }: { video: WallVideo }) {
  if (!video.marks) return null
  return (
    <span className="vw-marks" aria-hidden="true">
      {video.marks.map((mark) => (
        <span key={mark.label} style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%` }}>{mark.label}</span>
      ))}
    </span>
  )
}

/* The /videos wall: muted loops of the robots working, packed Pinterest-style
   with minimal text. A project's clips share a board; visitors can shuffle
   the wall or loosen the boards, and every tile opens its full clip. */
function VideosPage() {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, serverReducedMotion)
  const saveData = useSyncExternalStore(subscribeNever, prefersSavingData, serverSaveData)
  const pageVisible = useSyncExternalStore(subscribeToVisibility, pageIsVisible, serverPageIsVisible)
  const [paused, setPaused] = useState(false)
  const [seed, setSeed] = useState(0)
  const [grouped, setGrouped] = useState(true)
  const [width, setWidth] = useState(serverWidth)
  const [ready, setReady] = useState(false)
  const [settled, setSettled] = useState(false)
  const [spotlight, setSpotlight] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const wallRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const tileRefs = useRef(new Map<string, HTMLButtonElement>())
  const videoRefs = useRef(new Map<string, HTMLVideoElement>())
  const visible = useRef(new Set<string>())

  const motionAllowed = !reducedMotion && !saveData
  const shouldPlay = motionAllowed && !paused && pageVisible && openId === null

  const groups = useMemo(() => orderGroups(seed), [seed])
  const columns = columnsFor(width)
  const gap = columns <= 2 ? 8 : 12
  const layout = useMemo(
    () => layoutWall(groups, { width, columns, gap, grouped, boardPad: columns <= 2 ? 8 : 10, boardHead: 44 }),
    [groups, width, columns, gap, grouped],
  )
  const entries = useMemo(() => {
    const all: Entry[] = groups.flatMap((group) => group.videos.map((video) => ({ video, group })))
    return all.sort((left, right) => (layout.rank.get(left.video.id) ?? 0) - (layout.rank.get(right.video.id) ?? 0))
  }, [groups, layout])

  useClientLayoutEffect(() => {
    const wall = wallRef.current
    if (!wall) return
    const measure = () => setWidth(Math.round(wall.clientWidth) || serverWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wall)
    // Revealed a frame after the first real layout, so it never glides from the guess.
    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [])

  /* The entrance plays once. Reordering moves tiles in the DOM, which would
     otherwise restart it mid-glide. */
  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => setSettled(true), 2600)
    return () => window.clearTimeout(timer)
  }, [ready])

  /* Tiles load their loop only as they near the screen, and only those on
     screen play. */
  const syncPlayback = useCallback(() => {
    for (const [id, video] of videoRefs.current) {
      if (shouldPlay && visible.current.has(id)) {
        if (!video.getAttribute('src')) video.src = wallMedia(id).loop
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }
  }, [shouldPlay])

  useEffect(() => {
    const observer = new IntersectionObserver((observed) => {
      for (const entry of observed) {
        const id = (entry.target as HTMLElement).dataset.id ?? ''
        if (entry.isIntersecting) visible.current.add(id)
        else visible.current.delete(id)
      }
      syncPlayback()
    }, { rootMargin: '120px 0px' })
    for (const tile of tileRefs.current.values()) observer.observe(tile)
    return () => observer.disconnect()
  }, [syncPlayback])

  /* --- Expanded view --- */
  const openIndex = entries.findIndex((entry) => entry.video.id === openId)
  const openEntry = openIndex >= 0 ? entries[openIndex] : null

  const withTransition = (update: () => void, tileId: string | null, direction: 'open' | 'close') => {
    const transitionDocument = document as ViewTransitionDocument
    const tile = tileId ? tileRefs.current.get(tileId) : null
    if (!transitionDocument.startViewTransition || reducedMotion || !tile) {
      update()
      return
    }
    /* The tile and the stage share one name, so the browser morphs one into
       the other: the clip appears to lift out of the wall and settle back. */
    const root = document.documentElement
    root.setAttribute('data-vw-morph', direction)
    if (direction === 'open') tile.style.viewTransitionName = 'vw-stage'
    transitionDocument.startViewTransition(() => {
      tile.style.viewTransitionName = direction === 'open' ? '' : 'vw-stage'
      flushSync(update)
    }).finished.finally(() => {
      tile.style.viewTransitionName = ''
      root.removeAttribute('data-vw-morph')
    })
  }

  const openVideo = (id: string) => {
    withTransition(() => {
      setOpenId(id)
      dialogRef.current?.showModal()
    }, id, 'open')
  }

  const closeVideo = () => {
    const dialog = dialogRef.current
    if (!dialog?.open) return
    const tile = openId ? tileRefs.current.get(openId) : undefined
    withTransition(() => {
      dialog.close()
      setOpenId(null)
      // Back on the clip last watched, which may not be the one first opened.
      tile?.focus()
    }, openId, 'close')
  }

  const step = (by: number) => {
    if (openIndex < 0) return
    setOpenId(entries[(openIndex + by + entries.length) % entries.length].video.id)
  }

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    // A focused player keeps its own arrow keys for seeking.
    if ((event.target as HTMLElement).tagName === 'VIDEO') return
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeVideo()
  }

  /* --- Wall controls --- */
  // Each press deals a new order; the tiles glide there (see .vw-tile).
  const shuffle = () => setSeed(Math.floor(Math.random() * 0xffffffff) + 1)

  const followPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const tile = event.currentTarget
    const rect = tile.getBoundingClientRect()
    tile.style.setProperty('--px', `${event.clientX - rect.left}px`)
    tile.style.setProperty('--py', `${event.clientY - rect.top}px`)
  }

  /* A board sits just before its first clip in the DOM, so its project link
     comes right before that project's clips in the tab order, and paints
     beneath them. */
  const renderBoard = (group: VideoGroup) => {
    const board = layout.boards.get(group.id)
    if (!board) return null
    const project = groupProject(group)
    return (
      <div
        className="vw-board"
        key={`board-${group.id}`}
        data-accent={groupTheme(group)}
        data-lit={spotlight === group.id ? '' : undefined}
        style={boxStyle(board, width)}
        onPointerEnter={() => setSpotlight(group.id)}
      >
        {project ? (
          <Link className="vw-board-name" to={`/research/preview/${project.slug}`}>
            {project.title} <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        ) : (
          <span className="vw-board-name">{groupLabel(group)}</span>
        )}
      </div>
    )
  }
  const boardsShown = new Set<string>()

  const openMedia = openEntry ? wallMedia(openEntry.video.id) : null
  const openProject = openEntry ? groupProject(openEntry.group) : undefined

  return (
    <main className="route-page videos-page">
      <header className="vw-header">
        <h1>Videos</h1>
        <div className="vw-controls">
          <div className="vw-order" role="group" aria-label="Order">
            <button type="button" aria-pressed={seed === 0} onClick={() => setSeed(0)}>Featured</button>
            <button type="button" aria-pressed={seed !== 0} onClick={shuffle}>
              <Shuffle size={15} aria-hidden="true" /> Shuffle
            </button>
          </div>
          <button className="vw-switch" type="button" role="switch" aria-checked={grouped} onClick={() => setGrouped((value) => !value)}>
            <Layers size={15} aria-hidden="true" /> Group by project
            <span className="vw-switch-track" aria-hidden="true" />
          </button>
          {motionAllowed ? (
            <button
              className="vw-pause"
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Play videos' : 'Pause videos'}
            >
              {paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            </button>
          ) : null}
        </div>
      </header>

      <div className="vw-frame">
      <div
        className="vw-wall"
        ref={wallRef}
        data-ready={ready ? '' : undefined}
        data-settled={settled ? '' : undefined}
        data-spotlight={spotlight ?? undefined}
        style={{ '--wall-h': +(layout.height / width * 100).toFixed(3) } as CSSProperties}
        onPointerLeave={() => setSpotlight(null)}
      >
        {entries.flatMap(({ video, group }) => {
          const box = layout.tiles.get(video.id)
          if (!box) return null
          const media = wallMedia(video.id)
          const label = groupLabel(group)
          const onBoard = layout.boards.has(group.id)
          const leadsBoard = onBoard && !boardsShown.has(group.id)
          boardsShown.add(group.id)
          return (
            [leadsBoard ? renderBoard(group) : null,
            <button
              key={video.id}
              className="vw-tile"
              type="button"
              data-id={video.id}
              data-accent={groupTheme(group)}
              data-lit={spotlight === group.id ? '' : undefined}
              style={{ ...boxStyle(box, width), '--rank': layout.rank.get(video.id) ?? 0 } as CSSProperties}
              ref={(element) => {
                if (element) tileRefs.current.set(video.id, element)
                else tileRefs.current.delete(video.id)
              }}
              onClick={() => openVideo(video.id)}
              onPointerEnter={() => setSpotlight(group.id)}
              onPointerMove={followPointer}
              aria-label={[video.title, label].filter(Boolean).join(', ')}
              aria-haspopup="dialog"
            >
              <span className="vw-tile-inner">
                <img src={media.poster} alt="" loading="lazy" decoding="async" />
                <video
                  ref={(element) => {
                    if (element) videoRefs.current.set(video.id, element)
                    else videoRefs.current.delete(video.id)
                  }}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                  // Shown once frames arrive, so the still never flashes to black.
                  onPlaying={(event) => event.currentTarget.setAttribute('data-playing', '')}
                />
                <Marks video={video} />
                <span className="vw-caption" aria-hidden="true">
                  {onBoard || !video.title ? null : <small>{label}</small>}
                  <strong>{video.title ?? label}</strong>
                </span>
                {video.loopSpeed ? <span className="vw-speed" aria-hidden="true">{video.loopSpeed}×</span> : null}
                <span className="vw-cursor" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
              </span>
            </button>]
          )
        })}
        <div className="vw-wall-sizer" />
      </div>
      </div>

      <dialog
        className="vw-dialog"
        ref={dialogRef}
        aria-label={openEntry ? [openEntry.video.title, groupLabel(openEntry.group)].filter(Boolean).join(', ') : 'Video'}
        onKeyDown={onDialogKeyDown}
        // Escape closes through the same morph as the close button.
        onCancel={(event) => {
          event.preventDefault()
          closeVideo()
        }}
        onClick={onDialogClick}
        onClose={() => setOpenId(null)}
      >
        {openEntry && openMedia ? (
          <>
            <div className="vw-dialog-bar">
              {openProject ? (
                <Link className="vw-dialog-project" to={`/research/preview/${openProject.slug}`} data-accent={openProject.theme}>
                  {openProject.title} <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <span className="vw-dialog-project">{groupLabel(openEntry.group)}</span>
              )}
              <button className="vw-dialog-close" type="button" onClick={closeVideo} aria-label="Close video" autoFocus>
                <X size={22} />
              </button>
            </div>

            <div className="vw-dialog-body">
              <button className="vw-dialog-step" type="button" onClick={() => step(-1)} aria-label="Previous video">
                <ChevronLeft size={24} />
              </button>
              <div
                className="vw-stage"
                style={{ '--stage-aspect': openEntry.video.sourceAspect, '--poster': `url(${openMedia.poster})` } as CSSProperties}
              >
                <video
                  key={openEntry.video.id}
                  src={openMedia.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  // The poster holds the stage until frames arrive, so the morph never lands on black.
                  onPlaying={(event) => event.currentTarget.setAttribute('data-playing', '')}
                  // Autoplay with sound can be refused; fall back to muted rather than a still.
                  onLoadedData={(event) => {
                    const player = event.currentTarget
                    if (player.paused) {
                      player.muted = true
                      player.play().catch(() => {})
                    }
                  }}
                />
                <Marks video={openEntry.video} />
              </div>
              <button className="vw-dialog-step" type="button" onClick={() => step(1)} aria-label="Next video">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="vw-dialog-foot">
              {openEntry.video.title ? <p>{openEntry.video.title}</p> : null}
              {openEntry.group.videos.length > 1 ? (
                <div className="vw-strip" role="group" aria-label={`More from ${groupLabel(openEntry.group)}`}>
                  {openEntry.group.videos.map((sibling) => (
                    <button
                      type="button"
                      key={sibling.id}
                      aria-current={sibling.id === openEntry.video.id ? 'true' : undefined}
                      aria-label={sibling.title ?? groupLabel(openEntry.group)}
                      onClick={() => setOpenId(sibling.id)}
                    >
                      <img src={wallMedia(sibling.id).poster} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </dialog>
    </main>
  )
}

export default VideosPage
