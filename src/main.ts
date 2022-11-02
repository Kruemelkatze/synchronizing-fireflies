import * as PIXI from 'pixi.js';
import Firefly from './firefly';
import IncidenceMatrix from './incidenceMatrix';
import { blueNoise, whiteNoise } from './randomPositions';
import '../style.scss'
import { Point } from './utils';

const PositionSampleType = {
    WhiteNoise: Symbol.for("White Noise"),
    BlueNoise: Symbol.for("Blue Noise"),
};

export const Settings = {
    fireflyCount: 400,
    positionSampleType: PositionSampleType.WhiteNoise,
    fireflySpeed: [60, 100],
    fireflyRotSpeed: [Math.PI / 4, Math.PI / 2],
    fireflySize: 32,
    range: 150,
    blinkDelay: 4,
    blinkTime: 0.2,
    nudgeAmount: 0.2,
}

const app = new PIXI.Application({
    backgroundColor: "0x191811",
    width: window.innerWidth,
    height: window.innerHeight,
});

var fireflies = new Array<Firefly>();
var debugCircle;
document.body.appendChild(app.view as any);

window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

setup();
setupDebug();

function setupDebug() {
    let fireboss = fireflies[0].container;

    debugCircle = new PIXI.Graphics();
    debugCircle.beginFill(0xff0000)
    debugCircle.drawCircle(0, 0, Settings.range);
    debugCircle.beginHole();
    debugCircle.drawCircle(0, 0, Settings.range - 2);

    fireboss.addChild(debugCircle);

}

function setup() {
    fireflies = addFireflies();
    var incidenceMatrix = new IncidenceMatrix(fireflies, Settings.range);
    incidenceMatrix.updateIncidenceMatrix();

    let n = 0;
    app.ticker.add((delta) => {
        incidenceMatrix.updateIncidenceMatrix(4, n);
        n = (n + 1) % 4;
    })

    Firefly.registerBlinkObserver((firefly: Firefly) => onBlink(firefly, fireflies, incidenceMatrix));
}

function addFireflies() {
    let positions = getPositions(Settings.fireflyCount);

    let fireflies = new Array(Settings.fireflyCount);
    for (let i = 0; i < fireflies.length; i++) {
        let pos = positions[i];
        fireflies[i] = new Firefly(app, i, pos.x, pos.y);
    }

    app.ticker.add((delta) => {
        for (let firefly of fireflies) {
            firefly.update(delta);
        }
    });

    return fireflies;
}

function getPositions(count: number): Point[] {
    var positions;

    var start = Date.now();

    switch (Settings.positionSampleType) {
        case PositionSampleType.BlueNoise:
            positions = blueNoise(count, app.renderer.width, app.renderer.height, Settings.fireflySize);
            break;
        default:
            positions = whiteNoise(count, app.renderer.width, app.renderer.height);
            break;
    }

    var elapsed = Date.now() - start;
    console.log(`Evaluating ${count} positions using ${Settings.positionSampleType.toString()} took ${elapsed}ms.`)

    return positions;
}

function onBlink(firefly: Firefly, fireflies: Firefly[], incidenceMatrix: IncidenceMatrix) {
    for (let i = 0; i < fireflies.length; i++) {
        let other = fireflies[i];
        if (incidenceMatrix.isNear(firefly.index, i)) {
            other.nudge(firefly.clock);
        }
    }
}