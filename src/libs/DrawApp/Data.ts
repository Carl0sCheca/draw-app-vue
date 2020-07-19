import { Vector } from '@/libs/DrawApp/Utils'

export class Data {
  public pixels: string[][]
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
      this.pixels[position.x][position.y] = color
    }
  }
}
