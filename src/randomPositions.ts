import RBush from 'rbush';
// @ts-ignore
import knn from './rbush-knn';

import { distanceSqr, indexOfMax, Point } from './utils';

interface Rect extends Point {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export function whiteNoise(count: number, w = 1, h = 1, centered = false) {
    var positions = new Array(count);
    for (let i = 0; i < positions.length; i++) {
        positions[i] = randomPoint(w, h, centered);
    }

    return positions;
}

export function blueNoise(count: number, w = 1, h = 1, size = 0, centered = false): Point[] {
    var positions = new Array(count);

    if (count === 0)
        return positions;

    var tree = new RBush();
    var startPos = setRectValues(randomPoint(w, h, centered), size);
    tree.insert(startPos);
    positions[0] = startPos;

    var numSumplePositions = 5;

    for (let pi = 1; pi < count; pi++) {
        var candidates = whiteNoise(numSumplePositions, w, h, centered);
        var distanceToClosest = candidates.map(p => {
            let neighbor = knn(tree, p.x, p.y, 1)[0];
            return distanceSqr(p, neighbor);

        })
        var farthest = candidates[indexOfMax(distanceToClosest)];
        farthest = setRectValues(farthest, size);
        tree.insert(farthest);
        positions[pi] = farthest;
    }


    return positions;
}

function randomPoint(w = 1, h = 1, centered = false) {
    let x = Math.random() * w;
    let y = Math.random() * h;

    if (centered) {
        x -= w / 2;
        y -= h / 2;
    }

    x = x < 0 ? x + w : x;
    y = y < 0 ? y + h : y;

    return { x, y };
}

function setRectValues(point: Point, size: number): Rect {
    size = size || 0;

    var rect = point as Rect;

    rect.minX = rect.x;
    rect.minY = rect.y;
    rect.maxX = rect.x + size;
    rect.maxY = rect.y + size;
    return rect;
}