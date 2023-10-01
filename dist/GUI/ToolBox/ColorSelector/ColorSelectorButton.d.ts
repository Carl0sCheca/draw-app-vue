import { GUIElement } from '../../GUIElement';
export declare class ColorSelectorButton extends GUIElement {
    change: boolean;
    hue: number;
    windowResize(): void;
    init(): void;
    mouseUp(): void;
    ui(): void;
}
