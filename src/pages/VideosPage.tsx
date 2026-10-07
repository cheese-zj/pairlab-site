import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid, Layers, Maximize2, Pause, Play, Shuffle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { columnsFor, layoutWall } from '../components/videoWallLayout'
import type { Box } from '../components/videoWallLayout'
import { groupLabel, groupProject, groupTheme, loopSpeedLabel, orderGroups, wallMedia } from '../videos'
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

/* One tile on the wall: a single clip, or (video null) a synced group's
   clips playing together. */
type Entry = { id: string, group: VideoGroup, video: WallVideo | null }

/* Positions are fractions of the wall's width, set in container units, so the
   prerendered wall already scales to any screen before JavaScript arrives. */
function boxStyle(box: Box, width: number): CSSProperties {
  const unit = (value: number) => +(value / width * 100).toFixed(3)
  return { '--x': unit(box.x), '--y': unit(box.y), '--w': unit(box.w), '--h': unit(box.h) } as CSSProperties
}

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

/* Followers jump back into step with the lead once they drift a few frames. */
function keepInStep(lead: HTMLVideoElement, followers: Array<HTMLVideoElement | null | undefined>) {
  for (const video of followers) {
    if (video && Math.abs(video.currentTime - lead.currentTime) > 0.12) video.currentTime = lead.currentTime
  }
}

/* A synced group in the expanded view: every clip at full quality, in the
   tile's layout, under one play control and one timeline. Any clip can be
   lifted out to watch on its own. */
