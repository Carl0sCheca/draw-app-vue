export type Vector = {
  x: number;
  y: number;
};

export function RandomNumber (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function RandomColor (): string {
  let finalColour = '#'
  for (let i = 0; i < 3; i++) {
    let number: string = RandomNumber(0, 255).toString(16)
    if (number.length === 1) {
      number = '0' + number
    }
    finalColour += number
  }
  return finalColour
}

export function Clamp (value: number, min: number, max: number): number {
  if (value < min) {
    return min
  } else if (value > max) {
    return max
  } else {
    return value
  }
}

// private line (x0: number, y0: number, x1: number, y1: number): void {n
//   const dx = Math.abs(x1 - x0)
//   const dy = Math.abs(y1 - y0)
//   const sx = (x0 < x1) ? 1 : -1
//   const sy = (y0 < y1) ? 1 : -1
//   let err = dx - dy
//
//   while (true) {
//   this._ctx.strokeRect(x0, y0, this._pixelSize, this._pixelSize)
//
//   if ((x0 === x1) && (y0 === y1)) break
//   const e2 = 2 * err
//   if (e2 > -dy) {
//     err -= dy
//     x0 += sx
//   }
//   if (e2 < dx) {
//     err += dx
//     y0 += sy
//   }
// }
// }
