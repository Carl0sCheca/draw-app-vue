var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GUIElement } from './GUIElement';
import { PencilButton } from './ToolBox/PencilButton';
import { CircleButton } from './ToolBox/CircleButton';
import { GridButton } from './ToolBox/GridButton';
import { ClearButton } from './ToolBox/ClearButton';
import { BucketButton } from './ToolBox/BucketButton';
import { ColorPickerButton } from './ToolBox/ColorPickerButton';
import { ColorSelectorButton } from './ToolBox/ColorSelector/ColorSelectorButton';
import { GUI } from './GUI';
import { ToolType } from '../Tools/ToolSelector';
import { UndoButton } from './ToolBox/UndoButton';
import { RedoButton } from './ToolBox/RedoButton';
import * as Images from '../assets/images';
import { LoadImage } from '../Utils/Util';
export class ToolBoxGUI extends GUIElement {
    windowResize() {
        this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height };
        this.child.forEach(element => {
            if (element.windowResize) {
                element.windowResize();
            }
        });
    }
    init(guiElements) {
        this.drawApp.setSizeCanvas();
        this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height };
        this.position = {
            x: 0,
            y: 0
        };
        this.loadImagesAndButtons().then(() => {
            guiElements.push(this);
            setTimeout(() => {
                this.loaded = true;
            }, 100);
        });
    }
    loadImagesAndButtons() {
        return __awaiter(this, void 0, void 0, function* () {
            const globalSize = 64;
            const pencilButton = new PencilButton(this.drawApp, ToolType.PENCIL.toString());
            pencilButton.parent = this;
            pencilButton.init();
            GUIElement.AddElement(this.child, this.drawApp, pencilButton, LoadImage(Images.pencil), {
                x: this.position.x,
                y: this.position.y
            });
            pencilButton.imgAlternative = LoadImage(Images.pencilBig);
            const circleButton = new CircleButton(this.drawApp, ToolType.CIRCLE.toString());
            GUIElement.AddElement(this.child, this.drawApp, circleButton, LoadImage(Images.circle), {
                x: this.position.x,
                y: this.position.y + globalSize * this.child.length
            });
            circleButton.imgFilled = LoadImage(Images.circleFilled);
            GUIElement.AddElement(this.child, this.drawApp, new BucketButton(this.drawApp, ToolType.BUCKET.toString()), LoadImage(Images.bucket), {
                x: this.position.x,
                y: this.position.y + globalSize * this.child.length
            });
            GUIElement.AddElement(this.child, this.drawApp, new ColorPickerButton(this.drawApp, ToolType.COLOUR_PICKER.toString()), LoadImage(Images.colorpicker), {
                x: this.position.x,
                y: this.position.y + globalSize * this.child.length
            });
            const gridButton = new GridButton(this.drawApp, ToolType.GRID.toString());
            gridButton.selectable = false;
            GUIElement.AddElement(this.child, this.drawApp, gridButton, LoadImage(Images.grid), {
                x: this.position.x,
                y: this.position.y + globalSize * this.child.length
            });
            gridButton.imgFilled = LoadImage(Images.gridDisabled);
            const clearButton = new ClearButton(this.drawApp, ToolType.CLEAR.toString());
            clearButton.selectable = false;
            GUIElement.AddElement(this.child, this.drawApp, clearButton, LoadImage(Images.clear), {
                x: this.drawApp.canvas.width - globalSize,
                y: 0
            });
            const undoButton = new UndoButton(this.drawApp, 'undoButton');
            undoButton.selectable = false;
            GUIElement.AddElement(this.child, this.drawApp, undoButton, LoadImage(Images.undo), {
                x: this.position.x + globalSize,
                y: this.position.y
            });
            const redoButton = new RedoButton(this.drawApp, 'redoButton');
            redoButton.selectable = false;
            GUIElement.AddElement(this.child, this.drawApp, redoButton, LoadImage(Images.redo), {
                x: this.position.x + (globalSize * 2),
                y: this.position.y
            });
            const colorSelector = new ColorSelectorButton(this.drawApp, 'Color Selector');
            colorSelector.selectable = false;
            colorSelector.change = true;
            colorSelector.hoverable = false;
            colorSelector.size = {
                x: 280,
                y: 250
            };
            colorSelector.position = {
                x: this.drawApp.canvas.width - colorSelector.size.x - 5,
                y: this.drawApp.canvas.height - colorSelector.size.y - 5
            };
            colorSelector.init();
            this.child.push(colorSelector);
            this.drawApp.toolSelector.selectTool = this.drawApp.toolSelector.startTool;
            this.child.find(element => { var _a; return element.name === ((_a = this.drawApp.toolSelector.tool) === null || _a === void 0 ? void 0 : _a.name); }).active = true;
        });
    }
    toggle() {
        if (!this.loaded) {
            return;
        }
        if (this.enabled) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    show() {
        this.enabled = true;
        this.child.forEach(element => element.show());
        this.ui();
    }
    hide() {
        this.enabled = false;
        this.drawApp.gui.reloadGUI();
        this.drawApp.reloadCanvas();
    }
    ui() {
        this.drawApp.ctx.fillStyle = 'gray';
        this.drawApp.ctx.globalAlpha = 0.6;
        this.drawApp.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        this.drawApp.ctx.globalAlpha = 1;
        this.child.forEach(button => button.ui());
    }
    mouseUp() {
        this.child.forEach(child => {
            if (GUI.CheckInsideGUIElement(this.drawApp, child)) {
                if (!child.selectable) {
                    if (child.mouseUp) {
                        child.mouseUp();
                    }
                    return;
                }
                this.child.filter(c => c.name !== child.name).forEach(c => {
                    c.active = false;
                    c.ui();
                });
                child.mouseUp();
                child.setActive();
                child.ui();
                this.drawApp.reloadCanvas();
                this.drawApp.gui.reloadGUI();
            }
        });
    }
    mouseDown() {
        this.child.forEach(child => {
            if (GUI.CheckInsideGUIElement(this.drawApp, child)) {
                if (child.mouseDown) {
                    child.mouseDown();
                }
            }
        });
    }
}
