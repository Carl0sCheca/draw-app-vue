import { GUIElement } from './GUIElement';
export declare class ToolBoxGUI extends GUIElement {
    windowResize(): void;
    init(guiElements: Array<GUIElement>): void;
    loadImagesAndButtons(): Promise<void>;
    toggle(): void;
    show(): void;
    hide(): void;
    ui(): void;
    mouseUp(): void;
    mouseDown(): void;
}
