import { Vector } from './Utils/Math';
import { DrawApp } from './index';
export declare enum Type {
    Vector = 0,
    Array = 1
}
export interface Pixel {
    position?: Vector;
    positions?: Array<Vector>;
    color?: string;
    colors?: Array<string>;
    type: Type;
}
export declare class Data {
    private readonly _drawApp;
    private readonly _gridSize;
    pixels: string[][];
    lastAction: Pixel[];
    private lastActionIndex;
    constructor(_drawApp: DrawApp, _gridSize: number);
    private _initData;
    saveLocalStorage(): void;
    clearData(color?: string): void;
    static FlushDuplicatedData(pixel: Pixel, gridSize: number): Pixel;
    private _checkLastActionAndWrite;
    writeData(pixel: Pixel): void;
    private _checkPixelAndPaint;
    canUndo(): boolean;
    undo(): void;
    canRedo(): boolean;
    redo(): void;
}
