/// <reference types="hammerjs" />
import { DrawApp } from './index';
export declare enum TouchAction {
    NONE = 0,
    LEFTBUTTON = 1,
    MOVEZOOM = 2
}
export declare class Touch {
    private readonly _drawApp;
    readonly mc: HammerManager;
    touchAction: TouchAction;
    private _touchLastPosition;
    private limiting;
    private lastScale;
    constructor(_drawApp: DrawApp);
    private _touchPosition;
    touchEnd(onButtonUp: CallableFunction): void;
    touchPress(e: HammerInput, onButtonDown: CallableFunction): void;
    touchMove(e: HammerInput, onMove: CallableFunction): void;
    touchTwoFingers(e: HammerInput, onButtonDown: CallableFunction, onZoom: CallableFunction): void;
    touchTwoFingersTap(e: HammerInput, onButtonDown: CallableFunction): void;
}
