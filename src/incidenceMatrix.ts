import { distanceSqr, Point } from "./utils";

export default class IncidenceMatrix {
    matrix: boolean[][];
    range = 512;
    elements: Point[] = [];

    constructor(elements: Point[], range: number) {
        this.elements = elements;
        this.range = range;

        var l = elements.length;
        this.matrix = new Array<Array<boolean>>(l);
        for (let i = 0; i < l; i++) {
            this.matrix[i] = new Array<boolean>(i + 1);
        }
    }

    updateIncidenceMatrix(split: number = 1, n: number = 0) {
        var rangeSqr = this.range * this.range;
        var elements = this.elements;

        split = split || 1;
        n = n || 0;

        let start = (elements.length / split) * n;
        let end = start + elements.length / split;

        for (let i = start; i < end; i++) {
            for (let j = start; j <= i; j++) {
                if (i == j) {
                    this.matrix[i][j] = false;
                } else {
                    var dsqr = distanceSqr(elements[i], elements[j]);
                    this.matrix[i][j] = dsqr <= rangeSqr;
                }
            }
        }
    }

    isNear(i1: number, i2: number) {
        return i1 <= i2 ? this.matrix[i2][i1] : this.matrix[i1][i2];
    }
}