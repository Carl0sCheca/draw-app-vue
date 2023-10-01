import { GUIElement } from '../GUIElement';
export declare class PencilButton extends GUIElement {
    imgAlternative: HTMLImageElement;
    private _pencilTool;
    private _startTime;
    private readonly _rainbowSelectorTime;
    init(): void;
    mouseDown(): void;
    mouseUp(): void;
    ui(): void;
}
