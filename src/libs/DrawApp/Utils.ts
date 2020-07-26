import { Canvas } from '@/libs/DrawApp/Canvas'

export type Vector = { x: number; y: number }

export type HSV = { H: number; S: number; V: number }
export type HSL = { H: number; S: number; L: number }

export function RandomNumber (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function RandomColour (): string {
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

export function Lerp (v0: number, v1: number, t: number): number {
  return (1 - t) * v0 + t * v1
}

export function DiscretizationPosition (discretePosition: Vector, canvas: Canvas): Vector {
  return {
    x: discretePosition.x * canvas.settings.pixelSize,
    y: discretePosition.y * canvas.settings.pixelSize
  }
}

export function DiscretizationDataPosition (position: Vector, canvas: Canvas): Vector {
  return {
    x: Clamp(Math.trunc(position.x / canvas.settings.pixelSize), 0, canvas.settings.gridSize - 1),
    y: Clamp(Math.trunc(position.y / canvas.settings.pixelSize), 0, canvas.settings.gridSize - 1)
  }
}

export function LeftPointCanvas (canvas: Canvas): Vector {
  return {
    x: Math.trunc(-canvas.zoom.offset.x / canvas.zoom.level),
    y: Math.trunc(-canvas.zoom.offset.y / canvas.zoom.level)
  }
}

export function RightPointCanvas (canvas: Canvas): Vector {
  return {
    x: Math.trunc((canvas.canvas.width - canvas.zoom.offset.x) / canvas.zoom.level),
    y: Math.trunc((canvas.canvas.height - canvas.zoom.offset.y) / canvas.zoom.level)
  }
}

export function MiddlePointCanvas (canvas: Canvas): Vector {
  return {
    x: (LeftPointCanvas(canvas).x + RightPointCanvas(canvas).x) * 0.5,
    y: (LeftPointCanvas(canvas).y + RightPointCanvas(canvas).y) * 0.5
  }
}

export function PixelsOnScreen (canvas: Canvas): number {
  return (canvas.canvas.width - canvas.zoom.offset.x) / (canvas.settings.pixelSize * canvas.zoom.level)
}

export function HSVtoHSL (hsv: HSV): HSL {
  const HSV: HSV = { H: hsv.H, S: hsv.S / 100, V: hsv.V / 100 }
  const HSL: HSL = { H: HSV.H, S: undefined, L: undefined }

  HSL.L = (HSV.V * (1 - (HSV.S / 2)))

  if (HSL.L === 0 || HSL.L === 1) {
    HSL.S = 0
  } else {
    HSL.S = (HSV.V - HSL.L) / Math.min(HSL.L, 1 - HSL.L)
  }

  HSL.L = Math.ceil(HSL.L * 100)
  HSL.S = Math.ceil(HSL.S * 100)

  return HSL
}

export function HSLtoString (hsl: HSL): string {
  return `hsl(${hsl.H}, ${hsl.S}%, ${hsl.L}%)`
}

export function IsInsideCanvas (canvas: Canvas): boolean {
  return !(canvas.mouse.dataPosition.x < 0 || canvas.mouse.dataPosition.x >= canvas.settings.gridSize ||
    canvas.mouse.dataPosition.y < 0 || canvas.mouse.dataPosition.y >= canvas.settings.gridSize ||
    canvas.mouse.position.x < 0 || canvas.mouse.position.x >= canvas.ctx.canvas.width ||
    canvas.mouse.position.y < 0 || canvas.mouse.position.y >= canvas.ctx.canvas.height)
}

export function LerpSteps (canvas: Canvas, firstPosition: Vector, lastPosition: Vector, callback: CallableFunction): void {
  if (!IsInsideCanvas(canvas)) return

  const startPosition: Vector = DiscretizationDataPosition(firstPosition, canvas)
  const endPosition: Vector = DiscretizationDataPosition(lastPosition, canvas)

  const distance: number = Math.max(
    Math.trunc(Math.abs(startPosition.x - endPosition.x)),
    Math.trunc(Math.abs(startPosition.y - endPosition.y))
  )

  const _lerpSteps: number = 1 / distance

  for (let _lerp = _lerpSteps; _lerp <= 1; _lerp += _lerpSteps) {
    const _currentPos: Vector = {
      x: Math.trunc(Lerp(endPosition.x, startPosition.x, _lerp)),
      y: Math.trunc(Lerp(endPosition.y, startPosition.y, _lerp))
    }

    callback(_currentPos)
  }
}

export function CheckRange (position: Vector, minPosition: Vector, maxPosition: Vector): boolean {
  return position.x >= minPosition.x && position.x <= maxPosition.x && position.y >= minPosition.y && position.y <= maxPosition.y
}
