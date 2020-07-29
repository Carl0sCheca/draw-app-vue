import { DrawApp } from '../DrawApp'
import { PushIfNotExists } from './Util'
import { Vector } from './Math'

export function RecursiveFill (pos: Vector, drawApp: DrawApp, array: Array<Vector>): void {
  if (pos.x + 1 < drawApp.settings.gridSize && !(array.some(position => position.x - 1 === pos.x && position.y === pos.y))) {
    const p: Vector = { x: pos.x + 1, y: pos.y }
    PushIfNotExists(p, array)
    RecursiveFill(p, drawApp, array)
  }

  if (pos.x - 1 >= 0 && !(array.some(position => position.x + 1 === pos.x && position.y === pos.y))) {
    const p: Vector = { x: pos.x - 1, y: pos.y }
    PushIfNotExists(p, array)
    RecursiveFill(p, drawApp, array)
  }

  if (pos.y + 1 < drawApp.settings.gridSize && !(array.some(position => position.x === pos.x && position.y - 1 === pos.y))) {
    const p: Vector = { x: pos.x, y: pos.y + 1 }
    PushIfNotExists(p, array)
    RecursiveFill(p, drawApp, array)
  }

  if (pos.y - 1 >= 0 && !(array.some(position => position.x === pos.x && position.y + 1 === pos.y))) {
    const p: Vector = { x: pos.x, y: pos.y - 1 }
    PushIfNotExists(p, array)
    RecursiveFill(p, drawApp, array)
  }
}

export function IsInsideCanvas (drawApp: DrawApp): boolean {
  return !(drawApp.mouse.dataPosition.x < 0 || drawApp.mouse.dataPosition.x >= drawApp.settings.gridSize ||
    drawApp.mouse.dataPosition.y < 0 || drawApp.mouse.dataPosition.y >= drawApp.settings.gridSize ||
    drawApp.mouse.position.x < 0 || drawApp.mouse.position.x >= drawApp.canvas.width ||
    drawApp.mouse.position.y < 0 || drawApp.mouse.position.y >= drawApp.canvas.height)
}

export function LeftPointCanvas (drawApp: DrawApp): Vector {
  return {
    x: Math.trunc(-drawApp.zoom.offset.x / drawApp.zoom.level),
    y: Math.trunc(-drawApp.zoom.offset.y / drawApp.zoom.level)
  }
}

export function RightPointCanvas (drawApp: DrawApp): Vector {
  return {
    x: Math.trunc((drawApp.canvas.width - drawApp.zoom.offset.x) / drawApp.zoom.level),
    y: Math.trunc((drawApp.canvas.height - drawApp.zoom.offset.y) / drawApp.zoom.level)
  }
}

export function MiddlePointCanvas (drawApp: DrawApp): Vector {
  return {
    x: (LeftPointCanvas(drawApp).x + RightPointCanvas(drawApp).x) * 0.5,
    y: (LeftPointCanvas(drawApp).y + RightPointCanvas(drawApp).y) * 0.5
  }
}

export function PixelsOnScreen (drawApp: DrawApp): number {
  return (drawApp.canvas.width - drawApp.zoom.offset.x) / (drawApp.settings.pixelSize * drawApp.zoom.level)
}
