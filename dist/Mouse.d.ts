import { DrawApp } from './index';
import { Vector } from './Utils/Math';
export declare enum MouseButton {
    NONE = -1,
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}
export declare enum MouseScroll {
    NONE = -1,
    UP = 0,
    DOWN = 1
}
export declare class Mouse {
    private readonly _drawApp;
    realPosition: Vector;
    lastPosition?: Vector;
    button: MouseButton;
    scroll: MouseScroll;
    scrollStep: number;
    moving: boolean;
    constructor(_drawApp: DrawApp);
    get position(): Vector;
    get relativeRealPosition(): Vector;
    get dataPosition(): Vector;
    mouseDownLeft(): void;
    mouseDownRight(): void;
    mouseUpLeft(): void;
    mouseUpRight(): void;
    mouseWheelButtonDown(): void;
    mouseWheelButtonUp(): void;
    mouseWheelDown(): void;
    mouseWheelUp(): void;
    mouseMove(position: Vector): void;
    mouseLeave(): void;
}
