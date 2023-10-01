import { PushIfNotExists } from './Util';
import { CheckRange } from './Math';
export function RecursiveFillPosition(pos, drawApp, array) {
    if (CheckRange(pos, { x: 0, y: 0 }, { x: drawApp.settings.gridSize - 1, y: drawApp.settings.gridSize - 1 })) {
        if (pos.x + 1 < drawApp.settings.gridSize && !(array.some(position => position.x - 1 === pos.x && position.y === pos.y))) {
            const p = { x: pos.x + 1, y: pos.y };
            PushIfNotExists(p, array);
            RecursiveFillPosition(p, drawApp, array);
        }
        if (pos.x - 1 >= 0 && !(array.some(position => position.x + 1 === pos.x && position.y === pos.y))) {
            const p = { x: pos.x - 1, y: pos.y };
            PushIfNotExists(p, array);
            RecursiveFillPosition(p, drawApp, array);
        }
        if (pos.y + 1 < drawApp.settings.gridSize && !(array.some(position => position.x === pos.x && position.y - 1 === pos.y))) {
            const p = { x: pos.x, y: pos.y + 1 };
            PushIfNotExists(p, array);
            RecursiveFillPosition(p, drawApp, array);
        }
        if (pos.y - 1 >= 0 && !(array.some(position => position.x === pos.x && position.y + 1 === pos.y))) {
            const p = { x: pos.x, y: pos.y - 1 };
            PushIfNotExists(p, array);
            RecursiveFillPosition(p, drawApp, array);
        }
    }
}
export function RecursiveFillColor(pos, drawApp, array, color) {
    if (CheckRange(pos, { x: 0, y: 0 }, { x: drawApp.settings.gridSize - 1, y: drawApp.settings.gridSize - 1 })) {
        if (pos.x + 1 < drawApp.settings.gridSize && drawApp.data.pixels[pos.x + 1][pos.y] === color && !(array.some(position => position.x - 1 === pos.x && position.y === pos.y))) {
            const p = { x: pos.x + 1, y: pos.y };
            PushIfNotExists(p, array);
            RecursiveFillColor(p, drawApp, array, color);
        }
        if (pos.x - 1 >= 0 && drawApp.data.pixels[pos.x - 1][pos.y] === color && !(array.some(position => position.x + 1 === pos.x && position.y === pos.y))) {
            const p = { x: pos.x - 1, y: pos.y };
            PushIfNotExists(p, array);
            RecursiveFillColor(p, drawApp, array, color);
        }
        if (pos.y + 1 < drawApp.settings.gridSize && drawApp.data.pixels[pos.x][pos.y + 1] === color && !(array.some(position => position.x === pos.x && position.y - 1 === pos.y))) {
            const p = { x: pos.x, y: pos.y + 1 };
            PushIfNotExists(p, array);
            RecursiveFillColor(p, drawApp, array, color);
        }
        if (pos.y - 1 >= 0 && drawApp.data.pixels[pos.x][pos.y - 1] === color && !(array.some(position => position.x === pos.x && position.y + 1 === pos.y))) {
            const p = { x: pos.x, y: pos.y - 1 };
            PushIfNotExists(p, array);
            RecursiveFillColor(p, drawApp, array, color);
        }
    }
}
export function IsInsideCanvas(drawApp) {
    return !(drawApp.mouse.dataPosition.x < 0 || drawApp.mouse.dataPosition.x >= drawApp.settings.gridSize ||
        drawApp.mouse.dataPosition.y < 0 || drawApp.mouse.dataPosition.y >= drawApp.settings.gridSize ||
        drawApp.mouse.position.x < 0 || drawApp.mouse.position.x >= drawApp.canvas.width ||
        drawApp.mouse.position.y < 0 || drawApp.mouse.position.y >= drawApp.canvas.height);
}
export function LeftPointCanvas(drawApp) {
    return {
        x: Math.trunc(-drawApp.zoom.offset.x / drawApp.zoom.level),
        y: Math.trunc(-drawApp.zoom.offset.y / drawApp.zoom.level)
    };
}
export function RightPointCanvas(drawApp) {
    return {
        x: Math.trunc((drawApp.canvas.width - drawApp.zoom.offset.x) / drawApp.zoom.level),
        y: Math.trunc((drawApp.canvas.height - drawApp.zoom.offset.y) / drawApp.zoom.level)
    };
}
export function MiddlePointCanvas(drawApp) {
    return {
        x: (LeftPointCanvas(drawApp).x + RightPointCanvas(drawApp).x) * 0.5,
        y: (LeftPointCanvas(drawApp).y + RightPointCanvas(drawApp).y) * 0.5
    };
}
export function PixelsOnScreen(drawApp) {
    return (drawApp.canvas.width - drawApp.zoom.offset.x) / (drawApp.settings.pixelSize * drawApp.zoom.level);
}
export function CheckIfSamePositionAsLast(actualPosition, lastPosition) {
    return actualPosition.x !== lastPosition.x || actualPosition.y !== lastPosition.y;
}
