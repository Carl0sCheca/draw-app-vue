import { IsInsideCanvas } from './Canvas';
export const VectorZero = { x: 0, y: 0 };
export function VectorAdd(vector1, vector2) {
    return { x: vector1.x + vector2.x, y: vector1.y + vector2.y };
}
export function VectorMidPoint(vector1, vector2) {
    return { x: (vector1.x + vector2.x) / 2, y: (vector1.y + vector2.y) / 2 };
}
export function VectorSub(vector1, vector2) {
    return { x: vector1.x - vector2.x, y: vector1.y - vector2.y };
}
export function VectorDiv(vector1, vector2) {
    return { x: vector1.x / vector2.x, y: vector1.y / vector2.x };
}
export function VectorAbs(vector) {
    return { x: Math.abs(vector.x), y: Math.abs(vector.y) };
}
export function VectorTrunc(vector) {
    return { x: Math.trunc(vector.x), y: Math.trunc(vector.y) };
}
export function VectorFloor(vector) {
    return { x: Math.floor(vector.x), y: Math.floor(vector.x) };
}
export function VectorCeil(vector) {
    return { x: Math.ceil(vector.x), y: Math.ceil(vector.y) };
}
export function VectorMaxComponent(vector) {
    return Math.max(vector.x, vector.y);
}
export function VectorHypot(vector1, vector2) {
    const newVector = VectorSub(vector1, vector2);
    return Math.hypot(newVector.x, newVector.y);
}
export function Clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    else if (value > max) {
        return max;
    }
    else {
        return value;
    }
}
export function VectorClamp(vector, min, max) {
    return { x: Clamp(vector.x, min.x, max.x), y: Clamp(vector.y, min.y, max.y) };
}
export function DiscretizationPosition(discretePosition, canvas) {
    return {
        x: discretePosition.x * canvas.settings.pixelSize,
        y: discretePosition.y * canvas.settings.pixelSize
    };
}
export function DiscretizationDataPosition(position, canvas) {
    return {
        x: Clamp(Math.trunc(position.x / canvas.settings.pixelSize), 0, canvas.settings.gridSize - 1),
        y: Clamp(Math.trunc(position.y / canvas.settings.pixelSize), 0, canvas.settings.gridSize - 1)
    };
}
export function Lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}
export function LerpSteps(drawApp, firstPosition, lastPosition, callback) {
    if (!IsInsideCanvas(drawApp))
        return;
    const startPosition = DiscretizationDataPosition(firstPosition, drawApp);
    const endPosition = DiscretizationDataPosition(lastPosition, drawApp);
    const distance = Math.max(Math.trunc(Math.abs(startPosition.x - endPosition.x)), Math.trunc(Math.abs(startPosition.y - endPosition.y)));
    const _lerpSteps = 1 / distance;
    for (let _lerp = _lerpSteps; _lerp <= 1; _lerp += _lerpSteps) {
        const _currentPos = {
            x: Math.trunc(Lerp(endPosition.x, startPosition.x, _lerp)),
            y: Math.trunc(Lerp(endPosition.y, startPosition.y, _lerp))
        };
        callback(_currentPos);
    }
}
export function RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function CheckRange(position, minPosition, maxPosition) {
    return position.x >= minPosition.x && position.x <= maxPosition.x && position.y >= minPosition.y && position.y <= maxPosition.y;
}
