import { Vector } from './Math'

export function PushIfNotExists (pos: Vector, array: Array<Vector>): boolean {
  if (!array.some(position => position.x === pos.x && position.y === pos.y)) {
    array.push(pos)
    return false
  } else {
    return true
  }
}
