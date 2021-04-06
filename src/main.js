import * as PIXI from 'pixi.js';
import Assets, { loadAllAssets } from './assets';
import Firefly from './firefly';
import IncidenceMatrix from './incidenceMatrix';
import { blueNoise, whiteNoise } from './randomPositions';

const PositionSampleType = {
    WhiteNoise: Symbol.for("White Noise"),
    BlueNoise: Symbol.for("Blue Noise"),
};

export const Settings = {
    fireflyCount: 128,
    positionSampleType: PositionSampleType.BlueNoise,
    fireflySpeed: [60, 100],
    fireflyRotSpeed: [Math.PI / 4, Math.PI / 2],
    fireflySize: 32,
    range: 256,
    blinkDelay: 4,
    blinkTime: 0.2,
    nudgeAmount: 0.2,
}

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type)

const app = new PIXI.Application({
    backgroundColor: "0x191811",
    width: window.innerWidth,
    height: window.innerHeight,
});
document.body.appendChild(app.view);


window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

// load the texture we need
loadAllAssets(app).load((loader, resources) => setup(loader, resources));
function setup(loader, resources) {
    var fireflies = addFireflies();
    var incidenceMatrix = new IncidenceMatrix(fireflies, Settings.range);

    app.ticker.add((delta) => {
        incidenceMatrix.updateIncidenceMatrix();
    })

    Firefly.registerBlinkObserver(firefly => onBlink(firefly, fireflies, incidenceMatrix));
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

function getPositions(count) {
    var positions;

    var start = Date.now();

    switch (Settings.positionSampleType) {
        case PositionSampleType.BlueNoise:
            positions = blueNoise(count, app.renderer.width, app.renderer.height);
            break;
        default:
            positions = whiteNoise(count, app.renderer.width, app.renderer.height, Settings.fireflySize);
            break;
    }

    var elapsed = Date.now() - start;
    console.log(`Evaluating ${count} positions using ${Settings.positionSampleType.toString()} took ${elapsed}ms.`)

    return positions;
}

function onBlink(firefly, fireflies, incidenceMatrix) {
    for (let i = 0; i < fireflies.length; i++) {
        let other = fireflies[i];
        if (incidenceMatrix.isNear(firefly.index, i)) {
            other.nudge(firefly.clock);
        }
    }
}