import Vue from 'vue'
import { DrawApp } from '../DrawApp/DrawApp'

declare class DrawCanvas extends Vue {
  drawApp: DrawApp;
  Data(): string[][];
  LoadData(pixels: string[][]): void;
}

export as namespace DrawCanvas;

export = DrawCanvas;
