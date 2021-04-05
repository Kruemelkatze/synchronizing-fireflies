export function randomFromRange([from, to], r) {
    var r = r || Math.random();
    return from + r * (to - from);
}

export function randomSign(r) {
    return (r || Math.random()) < 0.5 ? -1 : 1;
}