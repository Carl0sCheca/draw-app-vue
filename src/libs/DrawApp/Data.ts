import { CheckRange, Clamp, Vector } from '@/libs/DrawApp/Utils/Math'

export interface Pixel {
  position: Vector;
  color: string;
}

export interface LastAction {
  before: Pixel[];
}

export class Data {
  public pixels: string[][]
  public lastAction: LastAction[]

  private readonly _gridSize: number

  public constructor (gridSize: number) {
    this._gridSize = gridSize
    this._initData()
  }

  private _initData (color = '#ffffff'): void {
    this.pixels = []
    for (let i = 0; i < this._gridSize; i++) {
      this.pixels[i] = []
      for (let j = 0; j < this._gridSize; j++) {
        this.pixels[i][j] = color
      }
    }

    this.lastAction = []
  }

  public clearData (color = '#ffffff'): void {
    for (let i = 0; i < this._gridSize; i++) {
      for (let j = 0; j < this._gridSize; j++) {
        this.pixels[i][j] = color
      }
    }
  }

  public writeData (position: Vector, color: string): void {
    if (this.pixels !== undefined || position !== undefined) {
      if (CheckRange(position, { x: 0, y: 0 }, { x: this._gridSize - 1, y: this._gridSize - 1 })) {
        this.pixels[Clamp(position.x, 0, this._gridSize - 1)][Clamp(position.y, 0, this._gridSize - 1)] = color
      }
    }
  }
}
