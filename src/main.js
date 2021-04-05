import * as PIXI from 'pixi.js';
import Assets from './assets';
import Firefly from './firefly';
import { blueNoise, whiteNoise } from './randomPositions';

const PositionSampleType = {
    WhiteNoise: Symbol.for("White Noise"),
    BlueNoise: Symbol.for("Blue Noise"),
};

const Settings = {
    fireflyCount: 128,
    positionSampleType: PositionSampleType.BlueNoise,
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

const loader = app.loader;

window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});


// load the texture we need
loader.add('firefly', Assets.firefly).load((loader, resources) => setup(loader, resources));
function setup(loader, resources) {
    addFireflies();
}

function addFireflies() {
    let positions = getPositions(Settings.fireflyCount);

    let fireflies = new Array(Settings.fireflyCount);
    for (let i = 0; i < fireflies.length; i++) {
        let pos = positions[i];
        fireflies[i] = new Firefly(app, pos.x, pos.y);
    }

    app.ticker.add((delta) => {
        for (let firefly of fireflies) {
            firefly.update(delta);
        }
    });
}

function getPositions(count) {
    var positions;

    var start = Date.now();

    switch (Settings.positionSampleType) {
        case PositionSampleType.BlueNoise:
            positions = blueNoise(count, app.renderer.width, app.renderer.height);
            break;
        default:
            positions = whiteNoise(count, app.renderer.width, app.renderer.height);
            break;
    }

    var elapsed = Date.now() - start;
    console.log(`Evaluating ${count} positions using ${Settings.positionSampleType.toString()} took ${elapsed}ms.`)

    return positions;
}