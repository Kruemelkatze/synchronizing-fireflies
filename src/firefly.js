import * as PIXI from 'pixi.js';
import Assets, { getResource } from './assets';
import { Settings } from './main';
import { PIXIFactory, randomFromRange, randomSign } from './utils';



export default class Firefly {
    static staticBlinkObservers = [];

    index = 0;

    app = null;
    graphics = null;

    body = null;
    light = null;

    angle = 0;
    speed = 0;
    rotationalSpeed = 0;

    clock = 5;
    blinkedBefore = 100;
    nudgedBefore = 100;

    get x() { return this.graphics.x }
    get y() { return this.graphics.y }

    constructor(app, index, x, y) {
        this.app = app;
        this.index = index;

        var container = new PIXI.Container();

        this.body = PIXIFactory.createSprite(app, Assets.firefly, true);
        container.addChild(this.body);

        this.light = PIXIFactory.createSprite(app, Assets.light, true);
        this.light.width = this.light.height = 96;
        this.light.visible = false;

        container.addChildAt(this.light, 0);

        container.x = x;
        container.y = y;
        container.width = container.height = Settings.fireflySize;

        this.graphics = container;
        app.stage.addChild(this.graphics);

        // Setup values
        let r = Math.random(); // Kind of a speed attribute. Faster movement -> faster rotation, I guess?
        this.speed = randomFromRange(Settings.fireflySpeed, r);
        this.rotationalSpeed = randomFromRange(Settings.fireflyRotSpeed, r) * randomSign();
        this.graphics.rotation = Math.random() * 2 * Math.PI;

        this.clock = Math.random() * Settings.blinkDelay;
    }

    update(delta) {
        var deltaTime = delta / 60;

        // Clock
        this.clock = this.clock - deltaTime;
        this.blinkedBefore += deltaTime;
        this.nudgedBefore += deltaTime;

        if (this.clock <= 0) {
            this.blink();
        }

        if (this.light.visible && this.blinkedBefore > Settings.blinkTime) {
            this.light.visible = false;
        }

        // Graphics
        this.graphics.rotation += deltaTime * this.rotationalSpeed;
        if (Math.random() * 60 < 1) { // on average, every second
            this.rotationalSpeed *= randomSign();
        }

        this.graphics.rotation += this.rotationalSpeed * deltaTime;

        let forward = this.graphics.rotation - Math.PI / 2;
        this.graphics.x += this.speed * deltaTime * Math.cos(forward);
        this.graphics.y += this.speed * deltaTime * Math.sin(forward);

        // Wrap around
        let w = this.graphics.width / 2;
        let h = this.graphics.height / 2;

        if (this.graphics.x < -w) {
            this.graphics.x = this.app.renderer.width + w;
        } else if (this.graphics.x > this.app.renderer.width + w) {
            this.graphics.x = -w;
        }

        if (this.graphics.y < -h) {
            this.graphics.y = this.app.renderer.height + h;
        } else if (this.graphics.y > this.app.renderer.height + h) {
            this.graphics.y = -h;
        }
    }

    blink() {
        this.clock = Settings.blinkDelay;
        this.blinkedBefore = 0;
        this.light.visible = true;

        Firefly.notifyBlinkObservers(this);
    }

    nudge() {
        this.clock -= Settings.nudgeAmount;
        this.nudgedBefore = 0;
    }

    static registerBlinkObserver(func) {
        if (!Firefly.staticBlinkObservers.includes(func)) {
            Firefly.staticBlinkObservers.push(func);
        }
    }

    static unregisterBlinkObserver(func) {
        var i = Firefly.staticBlinkObservers.indexOf(func);
        if (i != -1) {
            Firefly.staticBlinkObservers.splice(i, 1);
        }
    }
    static notifyBlinkObservers(firefly) {
        for (const obs of Firefly.staticBlinkObservers) {
            obs(firefly);
        }
    }

}