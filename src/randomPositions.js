import _ from 'lodash';
import RBush from 'rbush';

import knn from './rbush-knn';
import { distanceSqr, indexOfMax } from './utils';

export function whiteNoise(count, w = 1, h = 1, centered = false) {
    var positions = new Array(count);
    for (let i = 0; i < positions.length; i++) {
        positions[i] = randomPoint(w, h, centered);
    }

    return positions;
}

export function blueNoise(count, w = 1, h = 1, size = 0, centered = false) {
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

    return { x, y };
}

function setRectValues(point, size) {
    size = size || 0;

    point.minX = point.x;
    point.minY = point.y;
    point.maxX = point.x + size;
    point.maxY = point.y + size;
    return point;
}