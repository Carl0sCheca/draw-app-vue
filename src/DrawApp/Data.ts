import { CheckRange, Clamp, Vector } from './Utils/Math'
import { DrawApp } from './DrawApp'

export interface Pixel {
  position: Vector;
  color: string;
}

export interface LastAction {
  before: Pixel[];
}

export class Data {
  private _drawApp: DrawApp

  public pixels: string[][]
  public lastAction: LastAction[]

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
  }

  public clearData (color = 'ffffff'): void {
    for (let i = 0; i < this._gridSize; i++) {
      for (let j = 0; j < this._gridSize; j++) {
        this.pixels[i][j] = color
      }
    }
  }

  public writeData (position: Vector, color: string): void {
    if (this.pixels !== undefined || position !== undefined) {
      if (CheckRange(position, { x: 0, y: 0 }, { x: this._gridSize - 1, y: this._gridSize - 1 })) {
        this._drawApp.ctx.fillStyle = color
        this.pixels[Clamp(position.x, 0, this._gridSize - 1)][Clamp(position.y, 0, this._gridSize - 1)] = this._drawApp.ctx.fillStyle.substr(1)
      }
    }
  }

  public undo (): void {
    console.log('undo')
  }

  public redo (): void {
    console.log('redo')
  }
}
