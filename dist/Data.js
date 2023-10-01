import { CheckRange, Clamp } from './Utils/Math';
export var Type;
(function (Type) {
    Type[Type["Vector"] = 0] = "Vector";
    Type[Type["Array"] = 1] = "Array";
})(Type || (Type = {}));
export class Data {
    constructor(_drawApp, _gridSize) {
        this._drawApp = _drawApp;
        this._gridSize = _gridSize;
        this._initData();
    }
    _initData(color = 'ffffff') {
        let loaded = false;
        if (typeof (Storage) !== undefined) {
            if (localStorage.pixels) {
                const pixels = JSON.parse(localStorage.pixels);
                if (pixels.length === parseInt(this._gridSize)) {
                    this.pixels = pixels;
                    loaded = true;
                }
            }
        }
        if (!loaded) {
            this.pixels = [];
            for (let i = 0; i < this._gridSize; i++) {
                this.pixels[i] = [];
                for (let j = 0; j < this._gridSize; j++) {
                    this.pixels[i][j] = color;
                }
            }
        }
        this.lastAction = [];
        this.lastActionIndex = -1;
    }
    saveLocalStorage() {
        if (typeof (Storage) !== undefined) {
            localStorage.pixels = JSON.stringify(this.pixels);
        }
    }
    clearData(color = 'ffffff') {
        var _a, _b;
        const pixel = { positions: [], colors: [], type: Type.Array };
        for (let i = 0; i < this._gridSize; i++) {
            for (let j = 0; j < this._gridSize; j++) {
                (_a = pixel.positions) === null || _a === void 0 ? void 0 : _a.push({ x: i, y: j });
                (_b = pixel.colors) === null || _b === void 0 ? void 0 : _b.push(this.pixels[i][j]);
                this.pixels[i][j] = color;
            }
        }
        this._checkLastActionAndWrite(pixel);
        this.saveLocalStorage();
    }
    static FlushDuplicatedData(pixel, gridSize) {
        var _a;
        const _pixels = [];
        for (let i = 0; i < gridSize; i++) {
            _pixels[i] = [];
        }
        (_a = pixel.positions) === null || _a === void 0 ? void 0 : _a.forEach((position, index) => {
            if (CheckRange(position, { x: 0, y: 0 }, { x: gridSize - 1, y: gridSize - 1 })) {
                _pixels[position.x][position.y] = pixel.colors[index];
            }
        });
        pixel.positions = [];
        pixel.colors = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (_pixels[i][j] !== undefined) {
                    pixel.positions.push({ x: i, y: j });
                    pixel.colors.push(_pixels[i][j]);
                }
            }
        }
        return pixel;
    }
    _checkLastActionAndWrite(p) {
        if (this.lastActionIndex + 1 !== this.lastAction.length) {
            this.lastAction.splice(this.lastActionIndex + 1);
        }
        if (this.lastAction[this.lastActionIndex + 1] !== undefined) {
            this.lastAction[this.lastActionIndex + 1] = p;
        }
        else {
            this.lastAction.push(p);
        }
        this.lastActionIndex++;
    }
    writeData(pixel) {
        var _a, _b;
        if (this.pixels !== undefined || pixel !== undefined) {
            if (pixel.type === Type.Vector) {
                this._checkPixelAndPaint(pixel.position, pixel.color);
            }
            else if (pixel.type === Type.Array) {
                const p = { positions: [], colors: [], type: Type.Array };
                (_a = pixel.positions) === null || _a === void 0 ? void 0 : _a.forEach(pos => {
                    var _a, _b;
                    if (CheckRange(pos, { x: 0, y: 0 }, { x: this._gridSize - 1, y: this._gridSize - 1 })) {
                        (_a = p.positions) === null || _a === void 0 ? void 0 : _a.push({ x: pos.x, y: pos.y });
                        (_b = p.colors) === null || _b === void 0 ? void 0 : _b.push(this.pixels[pos.x][pos.y]);
                    }
                });
                this._checkLastActionAndWrite(p);
                (_b = pixel.positions) === null || _b === void 0 ? void 0 : _b.forEach((position, index) => {
                    if (position !== null) {
                        const color = pixel.color ? pixel.color : pixel.colors[index];
                        this._checkPixelAndPaint(position, color);
                    }
                });
            }
            this.saveLocalStorage();
        }
    }
    _checkPixelAndPaint(position, color) {
        if (CheckRange(position, { x: 0, y: 0 }, { x: this._gridSize - 1, y: this._gridSize - 1 })) {
            this._drawApp.ctx.fillStyle = color;
            this.pixels[Clamp(position.x, 0, this._gridSize - 1)][Clamp(position.y, 0, this._gridSize - 1)] = this._drawApp.ctx.fillStyle.substr(1);
        }
    }
    canUndo() {
        return this.lastActionIndex >= 0;
    }
    undo() {
        var _a;
        if (this.canUndo()) {
            const pixel = this.lastAction[this.lastActionIndex];
            this.lastActionIndex--;
            const tempPositions = [];
            const tempColors = [];
            (_a = pixel.positions) === null || _a === void 0 ? void 0 : _a.forEach((pos, index) => {
                tempPositions.push(pos);
                tempColors.push(this.pixels[pos.x][pos.y]);
                this.pixels[pos.x][pos.y] = pixel.colors[index];
            });
            this.lastAction[this.lastActionIndex + 1] = { positions: tempPositions, colors: tempColors, type: Type.Array };
            this.saveLocalStorage();
        }
    }
    canRedo() {
        return this.lastActionIndex + 1 < this.lastAction.length;
    }
    redo() {
        var _a;
        if (this.canRedo()) {
            this.lastActionIndex++;
            const pixel = this.lastAction[this.lastActionIndex];
            const tempPositions = [];
            const tempColors = [];
            (_a = pixel.positions) === null || _a === void 0 ? void 0 : _a.forEach((pos, index) => {
                tempPositions.push(pos);
                tempColors.push(this.pixels[pos.x][pos.y]);
                this.pixels[pos.x][pos.y] = pixel.colors[index];
            });
            this.lastAction[this.lastActionIndex] = { positions: tempPositions, colors: tempColors, type: Type.Array };
            this.saveLocalStorage();
        }
    }
}
