export class GUIElement {
    constructor(drawApp, name) {
        this.drawApp = drawApp;
        this.name = name;
        this.enabled = false;
        this.clickIn = true;
        this.child = [];
        this.active = false;
        this.loaded = false;
        this.selectable = true;
        this.hoverable = true;
    }
    set size(size) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    set position(position) {
        this._position = position;
    }
    get position() {
        return this._position;
    }
    hide() {
        this.enabled = false;
    }
    show() {
        this.enabled = true;
    }
    hover() {
        this.drawApp.ctx.filter = 'hue-rotate(180deg)';
        this.ui();
        this.drawApp.ctx.filter = 'none';
    }
    static AddElement(collection, drawApp, element, img, position, size) {
        if (position !== undefined) {
            element._position = position;
        }
        else {
            element._position = { x: 0, y: 0 };
        }
        if (img !== null) {
            if (size !== undefined) {
                img.width = size.x;
                img.height = size.y;
            }
            else {
                const defaultSize = 68;
                img.width = defaultSize;
                img.height = defaultSize;
            }
            element.size = { x: img.width, y: img.height };
            element.img = img;
        }
        else {
            element.size = size;
        }
        collection.push(element);
    }
    setActive(image = this.img, rotation = 270) {
        if (this.img !== undefined) {
            this.active = true;
            this.drawApp.ctx.filter = `hue-rotate(${rotation}deg)`;
            this.drawApp.ctx.drawImage(image, this._position.x, this._position.y, this.size.x, this.size.y);
            this.drawApp.ctx.filter = 'none';
        }
    }
}
