import { distanceSqr } from "./utils";

export default class IncidenceMatrix {
    matrix = null;
    range = 512;
    selector = null;
    elements = [];

    constructor(elements, range, selector) {
        this.elements = elements;
        this.range = range;
        this.selector = selector;

        var l = elements.length;
        this.matrix = new Array(l);
        for (let i = 0; i < l; i++) {
            this.matrix[i] = new Array(i + 1);
        }
    }

    updateIncidenceMatrix() {
        var rangeSqr = this.range * this.range;
        var elements = this.elements;

        for (let i = 0; i < elements.length; i++) {
            for (let j = 0; j <= i; j++) {
                if (i == j) {
                    this.matrix[i][j] = false;
                } else {
                    var dsqr = distanceSqr(elements[i], elements[j]);
                    this.matrix[i][j] = dsqr <= rangeSqr;
                }
            }
        }
    }

    isNear(i1, i2) {
        return i1 <= i2 ? this.matrix[i2][i1] : this.matrix[i1][i2];
    }
}