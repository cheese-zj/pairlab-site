import { useEffect, useRef } from 'react'
import { randomAt } from './mosaic'

const TILE_PITCH = 21
const TILE_SIZE = 18
const FRAME_INTERVAL = 1000 / 12

/* The three research accents carry the band; the ground's own counter-colour
   fills in as structure. Shares are cumulative pick thresholds; alpha is a
   [min, max] range, tuned per ground so tiles neither vanish nor shout. */
const TILE_MIXES = {
  dark: [
    { token: '--yellow', share: 0.45, alpha: [0.3, 0.85] },
    { token: '--cream', share: 0.75, alpha: [0.12, 0.4] },
    { token: '--coral', share: 0.88, alpha: [0.35, 0.8] },
    { token: '--accent-reliable', share: 1, alpha: [0.4, 0.85] },
  ],
  light: [
    { token: '--yellow', share: 0.45, alpha: [0.5, 0.95] },
    { token: '--ink', share: 0.75, alpha: [0.06, 0.16] },
    { token: '--coral', share: 0.88, alpha: [0.45, 0.85] },
    { token: '--accent-reliable', share: 1, alpha: [0.45, 0.85] },
  ],
}

/* Canvas fill styles cannot read custom properties, so resolve each token
   against the live cascade at the band's own position in the tree. */
function resolveColour(host: HTMLElement, token: string) {
  const probe = document.createElement('i')
  probe.style.color = `var(${token})`
  host.appendChild(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

type TileSprite = {
  sprite: HTMLCanvasElement
  alpha: [number, number]
  until: number
}

function MosaicBand({ ground = 'dark' }: { ground?: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const tileMix = TILE_MIXES[ground]

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let ratio = 1
    let animationFrame = 0
    let lastFrame = 0
    let isVisible = true
    let sprites: TileSprite[] = []

    const buildSprites = () => {
      const host = canvas.parentElement ?? document.body
      sprites = tileMix.map((tile) => {
        const sprite = document.createElement('canvas')
        sprite.width = Math.ceil(TILE_SIZE * ratio)
        sprite.height = Math.ceil(TILE_SIZE * ratio)
        const spriteContext = sprite.getContext('2d')
        if (spriteContext) {
          spriteContext.scale(ratio, ratio)
          spriteContext.fillStyle = resolveColour(host, tile.token)
          spriteContext.beginPath()
          spriteContext.roundRect(0, 0, TILE_SIZE, TILE_SIZE, 3)
          spriteContext.fill()
        }
        return { sprite, alpha: tile.alpha as [number, number], until: tile.share }
      })
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.ceil(width * ratio)
      canvas.height = Math.ceil(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      buildSprites()
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const seconds = time / 1000
      const drift = seconds * 0.5
      /* Whole cells only: a cropped row of tiles reads as a rendering bug, so
         the grid floors to full rows/columns and centres the remainder. */
      const columns = Math.max(1, Math.floor(width / TILE_PITCH))
      const rows = Math.max(1, Math.floor(height / TILE_PITCH))
      const offsetX = (width - columns * TILE_PITCH + TILE_PITCH - TILE_SIZE) / 2
      const offsetY = (height - rows * TILE_PITCH + TILE_PITCH - TILE_SIZE) / 2

      for (let row = 0; row < rows; row += 1) {
        const y = offsetY + row * TILE_PITCH

        for (let column = 0; column < columns; column += 1) {
          const x = offsetX + column * TILE_PITCH
          /* Clusters drift across the strip; a cell lights while one passes its gate. */
          const cluster = (Math.sin(column * 0.16 - drift + row * 0.42) + Math.sin(column * 0.047 - drift * 0.62 + row * 1.7)) / 2
          const density = 0.02 + Math.max(0, cluster) ** 2 * 0.5
          if (randomAt(column, row, 21) > density) continue

          const pick = randomAt(column, row, 22)
          const tile = sprites.find((entry) => pick <= entry.until) ?? sprites[sprites.length - 1]
          if (!tile) continue

          const [alphaMin, alphaMax] = tile.alpha
          const flicker = 0.86 + Math.sin(seconds * (0.5 + randomAt(column, row, 23)) + randomAt(column, row, 24) * Math.PI * 2) * 0.14
          context.globalAlpha = Math.min(1, (alphaMin + randomAt(column, row, 25) * (alphaMax - alphaMin)) * flicker)
          context.drawImage(tile.sprite, x, y, TILE_SIZE, TILE_SIZE)
        }
      }

      context.globalAlpha = 1
    }

    const animate = (time: number) => {
      if (isVisible && time - lastFrame >= FRAME_INTERVAL) {
        draw(time)
        lastFrame = time
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    /* Resizing the backing store wipes the bitmap, and the observer's initial
       callback always re-runs resize after mount — so repaint in the same step,
       or a reduced-motion canvas (whose only draw was at mount) stays blank. */
    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw(lastFrame)
    })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting && !document.hidden
    })
    const handleVisibility = () => { isVisible = !document.hidden }

    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    document.addEventListener('visibilitychange', handleVisibility)
    resize()

    if (reduceMotion) draw(0)
    else animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [ground])

  return <canvas ref={canvasRef} className="mosaic-band" aria-hidden="true" />
}

export default MosaicBand
