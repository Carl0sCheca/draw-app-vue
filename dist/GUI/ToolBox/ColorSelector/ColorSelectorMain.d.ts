import { GUIElement } from '../../GUIElement';
import { Vector } from '../../../Utils/Math';
export declare class ColorSelectorMain extends GUIElement {
    private _imageData;
    pixelSize: Vector;
    windowResize(): void;
    mouseUp(): void;
    ui(): void;
}
