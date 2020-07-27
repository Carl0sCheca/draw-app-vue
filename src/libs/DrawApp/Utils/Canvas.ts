import { DrawApp } from '@/libs/DrawApp/DrawApp'
import { PushIfNotExists } from '@/libs/DrawApp/Utils/Util'
import { Vector } from '@/libs/DrawApp/Utils/Math'

export function RecursiveFill (pos: Vector, canvas: DrawApp, array: Array<Vector>): void {
  if (pos.x + 1 < canvas.settings.gridSize && !(array.some(position => position.x - 1 === pos.x && position.y === pos.y))) {
    const p: Vector = { x: pos.x + 1, y: pos.y }
    PushIfNotExists(p, array)
    RecursiveFill(p, canvas, array)
  }

  if (pos.x - 1 >= 0 && !(array.some(position => position.x + 1 === pos.x && position.y === pos.y))) {
    const p: Vector = { x: pos.x - 1, y: pos.y }
    PushIfNotExists(p, array)
    RecursiveFill(p, canvas, array)
  }

  if (pos.y + 1 < canvas.settings.gridSize && !(array.some(position => position.x === pos.x && position.y - 1 === pos.y))) {
    const p: Vector = { x: pos.x, y: pos.y + 1 }
    PushIfNotExists(p, array)
    RecursiveFill(p, canvas, array)
  }

  if (pos.y - 1 >= 0 && !(array.some(position => position.x === pos.x && position.y + 1 === pos.y))) {
    const p: Vector = { x: pos.x, y: pos.y - 1 }
    PushIfNotExists(p, array)
    RecursiveFill(p, canvas, array)
  }
}

export function IsInsideCanvas (canvas: DrawApp): boolean {
  return !(canvas.mouse.dataPosition.x < 0 || canvas.mouse.dataPosition.x >= canvas.settings.gridSize ||
    canvas.mouse.dataPosition.y < 0 || canvas.mouse.dataPosition.y >= canvas.settings.gridSize ||
    canvas.mouse.position.x < 0 || canvas.mouse.position.x >= canvas.ctx.canvas.width ||
    canvas.mouse.position.y < 0 || canvas.mouse.position.y >= canvas.ctx.canvas.height)
}

export function LeftPointCanvas (canvas: DrawApp): Vector {
  return {
    x: Math.trunc(-canvas.zoom.offset.x / canvas.zoom.level),
    y: Math.trunc(-canvas.zoom.offset.y / canvas.zoom.level)
  }
}

export function RightPointCanvas (canvas: DrawApp): Vector {
  return {
    x: Math.trunc((canvas.canvas.width - canvas.zoom.offset.x) / canvas.zoom.level),
    y: Math.trunc((canvas.canvas.height - canvas.zoom.offset.y) / canvas.zoom.level)
  }
}

export function MiddlePointCanvas (canvas: DrawApp): Vector {
  return {
    x: (LeftPointCanvas(canvas).x + RightPointCanvas(canvas).x) * 0.5,
    y: (LeftPointCanvas(canvas).y + RightPointCanvas(canvas).y) * 0.5
  }
}

export function PixelsOnScreen (canvas: DrawApp): number {
  return (canvas.canvas.width - canvas.zoom.offset.x) / (canvas.settings.pixelSize * canvas.zoom.level)
}
