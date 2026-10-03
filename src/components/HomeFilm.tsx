import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { MouseEvent } from 'react'
import { Pause, Play, X } from 'lucide-react'

/* Media is produced by scripts/encode-home-film.sh. The reel is the film's
   footage without its title cards, muted and looped; the film is the full cut
   with sound. Both stream from /media/, where the Worker answers byte ranges. */
const reel = {
  wide: '/media/pairlab-reel-wide.mp4',
  narrow: '/media/pairlab-reel-narrow.mp4',
  poster: '/pairlab-reel-poster.webp',
}
const film = {
  src: '/media/pairlab-film.mp4',
  poster: '/pairlab-film-poster.webp',
  duration: '1:06',
}

/* On wide screens the frame rests scaled down so the whole picture fits under
   the intro on the first screen, then grows to full bleed as the page
   scrolls (see .home-film in styles.css). The resting scale depends on where
   the frame starts, so it is measured: once by an inline script before first
   paint, so nothing jumps at hydration, and again after resizes and webfont
   swaps. Self-contained on purpose: its source is inlined into the page. */
function fitFilmFrame() {
  const frame = document.querySelector<HTMLElement>('.home-film')
  if (!frame) return
  const top = frame.getBoundingClientRect().top + window.scrollY
  const scale = (window.innerHeight - top - 24) / frame.offsetHeight
  document.documentElement.style.setProperty('--film-rest-scale', String(Math.min(1, Math.max(0.5, scale)).toFixed(3)))
}
const fitFilmFrameScript = `(${fitFilmFrame.toString()})()`
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// A hidden tab never plays the reel, and a returning one picks it back up.
function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}
const pageIsVisible = () => document.visibilityState === 'visible'
const serverPageIsVisible = () => false

type HomeFilmProps = {
  /** False under reduced motion, Save-Data, or the visitor's own pause. */
  motionEnabled: boolean
  /** Present only when the visitor may toggle motion at all. */
  onToggleMotion?: () => void
}

/* The homepage's one bold moment: a muted reel in an inset frame that opens
   out to full bleed as the page scrolls (CSS, keyed to the intro's exit), and
   the full film with sound one press away. The reel only loads and plays while
   motion is allowed, the frame is on screen, the tab is visible and the film
   is closed. */
function HomeFilm({ motionEnabled, onToggleMotion }: HomeFilmProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const reelRef = useRef<HTMLVideoElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const filmRef = useRef<HTMLVideoElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  const [filmOpen, setFilmOpen] = useState(false)
  const pageVisible = useSyncExternalStore(subscribeToVisibility, pageIsVisible, serverPageIsVisible)
  const shouldPlay = motionEnabled && onScreen && pageVisible && !filmOpen

  useClientLayoutEffect(() => {
    fitFilmFrame()
    let resizeFrame = 0
    const onResize = () => {
      window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(fitFilmFrame)
    }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(fitFilmFrame).catch(() => {})
    return () => {
      window.cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = reelRef.current
    if (!video) return
    if (!shouldPlay) {
      video.pause()
      return
    }
    // The source is chosen on first play, so a still visitor downloads nothing.
    if (!video.getAttribute('src')) {
      video.src = window.matchMedia('(min-width: 1100px)').matches ? reel.wide : reel.narrow
    }
    video.muted = true
    // Low-power modes can refuse autoplay; the poster simply stays.
    video.play().catch(() => {})
  }, [shouldPlay])

  const openFilm = () => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    setFilmOpen(true)
    // Started inside the click, so the browser allows sound.
    filmRef.current?.play().catch(() => {})
  }

  const closeFilm = () => dialogRef.current?.close()

  const onFilmClosed = () => {
    const video = filmRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setFilmOpen(false)
  }

  // Clicks on the dialog itself, not its contents, land on the dimmed backdrop.
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeFilm()
  }

  return (
    <>
      <div className="home-film" ref={frameRef}>
        <video
          className="home-film-reel"
          ref={reelRef}
          poster={reel.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <div className="home-film-controls">
          <button className="home-film-watch" type="button" onClick={openFilm} aria-haspopup="dialog">
            <span className="home-film-watch-icon" aria-hidden="true"><Play size={16} fill="currentColor" /></span>
            Watch the film
            <span className="home-film-duration"><span className="sr-only">, </span>{film.duration}</span>
          </button>
          {onToggleMotion ? (
            <button
              className="home-film-toggle"
              type="button"
              onClick={onToggleMotion}
              aria-label={motionEnabled ? 'Pause background video and animation' : 'Play background video and animation'}
            >
              {motionEnabled ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
          ) : null}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: fitFilmFrameScript }} />

      <dialog className="film-dialog" ref={dialogRef} aria-label="PAIR Lab film" onClose={onFilmClosed} onClick={onDialogClick}>
        <button className="film-dialog-close" type="button" onClick={closeFilm} aria-label="Close film" autoFocus>
          <X size={22} />
        </button>
        <video
          className="film-dialog-video"
          ref={filmRef}
          src={film.src}
          poster={film.poster}
          controls
          playsInline
          preload="none"
        />
      </dialog>
    </>
  )
}

export default HomeFilm