function TogetherStage({ group, onSolo }: { group: VideoGroup, onSolo: (id: string) => void }) {
  const players = useRef<Array<HTMLVideoElement | null>>([])
  const [playing, setPlaying] = useState(true)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const synced = group.synced!

  const everyPlayer = (action: (video: HTMLVideoElement) => void) => players.current.forEach((video) => video && action(video))
  const toggle = () => {
    if (playing) everyPlayer((video) => video.pause())
    else everyPlayer((video) => { video.play().catch(() => {}) })
    setPlaying(!playing)
  }
  const seek = (to: number) => {
    everyPlayer((video) => { video.currentTime = to })
    setTime(to)
  }

  return (
    <>
      <div className="vw-together" style={{ gridTemplateColumns: synced.columns, gridTemplateRows: synced.rows }}>
        {group.videos.map((video, index) => (
          <div className="vw-panel" style={{ gridArea: video.area }} key={video.id}>
            <video
              ref={(element) => { players.current[index] = element }}
              src={wallMedia(video).src}
              poster={wallMedia(video).poster}
              muted
              autoPlay
              loop
              playsInline
              aria-label={video.title}
              onLoadedMetadata={index === 0 ? (event) => setDuration(event.currentTarget.duration) : undefined}
              onTimeUpdate={index === 0 ? (event) => {
                setTime(event.currentTarget.currentTime)
                keepInStep(event.currentTarget, players.current.slice(1))
              } : undefined}
            />
            {video.mark ? <span className="vw-mark" data-real={video.mark === 'Real' ? '' : undefined} aria-hidden="true">{video.mark}</span> : null}
            <button className="vw-panel-solo" type="button" onClick={() => onSolo(video.id)} aria-label={`Watch ${video.title ?? 'this view'} on its own`}>
              <Maximize2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="vw-together-bar">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause all views' : 'Play all views'}>
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={time}
          onChange={(event) => seek(Number(event.currentTarget.value))}
          aria-label="Position in all views"
        />
        <span>{formatTime(time)} / {formatTime(duration)}</span>
      </div>
    </>
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
  // Within an open synced group: the clip lifted out to watch alone, if any.
  const [solo, setSolo] = useState<string | null>(null)

  const wallRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const tileRefs = useRef(new Map<string, HTMLButtonElement>())
  const videoRefs = useRef(new Map<string, HTMLVideoElement>())
  // Which tile each loop plays in: a synced tile holds several.
  const tileOf = useRef(new Map<string, string>())
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
    const all: Entry[] = groups.flatMap((group): Entry[] => group.synced
      ? [{ id: group.id, group, video: null }]
      : group.videos.map((video) => ({ id: video.id, group, video })))
    return all.sort((left, right) => (layout.rank.get(left.id) ?? 0) - (layout.rank.get(right.id) ?? 0))
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
      if (shouldPlay && visible.current.has(tileOf.current.get(id) ?? id)) {
        if (!video.getAttribute('src')) video.src = video.dataset.loop ?? ''
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
  const openIndex = entries.findIndex((entry) => entry.id === openId)
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
      setSolo(null)
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
    setOpenId(entries[(openIndex + by + entries.length) % entries.length].id)
    setSolo(null)
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
            {groupLabel(group)} <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        ) : (
          <span className="vw-board-name">{groupLabel(group)}</span>
        )}
      </div>
    )
  }
  const boardsShown = new Set<string>()

  const openProject = openEntry ? groupProject(openEntry.group) : undefined
  // The clip on the stage: the open tile's, or the one lifted out of a synced group.
  const stageVideo = openEntry ? openEntry.video ?? openEntry.group.videos.find((video) => video.id === solo) ?? null : null
  const together = Boolean(openEntry && !stageVideo)

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
        {entries.flatMap(({ id, group, video }) => {
          const box = layout.tiles.get(id)
          if (!box) return null
          const label = groupLabel(group)
          const onBoard = layout.boards.has(group.id)
          const leadsBoard = onBoard && !boardsShown.has(group.id)
          boardsShown.add(group.id)
          const speed = video ? loopSpeedLabel(video) : null
          const loopOf = (clip: WallVideo, lead?: boolean) => (
            <>
              <img src={wallMedia(clip).poster} alt="" loading="lazy" decoding="async" />
              <video
                ref={(element) => {
                  if (element) {
                    videoRefs.current.set(clip.id, element)
                    tileOf.current.set(clip.id, id)
                  } else {
                    videoRefs.current.delete(clip.id)
                    tileOf.current.delete(clip.id)
                  }
                }}
                data-loop={wallMedia(clip).loop}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
                // Shown once frames arrive, so the still never flashes to black.
                onPlaying={(event) => event.currentTarget.setAttribute('data-playing', '')}
                onTimeUpdate={lead ? (event) => keepInStep(event.currentTarget, group.videos.slice(1).map((other) => videoRefs.current.get(other.id))) : undefined}
              />
              {clip.mark ? <span className="vw-mark" data-real={clip.mark === 'Real' ? '' : undefined} aria-hidden="true">{clip.mark}</span> : null}
            </>
          )
          return (
            [leadsBoard ? renderBoard(group) : null,
            <button
              key={id}
              className="vw-tile"
              type="button"
              data-id={id}
              data-accent={groupTheme(group)}
              data-lit={spotlight === group.id ? '' : undefined}
              style={{ ...boxStyle(box, width), '--rank': layout.rank.get(id) ?? 0 } as CSSProperties}
              ref={(element) => {
                if (element) tileRefs.current.set(id, element)
                else tileRefs.current.delete(id)
              }}
              onClick={() => openVideo(id)}
              onPointerEnter={() => setSpotlight(group.id)}
              onPointerMove={followPointer}
              aria-label={[video?.title, label].filter(Boolean).join(', ')}
              aria-haspopup="dialog"
            >
              <span className="vw-tile-inner">
                {video ? loopOf(video) : (
                  <span className="vw-together" style={{ gridTemplateColumns: group.synced!.columns, gridTemplateRows: group.synced!.rows }}>
                    {group.videos.map((clip, index) => (
                      <span className="vw-panel" style={{ gridArea: clip.area }} key={clip.id}>{loopOf(clip, index === 0)}</span>
                    ))}
                  </span>
                )}
                <span className="vw-caption" aria-hidden="true">
                  {onBoard || !video?.title ? null : <small>{label}</small>}
                  <strong>{video?.title ?? label}</strong>
                </span>
                {speed ? <span className="vw-speed" aria-hidden="true">{speed}</span> : null}
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
        aria-label={openEntry ? [stageVideo?.title, groupLabel(openEntry.group)].filter(Boolean).join(', ') : 'Video'}
        onKeyDown={onDialogKeyDown}
        // Escape closes through the same morph as the close button.
        onCancel={(event) => {
          event.preventDefault()
          closeVideo()
        }}
        onClick={onDialogClick}
        onClose={() => setOpenId(null)}
      >
        {openEntry ? (
          <>
            <div className="vw-dialog-bar">
              {openProject ? (
                <Link className="vw-dialog-project" to={`/research/preview/${openProject.slug}`} data-accent={openProject.theme}>
                  {groupLabel(openEntry.group)} <ArrowUpRight size={15} aria-hidden="true" />
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
              {stageVideo ? (
                <div
                  className="vw-stage"
                  style={{ '--stage-aspect': stageVideo.sourceAspect, '--poster': `url(${wallMedia(stageVideo).poster})` } as CSSProperties}
                >
                  <video
                    key={stageVideo.id}
                    src={wallMedia(stageVideo).src}
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
                  {stageVideo.mark ? <span className="vw-mark" data-real={stageVideo.mark === 'Real' ? '' : undefined} aria-hidden="true">{stageVideo.mark}</span> : null}
                </div>
              ) : (
                <div className="vw-stage is-together" style={{ '--stage-aspect': openEntry.group.synced!.aspect } as CSSProperties}>
                  <TogetherStage group={openEntry.group} onSolo={setSolo} />
                </div>
              )}
              <button className="vw-dialog-step" type="button" onClick={() => step(1)} aria-label="Next video">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="vw-dialog-foot">
              {stageVideo?.title ? <p>{stageVideo.title}</p> : null}
              {openEntry.group.synced ? (
                <div className="vw-strip" role="group" aria-label={`Views in ${groupLabel(openEntry.group)}`}>
                  <button className="vw-strip-all" type="button" aria-current={together ? 'true' : undefined} onClick={() => setSolo(null)}>
                    <LayoutGrid size={16} aria-hidden="true" /> All together
                  </button>
                  {openEntry.group.videos.map((clip) => (
                    <button type="button" key={clip.id} aria-current={clip.id === solo ? 'true' : undefined} aria-label={clip.title} onClick={() => setSolo(clip.id)}>
                      <img src={wallMedia(clip).poster} alt="" />
                    </button>
                  ))}
                </div>
              ) : openEntry.group.videos.length > 1 ? (
                <div className="vw-strip" role="group" aria-label={`More from ${groupLabel(openEntry.group)}`}>
                  {openEntry.group.videos.map((sibling) => (
                    <button
                      type="button"
                      key={sibling.id}
                      aria-current={sibling.id === openEntry.id ? 'true' : undefined}
                      aria-label={sibling.title ?? groupLabel(openEntry.group)}
                      onClick={() => setOpenId(sibling.id)}
                    >
                      <img src={wallMedia(sibling).poster} alt="" />
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
