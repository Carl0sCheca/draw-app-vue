import Hammer from 'hammerjs';
import { DiscretizationDataPosition } from './Utils/Math';
import { CheckIfSamePositionAsLast } from './Utils/Canvas';
import { MouseButton } from './Mouse';
export var TouchAction;
(function (TouchAction) {
    TouchAction[TouchAction["NONE"] = 0] = "NONE";
    TouchAction[TouchAction["LEFTBUTTON"] = 1] = "LEFTBUTTON";
    TouchAction[TouchAction["MOVEZOOM"] = 2] = "MOVEZOOM";
})(TouchAction || (TouchAction = {}));
export class Touch {
    constructor(_drawApp) {
        this._drawApp = _drawApp;
        this.mc = new Hammer.Manager(_drawApp.canvas);
        this.touchAction = TouchAction.NONE;
        this.mc.add(new Hammer.Press({ time: 25 }));
        this.mc.add(new Hammer.Pan({ event: 'move', pointers: 1 }));
        this.mc.add(new Hammer.Tap({ event: 'singletap' }));
        this.mc.add(new Hammer.Tap({ event: 'twofingerstap', pointers: 2 }));
        this.mc.add(new Hammer.Pan({ event: 'twofingerspan', pointers: 2, threshold: 5 }));
        this.mc.add(new Hammer.Pinch({ event: 'twofingerspinch', pointers: 2, threshold: 5 }));
        this.mc.get('twofingerspinch').recognizeWith('twofingerstap');
        this.mc.get('twofingerspan').recognizeWith('twofingerstap');
    }
    _touchPosition(position) {
        const rect = this._drawApp.canvas.getBoundingClientRect();
        return { x: position.x - rect.left, y: position.y - rect.top };
    }
    touchEnd(onButtonUp) {
        this.mc.get('twofingerspan').set({ enable: true });
        this.mc.get('twofingerspinch').set({ enable: true });
        if (this.touchAction !== TouchAction.NONE) {
            onButtonUp(this._touchLastPosition);
            this.touchAction = TouchAction.NONE;
            this._drawApp.mouse.button = MouseButton.NONE;
            this._drawApp.mouse.moving = false;
        }
    }
    touchPress(e, onButtonDown) {
        if (e.pointerType === 'touch') {
            try {
                this._touchLastPosition = this._touchPosition({ x: e.pointers[0].x, y: e.pointers[0].y });
                onButtonDown(this._touchLastPosition);
                this.touchAction = TouchAction.LEFTBUTTON;
            }
            catch (error) {
            }
        }
    }
    touchMove(e, onMove) {
        if (e.pointerType === 'touch' && this.touchAction === TouchAction.LEFTBUTTON) {
            if (e.pointers !== null && e.pointers[0].x !== undefined && e.pointers[0].y !== undefined) {
                const newPos = this._touchPosition({ x: e.pointers[0].x, y: e.pointers[0].y });
                if (CheckIfSamePositionAsLast(DiscretizationDataPosition(newPos, this._drawApp), DiscretizationDataPosition(this._touchLastPosition, this._drawApp))) {
                    this._touchLastPosition = newPos;
                    onMove(this._touchLastPosition);
                }
            }
        }
    }
    touchTwoFingers(e, onButtonDown, onZoom) {
        if ((e.pointerType === 'touch' && this.touchAction === TouchAction.NONE) || this.touchAction === TouchAction.MOVEZOOM) {
            if (this.touchAction === TouchAction.NONE) {
                this._drawApp.mouse.moving = true;
                this.touchAction = TouchAction.MOVEZOOM;
                this.limiting = 0;
                this.lastScale = e.scale;
            }
            else if (this.touchAction === TouchAction.MOVEZOOM) {
                if (this.limiting > 10) {
                    const zoomIn = this.lastScale <= e.scale;
                    this._touchLastPosition = this._touchPosition({ x: e.center.x, y: e.center.y });
                    const pinchMovement = Math.abs(this.lastScale - e.scale);
                    if (pinchMovement >= 0.08) { // Zoom
                        this._drawApp.mouse.scrollStep = zoomIn ? pinchMovement : pinchMovement * 2;
                        onZoom(this._touchLastPosition, zoomIn);
                    }
                    else { // Move
                        onButtonDown(this._touchLastPosition);
                    }
                    this.lastScale = e.scale;
                    this.limiting = 0;
                }
                else {
                    this.limiting++;
                }
            }
        }
    }
    touchTwoFingersTap(e, onButtonDown) {
        if (e.pointerType === 'touch' && this.touchAction === TouchAction.NONE) {
            this.mc.get('twofingerspan').set({ enable: false });
            this.mc.get('twofingerspinch').set({ enable: false });
            onButtonDown();
        }
    }
}
