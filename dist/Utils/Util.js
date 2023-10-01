export function PushIfNotExists(pos, array) {
    if (!array.some(position => position.x === pos.x && position.y === pos.y)) {
        array.push(pos);
        return false;
    }
    else {
        return true;
    }
}
export function LoadImage(name) {
    const blob = new Blob([name], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const image = document.createElement('img');
    image.src = url;
    return image;
}
