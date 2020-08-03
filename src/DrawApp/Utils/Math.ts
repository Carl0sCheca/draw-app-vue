import { DrawApp } from '../DrawApp'
import { IsInsideCanvas } from './Canvas'

export type Vector = { x: number; y: number }

export function VectorAdd (vector1: Vector, vector2: Vector): Vector {
  return { x: vector1.x + vector2.x, y: vector1.y + vector2.y }
}

export function VectorMidPoint (vector1: Vector, vector2: Vector): Vector {
  return { x: (vector1.x + vector2.x) / 2, y: (vector1.y + vector2.y) / 2 }
}

export function VectorSub (vector1: Vector, vector2: Vector): Vector {
  return { x: vector1.x - vector2.x, y: vector1.y - vector2.y }
}

export function VectorAbs (vector: Vector): Vector {
  return { x: Math.abs(vector.x), y: Math.abs(vector.y) }
}

export function VectorTrunc (vector: Vector): Vector {
  return { x: Math.trunc(vector.x), y: Math.trunc(vector.y) }
}

export function MaxComponentVector (vector: Vector): number {
  return Math.max(vector.x, vector.y)
}

export function HypotVector (vector1: Vector, vector2: Vector): number {
  const newVector: Vector = VectorSub(vector1, vector2)
  return Math.hypot(newVector.x, newVector.y)
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

export function LerpSteps (drawApp: DrawApp, firstPosition: Vector, lastPosition: Vector, callback: CallableFunction): void {
  if (!IsInsideCanvas(drawApp)) return

  const startPosition: Vector = DiscretizationDataPosition(firstPosition, drawApp)
  const endPosition: Vector = DiscretizationDataPosition(lastPosition, drawApp)

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

export function CheckRange (position: Vector, minPosition: Vector, maxPosition: Vector): boolean {
  return position.x >= minPosition.x && position.x <= maxPosition.x && position.y >= minPosition.y && position.y <= maxPosition.y
}
