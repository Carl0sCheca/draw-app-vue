import { Mouse, MouseButton } from './Mouse';
import { EventCanvas } from './EventCanvas';
import { Data } from './Data';
import { ToolSelector, ToolType } from './Tools/ToolSelector';
import { GUI } from './GUI/GUI';
import { DiscretizationPosition, VectorAbs, VectorCeil, VectorClamp, VectorDiv, VectorTrunc, VectorZero } from './Utils/Math';
import { LeftPointCanvas, RightPointCanvas } from './Utils/Canvas';
import { Touch, TouchAction } from './Touch';
export class DrawApp {
    constructor(canvas, settings) {
        this.canvas = canvas;
        // Init canvas, mouse and events from canvas
        this.mouse = new Mouse(this);
        this.touch = new Touch(this);
        this.eventCanvas = new EventCanvas(this);
        // Data and setting from canvas
        this.data = new Data(this, settings.gridSize);
        this.settings = settings;
        this.settings.numColors = 20;
        // DrawApp context
        this.ctx = canvas.getContext('2d', { alpha: false });
        // Init Tool Selector
        this.toolSelector = new ToolSelector(this);
        // Zoom from Tool Selector
        this.zoom = this.toolSelector.tools[ToolType.ZOOM];
        // Set canvas size for GUI
        this.setSizeCanvas();
        // Init GUI
        this.gui = new GUI(this);
        this.gui.initToolBox();
        // Init canvas
        this.reloadCanvas();
    }
    getData() {
        return this.data.pixels;
    }
    loadData(pixels) {
        this.data.pixels = pixels;
        this.reloadCanvas();
    }
    saveImage() {
        let wasGridEnabled = false;
        if (this.settings.showGrid) {
            wasGridEnabled = true;
            this.toggleGrid();
        }
        const canvasUrl = this.canvas.toDataURL();
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
        createEl.download = 'image';
        createEl.click();
        createEl.remove();
        if (wasGridEnabled) {
            this.toggleGrid();
        }
    }
    paintCanvas(position, showGrid = false, color = this.toolSelector.colorSelected, sizeWidth = this.settings.pixelSize, sizeHeight = this.settings.pixelSize) {
        const point = {
            x: position.x * this.zoom.level + this.zoom.offset.x,
            y: position.y * this.zoom.level + this.zoom.offset.y
        };
        const pointSizeW = sizeWidth * this.zoom.level;
        const pointSizeH = sizeHeight * this.zoom.level;
        if (color.includes('hsl')) {
            this.ctx.fillStyle = color;
            color = this.ctx.fillStyle.substr(1);
        }
        else if (color.includes('#')) {
            color = color.substr(1);
        }
        this.ctx.fillStyle = '#' + color;
        this.ctx.fillRect(point.x, point.y, pointSizeW, pointSizeH);
        if (showGrid && this.mouse.button !== MouseButton.MIDDLE) {
            if (this.touch.touchAction !== TouchAction.MOVEZOOM) {
                this.ctx.lineWidth = this.zoom.level;
                this.ctx.strokeStyle = this.settings.gridColor;
                this.ctx.strokeRect(point.x + 0.5, point.y + 0.5, pointSizeW - 0.5, pointSizeH - 0.5);
            }
        }
    }
    resizeWindow() {
        this.zoom.zoomIn();
        this.zoom.zoomOut();
        this.reloadCanvas();
        this.gui.guiElements.forEach(element => {
            if (element.windowResize) {
                element.windowResize();
            }
        });
        this.gui.reloadGUI();
    }
    reloadCanvas() {
        // console.time('reloadCanvas')
        this.setSizeCanvas();
        this._redrawCanvas();
        // console.timeEnd('reloadCanvas')
    }
    setSizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.settings.pixelSize = this.canvas.width / this.settings.gridSize;
    }
    toggleGrid() {
        this.settings.showGrid = !this.settings.showGrid;
        this.resizeWindow();
    }
    _redrawCanvas() {
        const startPoint = VectorTrunc(VectorAbs(VectorDiv(LeftPointCanvas(this), {
            x: this.settings.pixelSize,
            y: this.settings.pixelSize
        })));
        const endPoint = VectorClamp(VectorCeil(VectorAbs(VectorDiv(RightPointCanvas(this), {
            x: this.settings.pixelSize,
            y: this.settings.pixelSize
        }))), VectorZero, { x: this.settings.gridSize, y: this.settings.gridSize });
        this.paintCanvas({ x: 0, y: 0 }, false, 'white', this.canvas.width, this.canvas.height);
        for (let i = startPoint.x; i < endPoint.x; i++) {
            for (let j = startPoint.y; j < endPoint.y; j++) {
                this.paintCanvas(DiscretizationPosition({
                    x: i,
                    y: j
                }, this), this.settings.showGrid, this.data.pixels[i][j]);
            }
        }
        this.gui.reloadRelativeGUI();
    }
}
