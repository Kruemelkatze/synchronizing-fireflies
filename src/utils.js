import * as PIXI from 'pixi.js';

export function randomFromRange([from, to], r) {
    var r = r || Math.random();
    return from + r * (to - from);
}

export function randomSign(r) {
    return (r || Math.random()) < 0.5 ? -1 : 1;
}

export function distanceSqr(p1, p2) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}

export function indexOfMax(array) {
    return array.reduce((iMax, x, i) => x > array[iMax] ? i : iMax, 0);
}

export function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b))
}

export function clamp01(x) {
    return clamp(x, 0, 1);
}

// PIXI Stuff

export const PIXIFactory = Object.freeze({
    createSprite(texture, centered = true) {
        var sprite = new PIXI.Sprite(texture);

        if (centered) {
            sprite.anchor.set(0.5);
        }

        return sprite;
    }
});