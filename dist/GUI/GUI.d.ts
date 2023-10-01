import { DrawApp } from '../index';
import { GUIElement } from './GUIElement';
import { ToolBoxGUI } from './ToolBoxGUI';
export declare class GUI {
    private readonly _drawApp;
    toolbox: ToolBoxGUI;
    private _clickIn;
    guiElements: GUIElement[];
    constructor(_drawApp: DrawApp);
    initToolBox(): void;
    reloadGUI(): void;
    reloadRelativeGUI(): void;
    private _gridLines;
    private _centerLines;
    mouseCheck(): void;
    static CheckInsideGUIElement(drawApp: DrawApp, element: GUIElement): boolean;
}
