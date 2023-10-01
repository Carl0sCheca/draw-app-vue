/// <reference types="hammerjs" />
import { MouseButton } from './Mouse';
import { DrawApp } from './index';
import { Vector } from './Utils/Math';
interface EventButton {
    button?: MouseButton;
    position?: Vector;
    scroll?: number;
}
export declare class EventCanvas {
    private readonly _drawApp;
    constructor(_drawApp: DrawApp);
    onTouchEnd(e: TouchEvent): void;
    onTouchPress(e: HammerInput): void;
    onTouchMove(e: HammerInput): void;
    onTwoFingersMove(e: HammerInput): void;
    onTwoFingersTap(e: HammerInput): void;
    onMouseDown(e: MouseEvent): void;
    onButtonDown(e: EventButton): void;
    onMouseUp(e: MouseEvent): void;
    private onButtonUp;
    onMouseWheel(e: WheelEvent): void;
    onZoom(e: EventButton): void;
    onMouseMove(e: MouseEvent): void;
    onMove(e: EventButton): void;
    onMouseEnter(e: MouseEvent): void;
    onContextMenu(e: MouseEvent): void;
    onResizeWindow(drawApp: DrawApp): void;
    private _setupMousePosition;
    private _dispatchEvent;
}
export {};
