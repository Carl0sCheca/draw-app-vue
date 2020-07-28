import { DrawApp } from '../DrawApp'
import { IsInsideCanvas } from './Canvas'

export type Vector = { x: number; y: number }

export function Clamp (value: number, min: number, max: number): number {
  if (value < min) {
    return min
  } else if (value > max) {
    return max
  } else {
    return value
  }
}

export function DiscretizationPosition (discretePosition: Vector, canvas: DrawApp): Vector {
  return {
    x: discretePosition.x * canvas.settings.pixelSize,
    y: discretePosition.y * canvas.settings.pixelSize
  }
}

export function DiscretizationDataPosition (position: Vector, canvas: DrawApp): Vector {
  return {
    x: Clamp(Math.trunc(position.x / canvas.settings.pixelSize), 0, canvas.settings.gridSize - 1),
    y: Clamp(Math.trunc(position.y / canvas.settings.pixelSize), 0, canvas.settings.gridSize - 1)
  }
}

export function Lerp (v0: number, v1: number, t: number): number {
  return (1 - t) * v0 + t * v1
}

export function LerpSteps (canvas: DrawApp, firstPosition: Vector, lastPosition: Vector, callback: CallableFunction): void {
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

export function CheckRange (position: Vector, minPosition: Vector, maxPosition: Vector): boolean {
  return position.x >= minPosition.x && position.x <= maxPosition.x && position.y >= minPosition.y && position.y <= maxPosition.y
}
