import { CheckRange, Clamp, Vector } from './Utils/Math'
import { DrawApp } from './DrawApp'

export enum Type {
  Vector,
  Array
}

export interface Pixel {
  position?: Vector;
  positions?: Array<Vector>;
  color?: string;
  colors?: Array<string>;
  type: Type;
}

export class Data {
  private _drawApp: DrawApp

  public pixels: string[][]
  public lastAction: Pixel[]

  private lastActionIndex: number

  private readonly _gridSize: number

  public constructor (drawApp: DrawApp, gridSize: number) {
    this._drawApp = drawApp
    this._gridSize = gridSize
    this._initData()
  }

  private _initData (color = 'ffffff'): void {
    this.pixels = []
    for (let i = 0; i < this._gridSize; i++) {
      this.pixels[i] = []
      for (let j = 0; j < this._gridSize; j++) {
        this.pixels[i][j] = color
      }
    }

    this.lastAction = []
    this.lastActionIndex = -1
  }

  public clearData (color = 'ffffff'): void {
    const pixel: Pixel = { positions: [], colors: [], type: Type.Array }

    for (let i = 0; i < this._gridSize; i++) {
      for (let j = 0; j < this._gridSize; j++) {
        pixel.positions.push({ x: i, y: j })
        pixel.colors.push(this.pixels[i][j])
        this.pixels[i][j] = color
      }
    }

    this._checkLastActionAndWrite(pixel)
  }

  public static FlushDuplicatedData (pixel: Pixel, gridSize: number): Pixel {
    const _pixels: string[][] = []
    for (let i = 0; i < gridSize; i++) {
      _pixels[i] = []
    }

    pixel.positions.forEach((position, index) => {
      if (CheckRange(position, { x: 0, y: 0 }, { x: gridSize - 1, y: gridSize - 1 })) {
        _pixels[position.x][position.y] = pixel.colors[index]
      }
    })

    pixel.positions = []
    pixel.colors = []

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (_pixels[i][j] !== undefined) {
          pixel.positions.push({ x: i, y: j })
          pixel.colors.push(_pixels[i][j])
        }
      }
    }

    return pixel
  }

  private _checkLastActionAndWrite (p: Pixel): void {
    if (this.lastActionIndex + 1 !== this.lastAction.length) {
      this.lastAction.splice(this.lastActionIndex + 1)
    }

    if (this.lastAction[this.lastActionIndex + 1] !== undefined) {
      this.lastAction[this.lastActionIndex + 1] = p
    } else {
      this.lastAction.push(p)
    }
    this.lastActionIndex++
  }

  public writeData (pixel: Pixel): void {
    if (this.pixels !== undefined || pixel !== undefined) {
      if (pixel.type === Type.Vector) {
        this._checkPixelAndPaint(pixel.position, pixel.color)
      } else if (pixel.type === Type.Array) {
        const p: Pixel = { positions: [], colors: [], type: Type.Array }

        pixel.positions.forEach(pos => {
          if (CheckRange(pos, { x: 0, y: 0 }, { x: this._gridSize - 1, y: this._gridSize - 1 })) {
            p.positions.push({ x: pos.x, y: pos.y })
            p.colors.push(this.pixels[pos.x][pos.y])
          }
        })

        this._checkLastActionAndWrite(p)

        pixel.positions.forEach((position, index) => {
          if (position !== null) {
            const color: string = pixel.color ? pixel.color : pixel.colors[index]
            this._checkPixelAndPaint(position, color)
          }
        })
      }
    }
  }

  private _checkPixelAndPaint (position: Vector, color: string): void {
    if (CheckRange(position, { x: 0, y: 0 }, { x: this._gridSize - 1, y: this._gridSize - 1 })) {
      this._drawApp.ctx.fillStyle = color
      this.pixels[Clamp(position.x, 0, this._gridSize - 1)][Clamp(position.y, 0, this._gridSize - 1)] = this._drawApp.ctx.fillStyle.substr(1)
    }
  }

  public canUndo (): boolean {
    return this.lastActionIndex >= 0
  }

  public undo (): void {
    if (this.canUndo()) {
      const pixel: Pixel = this.lastAction[this.lastActionIndex]
      this.lastActionIndex--

      const tempPositions: Array<Vector> = []
      const tempColors: Array<string> = []

      pixel.positions.forEach((pos, index) => {
        tempPositions.push(pos)
        tempColors.push(this.pixels[pos.x][pos.y])
        this.pixels[pos.x][pos.y] = pixel.colors[index]
      })

      this.lastAction[this.lastActionIndex + 1] = { positions: tempPositions, colors: tempColors, type: Type.Array }
    }
  }

  public canRedo (): boolean {
    return this.lastActionIndex + 1 < this.lastAction.length
  }

  public redo (): void {
    if (this.canRedo()) {
      this.lastActionIndex++
      const pixel: Pixel = this.lastAction[this.lastActionIndex]

      const tempPositions: Array<Vector> = []
      const tempColors: Array<string> = []

      pixel.positions.forEach((pos, index) => {
        tempPositions.push(pos)
        tempColors.push(this.pixels[pos.x][pos.y])
        this.pixels[pos.x][pos.y] = pixel.colors[index]
      })

      this.lastAction[this.lastActionIndex] = { positions: tempPositions, colors: tempColors, type: Type.Array }
    }
  }
}
