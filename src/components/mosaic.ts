/* Deterministic per-cell hash shared by the mosaic canvases: the same cell
   always rolls the same values, so fields stay stable across frames. */
export function randomAt(column: number, row: number, salt: number) {
  const value = Math.sin((column + 1) * 127.1 + (row + 1) * 311.7 + salt * 74.7) * 43758.5453
  return value - Math.floor(value)
}
