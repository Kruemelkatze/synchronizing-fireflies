import * as PIXI from 'pixi.js';
import Assets from './assets';
import Firefly from './firefly';

const Settings = {
    fireflyCount: 128,
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
    let w = app.renderer.width;
    let h = app.renderer.height;

    let positions = new Array(count);
    for (let i = 0; i < positions.length; i++) {
        let pos = {
            x: Math.random() * w,
            y: Math.random() * h,
        };

        positions[i] = pos;
    }

    return positions;
}

const PositionSampleType = {
    MathRandom: new Symbol("Math Random"),
    BlueNoise: new Symbol("Blue Noise"),
};