import { useEffect, useRef } from 'react'

const TILE_PITCH = 21
const TILE_SIZE = 18
const FRAME_INTERVAL = 1000 / 24

function randomAt(column: number, row: number, salt: number) {
  const value = Math.sin((column + 1) * 127.1 + (row + 1) * 311.7 + salt * 74.7) * 43758.5453
  return value - Math.floor(value)
}

function MosaicFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let ratio = 1
    let animationFrame = 0
    let lastFrame = 0
    let isVisible = true
    let tileSprite: HTMLCanvasElement

    const buildSprite = () => {
      tileSprite = document.createElement('canvas')
      tileSprite.width = Math.ceil(TILE_SIZE * ratio)
      tileSprite.height = Math.ceil(TILE_SIZE * ratio)
      const spriteContext = tileSprite.getContext('2d')
      if (!spriteContext) return
      spriteContext.scale(ratio, ratio)
      spriteContext.fillStyle = '#0a0c0a'
      spriteContext.beginPath()
      spriteContext.roundRect(0, 0, TILE_SIZE, TILE_SIZE, 3)
      spriteContext.fill()
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.ceil(width * ratio)
      canvas.height = Math.ceil(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      buildSprite()
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const seconds = time / 1000
      const columns = Math.ceil(width / TILE_PITCH)
      const rows = Math.ceil(height / TILE_PITCH)

      for (let row = 0; row < rows; row += 1) {
        const y = row * TILE_PITCH + 1
        const rowDrift = Math.sin(row * 0.31) * 0.72 + (randomAt(0, row, 1) - 0.5) * 0.55

        for (let column = 0; column < columns; column += 1) {
          const x = column * TILE_PITCH + 1
          const broadFlow = (Math.sin(column * 0.17 + seconds * 0.82 + rowDrift) + 1) / 2
          const secondaryFlow = (Math.sin(column * 0.075 + seconds * 0.46 - row * 0.13) + 1) / 2
          const randomDepth = 0.78 + randomAt(column, row, 2) * 0.22
          const flickerSpeed = 1.1 + randomAt(column, row, 3) * 1.8
          const flickerPhase = randomAt(column, row, 4) * Math.PI * 2
          const flicker = 0.88 + Math.sin(seconds * flickerSpeed + flickerPhase) * 0.12
          const flow = 0.14 + broadFlow ** 2 * 0.52 + secondaryFlow * 0.16

          context.globalAlpha = Math.min(0.96, flow * randomDepth * flicker)
          context.drawImage(tileSprite, x, y, TILE_SIZE, TILE_SIZE)
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

    const resizeObserver = new ResizeObserver(resize)
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
  }, [])

  return <canvas ref={canvasRef} className="mosaic-flow" aria-hidden="true" />
}

export default MosaicFlow
