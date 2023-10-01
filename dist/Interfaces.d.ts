import { Vector } from './Utils/Math';
export interface Settings {
    gridSize: number;
    pixelSize?: number;
    gridColor: string;
    showGrid: boolean;
    numColors?: number;
}
export interface Zoom {
    level: number;
    position?: Vector;
    offset?: Vector;
    minLevel: number;
    maxLevel: number;
    stepsMouseWheel: number;
    stepsTouchPinch?: number;
}
