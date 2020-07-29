import { Vector } from './Math'

export function PushIfNotExists (pos: Vector, array: Array<Vector>): boolean {
  if (!array.some(position => position.x === pos.x && position.y === pos.y)) {
    array.push(pos)
    return false
  } else {
    return true
  }
}

export function GetSvgUrl (name: string): string {
  const images = require.context('../assets/', false, /\.svg$/)
  try {
    return images('./' + name + '.svg')
  } catch (ignored) {
    return 'nullimage'
  }
}

export async function FetchSVG (name: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    fetch(GetSvgUrl(name))
      .then(response => {
        if (response.url.includes('nullimage')) {
          reject(new Error(`Image "${name}" cannot be loaded`))
        } else {
          return response.url
        }
      })
      .then(url => {
        const img = new Image()
        img.src = url
        resolve(img)
      })
  })
}
