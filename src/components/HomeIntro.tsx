import { useEffect, useRef, useState } from 'react'

/* The flat mark is the source of truth for the logo's shape: it is sampled
   into a tile grid rather than redrawn by hand. Its ring (the bowl of the P)
   was measured from the image's alpha: centre and inner radius as fractions
   of the mark's own box. */
const MARK = { src: '/pairlab-mark-flat.png', width: 242, height: 272 }
const RING = { x: 0.685, y: 0.272, radius: 0.146 }
const ROWS = 34
const COLUMNS = Math.round((ROWS * MARK.width) / MARK.height)

/* Seconds. Tiles assemble from the gripper up, an accent wave runs through
   them, they resolve into the crisp mark, then the camera flies through the
   ring and the opening becomes the homepage. */
const TIMING = {
  tileIn: 0.32,
  resolveFrom: 1.35,
  resolveTo: 1.8,
  crispFrom: 1.6,
  iris: 0.95,
  skippedIris: 0.55,
}
const STORAGE_KEY = 'pairlab:intro-seen'
/* Past this point the stylesheet's failsafe has already hidden the overlay
   (a slow or failed script must never leave the page covered). */
const LATE_START_MS = 3200

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const easeOut = (value: number) => 1 - (1 - value) ** 3
const smooth = (value: number) => value * value * (3 - 2 * value)
const easeInOut = (value: number) => (value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2)

/* The research accents are earthy on cream; on night they are lifted toward
   white, the same move as the stylesheet's --accent-bright tier. */
function brighten(hex: string, amount: number) {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  if (Number.isNaN(value)) return hex
  const channels = [value >> 16, (value >> 8) & 255, value & 255].map((channel) => Math.round(channel + (255 - channel) * amount))
  return `rgb(${channels.join(' ')})`
}

/* Deterministic per-cell jitter, so the assembly order is the same every time. */
const jitter = (column: number, row: number) => {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453
  return value - Math.floor(value)
}

type Tile = { column: number, row: number, delay: number, hue: number }

function sampleTiles(image: HTMLImageElement): Tile[] {
  const sampler = document.createElement('canvas')
  sampler.width = COLUMNS
  sampler.height = ROWS
  const context = sampler.getContext('2d', { willReadFrequently: true })
  if (!context) return []
  context.drawImage(image, 0, 0, COLUMNS, ROWS)
  const { data } = context.getImageData(0, 0, COLUMNS, ROWS)
  const tiles: Tile[] = []
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      if (data[(row * COLUMNS + column) * 4 + 3] < 96) continue
      // Gripper (bottom right) first, the head of the P last.
      const order = 1 - (row / ROWS) * 0.62 - (column / COLUMNS) * 0.38
      tiles.push({ column, row, delay: 0.12 + order * 0.72 + jitter(column, row) * 0.16, hue: jitter(row, column) })
    }
  }
  return tiles
}

