import { Vector } from '@/libs/DrawApp/Utils/Math'

export function PushIfNotExists (pos: Vector, array: Array<any>): boolean {
  if (!array.some(position => position.x === pos.x && position.y === pos.y)) {
    array.push(pos)
    return false
  } else {
    return true
  }
}
