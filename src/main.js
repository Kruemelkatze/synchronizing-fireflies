import * as PIXI from 'pixi.js';
import fireflySprite from "../assets/firefly.png";


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
loader.add('firefly', fireflySprite).load((loader, resources) => {
    // This creates a texture from a 'firefly.png' image.
    const firefly = new PIXI.Sprite(resources.firefly.texture);

    // Setup the position of the firefly
    firefly.x = app.renderer.width / 2;
    firefly.y = app.renderer.height / 2;

    // Rotate around the center
    firefly.anchor.x = 0.5;
    firefly.anchor.y = 0.5;

    // Add the firefly to the scene we are building.
    app.stage.addChild(firefly);

    // Listen for frame updates
    app.ticker.add(() => {
        // each frame we spin the firefly around a bit
        firefly.rotation += 0.01;
    });
});