function HomeIntro() {
  const [phase, setPhase] = useState<'pending' | 'running' | 'opening' | 'gone'>('pending')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nameRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (root.dataset.intro !== 'play' || !canvas || !context || performance.now() > LATE_START_MS) {
      if (root.dataset.intro === 'play') root.dataset.intro = 'skip'
      setPhase('gone')
      return
    }

    let cancelled = false
    let frame = 0
    let start = 0
    let irisStart = TIMING.resolveTo
    let irisLength = TIMING.iris
    let opening = false
    let tiles: Tile[] = []
    const image = new Image()
    const styles = getComputedStyle(root)
    const token = (name: string) => styles.getPropertyValue(name).trim()
    const night = token('--night') || '#090a08'
    const palette = ['--yellow', '--coral', '--accent-reliable', '--marker-blue'].map((name) => brighten(token(name), 0.26))
    // Tiles are drawn once per frame into a mark-sized layer, then laid down
    // twice: blurred for the glow, sharp on top.
    const layer = document.createElement('canvas')
    const layerContext = layer.getContext('2d')

    let width = 0
    let height = 0
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      layer.width = canvas.width
      layer.height = canvas.height
      layerContext?.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const layout = () => {
      const markHeight = Math.min(height * 0.34, ((width * 0.42) * MARK.height) / MARK.width, 280)
      const markWidth = (markHeight * MARK.width) / MARK.height
      const left = width / 2 - markWidth / 2
      const top = height * 0.44 - markHeight / 2
      return { markHeight, markWidth, left, top, pitch: markHeight / ROWS }
    }

    const finish = () => {
      root.dataset.intro = 'done'
      setPhase('gone')
    }

    const draw = (now: number) => {
      if (cancelled) return
      const time = (now - start) / 1000
      const { markHeight, markWidth, left, top, pitch } = layout()
      context.clearRect(0, 0, width, height)

      if (time < irisStart) {
        context.globalAlpha = 1
        context.fillStyle = night
        context.fillRect(0, 0, width, height)
        const resolve = smooth(clamp((time - TIMING.resolveFrom) / (TIMING.resolveTo - TIMING.resolveFrom)))
        const crisp = smooth(clamp((time - TIMING.crispFrom) / (TIMING.resolveTo - TIMING.crispFrom)))

        const tileContext = layerContext ?? context
        if (layerContext) layerContext.clearRect(0, 0, width, height)
        for (const tile of tiles) {
          const appear = easeOut(clamp((time - tile.delay) / TIMING.tileIn))
          if (appear <= 0) continue
          // Gaps close as the mosaic resolves into one solid mark.
          const size = pitch * (0.74 + 0.27 * resolve) * appear
          const x = left + (tile.column + 0.5) * pitch - size / 2
          const y = top + (tile.row + 0.5) * pitch - size / 2
          // The accent wave: a diagonal band of hues sweeping across the grid.
          const band = Math.floor(tile.column * 0.3 - tile.row * 0.2 + time * 2.6 + tile.hue * 0.7)
          const fade = appear * (1 - crisp)
          tileContext.globalAlpha = fade
          tileContext.fillStyle = palette[((band % palette.length) + palette.length) % palette.length]
          tileContext.fillRect(x, y, size, size)
          if (resolve > 0) {
            tileContext.globalAlpha = fade * resolve
            tileContext.fillStyle = '#ffffff'
            tileContext.fillRect(x, y, size, size)
          }
        }
        if (layerContext) {
          context.save()
          context.setTransform(1, 0, 0, 1, 0, 0)
          context.globalAlpha = 0.7
          context.globalCompositeOperation = 'lighter'
          context.filter = `blur(${Math.round(pitch * 1.6 * (canvas.width / width))}px)`
          context.drawImage(layer, 0, 0)
          context.filter = 'none'
          context.globalCompositeOperation = 'source-over'
          context.globalAlpha = 1
          context.drawImage(layer, 0, 0)
          context.restore()
        }

        if (crisp > 0) {
          context.globalAlpha = crisp
          context.drawImage(image, left, top, markWidth, markHeight)
        }
      } else {
        if (!opening) {
          opening = true
          setPhase('opening')
        }
        const progress = clamp((time - irisStart) / irisLength)
        const eased = easeInOut(progress)
        const ringX = left + RING.x * markWidth
        const ringY = top + RING.y * markHeight
        const ringRadius = RING.radius * markHeight
        // Fly through: the ring grows until its opening clears every corner,
        // drifting to the centre of the screen on the way.
        const reach = Math.hypot(width, height) / ringRadius
        const scale = 1 + (reach - 1) * eased ** 2
        const centreX = ringX + (width / 2 - ringX) * eased
        const centreY = ringY + (height / 2 - ringY) * eased

        context.globalAlpha = 1
        context.fillStyle = night
        context.fillRect(0, 0, width, height)
        context.globalCompositeOperation = 'destination-out'
        context.beginPath()
        context.arc(centreX, centreY, ringRadius * scale, 0, Math.PI * 2)
        context.fill()
        context.globalCompositeOperation = 'source-over'

        context.save()
        context.translate(centreX, centreY)
        context.scale(scale, scale)
        context.translate(-ringX, -ringY)
        context.globalAlpha = 1 - progress * 0.35
        context.drawImage(image, left, top, markWidth, markHeight)
        context.restore()

        if (progress >= 1) {
          finish()
          return
        }
      }

      frame = window.requestAnimationFrame(draw)
    }

    // Any intent to use the page hands over to it straight away.
    const skip = () => {
      if (!start || opening) return
      const time = (performance.now() - start) / 1000
      irisStart = Math.min(irisStart, time)
      irisLength = TIMING.skippedIris
    }

    resize()
    image.decoding = 'async'
    image.src = MARK.src
    image.decode()
      .then(() => {
        if (cancelled) return
        if (performance.now() > LATE_START_MS) throw new Error('Too late to start')
        tiles = sampleTiles(image)
        if (tiles.length === 0) throw new Error('Mark could not be sampled')
        try { window.localStorage.setItem(STORAGE_KEY, new Date().toISOString()) } catch { /* Private modes may refuse storage. */ }
        const markBottom = layout().top + layout().markHeight
        nameRef.current?.style.setProperty('--intro-name-top', `${Math.round(markBottom + 28)}px`)
        setPhase('running')
        start = performance.now()
        frame = window.requestAnimationFrame(draw)
      })
      .catch(() => {
        if (cancelled) return
        root.dataset.intro = 'skip'
        setPhase('gone')
      })

    window.addEventListener('resize', resize)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchmove', skip, { passive: true })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
    }
  }, [])

  if (phase === 'gone') return null

  // Decorative and brief: the page beneath stays the accessible content, and
  // any key, click or scroll skips straight to it.
  return (
    <div className={`intro-splash${phase === 'pending' ? '' : ` is-${phase}`}`} aria-hidden="true">
      <canvas ref={canvasRef} />
      <p ref={nameRef} className="intro-splash-name">PAIR Lab</p>
    </div>
  )
}

export default HomeIntro
