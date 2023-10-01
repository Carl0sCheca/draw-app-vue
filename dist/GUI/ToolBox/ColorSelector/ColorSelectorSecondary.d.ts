import { GUIElement } from '../../GUIElement';
export declare class ColorSelectorSecondary extends GUIElement {
    private _imageData;
    private hueSelectorPosition;
    private hueSelectorSize;
    private colorPickedSize;
    private _sizeHueSelector;
    private _hue;
    init(): void;
    windowResize(): void;
    mouseUp(): void;
    changeHue(): void;
    ui(): void;
}
