import { MouseButton, MouseScroll } from './Mouse';
import { VectorZero } from './Utils/Math';
export class EventCanvas {
    constructor(_drawApp) {
        this._drawApp = _drawApp;
        window.addEventListener('resize', () => this.onResizeWindow(this._drawApp));
        // Mouse
        this._drawApp.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this._drawApp.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this._drawApp.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));
        this._drawApp.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this._drawApp.canvas.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
        this._drawApp.canvas.addEventListener('contextmenu', (e) => this.onContextMenu(e));
        // Touch
        this._drawApp.canvas.addEventListener('touchstart', (e) => e.cancelable ? e.preventDefault() : null);
        this._drawApp.canvas.addEventListener('touchmove', (e) => e.cancelable ? e.preventDefault() : null);
        this._drawApp.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        this._drawApp.touch.mc.on('press', (e) => this.onTouchPress(e));
        this._drawApp.touch.mc.on('move', (e) => this.onTouchMove(e));
        this._drawApp.touch.mc.on('twofingerstap', (e) => this.onTwoFingersTap(e));
        this._drawApp.touch.mc.on('twofingerspanmove twofingerspinchmove', (e) => this.onTwoFingersMove(e));
    }
    onTouchEnd(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
        this._drawApp.touch.touchEnd((lastPosition) => this.onButtonUp({
            button: this._drawApp.mouse.button,
            position: lastPosition
        }));
    }
    onTouchPress(e) {
        this._drawApp.touch.touchPress(e, (lastPosition) => this.onButtonDown({
            button: MouseButton.LEFT,
            position: lastPosition
        }));
    }
    onTouchMove(e) {
        this._drawApp.touch.touchMove(e, (lastPosition) => this.onMove({
            button: MouseButton.LEFT,
            position: lastPosition
        }));
    }
    onTwoFingersMove(e) {
        this._drawApp.touch.touchTwoFingers(e, (lastPosition) => this.onButtonDown({ button: MouseButton.MIDDLE, position: lastPosition }), (lastPosition, zoomIn) => this.onZoom({
            button: MouseButton.MIDDLE,
            position: lastPosition,
            scroll: zoomIn ? -1 : 1
        }));
    }
    onTwoFingersTap(e) {
        this._drawApp.touch.touchTwoFingersTap(e, () => this.onButtonDown({
            button: MouseButton.RIGHT,
            position: VectorZero
        }));
    }
    onMouseDown(e) {
        e.preventDefault();
        this.onButtonDown({ button: e.button, position: { x: e.offsetX, y: e.offsetY } });
    }
    onButtonDown(e) {
        const mouse = this._drawApp.mouse;
        this._setupMousePosition(e.position);
        if (e.button === MouseButton.LEFT) {
            mouse.mouseDownLeft();
        }
        else if (e.button === MouseButton.RIGHT) {
            mouse.mouseDownRight();
        }
        else if (e.button === MouseButton.MIDDLE) {
            mouse.mouseWheelButtonDown();
        }
        if (mouse.button !== MouseButton.NONE) {
            this._dispatchEvent();
        }
    }
    onMouseUp(e) {
        e.preventDefault();
        this.onButtonUp({ button: e.button, position: { x: e.offsetX, y: e.offsetY } });
    }
    onButtonUp(e) {
        const mouse = this._drawApp.mouse;
        this._setupMousePosition(e.position);
        if (e.button === MouseButton.LEFT) {
            mouse.mouseUpLeft();
        }
        else if (e.button === MouseButton.RIGHT) {
            mouse.mouseUpRight();
            if (this._drawApp.toolSelector.tool !== undefined) {
                this._drawApp.canvas.dispatchEvent(this._drawApp.toolSelector.tool.event);
            }
        }
        else if (e.button === MouseButton.MIDDLE) {
            mouse.mouseWheelButtonUp();
        }
        this._dispatchEvent();
    }
    onMouseWheel(e) {
        e.preventDefault();
        this._drawApp.mouse.scrollStep = this._drawApp.zoom.stepsMouseWheel;
        this.onZoom({ scroll: e.deltaY, position: { x: e.offsetX, y: e.offsetY } });
    }
    onZoom(e) {
        const mouse = this._drawApp.mouse;
        this._setupMousePosition(e.position);
        if (e.scroll > 0) {
            mouse.mouseWheelDown();
        }
        else if (e.scroll < 0) {
            mouse.mouseWheelUp();
        }
        if (mouse.scroll !== MouseScroll.NONE) {
            this._dispatchEvent();
            mouse.scroll = MouseScroll.NONE;
            this._drawApp.toolSelector.restoreTool();
        }
    }
    onMouseMove(e) {
        e.preventDefault();
        this.onMove({ button: e.button, position: { x: e.offsetX, y: e.offsetY } });
    }
    onMove(e) {
        const mouse = this._drawApp.mouse;
        mouse.moving = true;
        this._setupMousePosition(e.position);
        if (mouse.button !== MouseButton.NONE) {
            this._dispatchEvent();
        }
        else {
            this._drawApp.gui.mouseCheck();
        }
        mouse.moving = false;
    }
    onMouseEnter(e) {
        const mouse = this._drawApp.mouse;
        if (e.buttons === MouseButton.LEFT) {
            mouse.mouseLeave();
            this._dispatchEvent();
        }
        if (mouse.button !== MouseButton.NONE) {
            this._setupMousePosition({ x: e.offsetX, y: e.offsetY });
        }
    }
    onContextMenu(e) {
        e.preventDefault();
    }
    onResizeWindow(drawApp) {
        drawApp.resizeWindow();
    }
    _setupMousePosition(e) {
        const mouse = this._drawApp.mouse;
        if (e === undefined) {
            e = VectorZero;
        }
        if (mouse.lastPosition === null) {
            mouse.mouseMove({ x: e.x, y: e.y });
            mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y };
        }
        else {
            mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y };
            mouse.mouseMove({ x: e.x, y: e.y });
        }
    }
    _dispatchEvent() {
        if (this._drawApp.toolSelector.tool !== undefined) {
            this._drawApp.gui.mouseCheck();
            this._drawApp.canvas.dispatchEvent(this._drawApp.toolSelector.tool.event);
        }
    }
}
