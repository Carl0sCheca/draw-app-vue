export type HSV = {
    H: number;
    S: number;
    V: number;
};
export type HSL = {
    H: number;
    S?: number;
    L?: number;
};
export declare function HSVtoHSL(hsv: HSV): HSL;
export declare function HSLtoString(hsl: HSL): string;
export declare function RGBtoHEX(array: Array<number>): string;
export declare function RandomColour(): string;
