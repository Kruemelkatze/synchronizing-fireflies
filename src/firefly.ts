import * as PIXI from 'pixi.js';
import Assets from './assets';
import { Settings } from './main';
import { PIXIFactory, randomFromRange, randomSign } from './utils';



export default class Firefly {
    static staticBlinkObservers: Array<Function> = [];

    index = 0;

    app: PIXI.Application;
    container: PIXI.Container;
    graphics: PIXI.Container;

    body: PIXI.Sprite;
    light: PIXI.Sprite;

    angle = 0;
    speed = 0;
    rotationalSpeed = 0;

    clock = 1;
    blinkedBefore = 100;
    nudgedBefore = 100;

    get x() { return this.container.x }
    get y() { return this.container.y }

    constructor(app: PIXI.Application, index: number, x: number, y: number) {
        this.app = app;
        this.index = index;

        var container = new PIXI.Container();
        var graphics = new PIXI.Container();

        container.addChild(graphics);

        this.body = PIXIFactory.createSprite(Assets.firefly, true);
        this.body.width = this.body.height = 96;
        graphics.addChild(this.body);

        this.light = PIXIFactory.createSprite(Assets.light, true);
        this.light.width = this.light.height = 96;
        this.light.visible = false;

        graphics.addChildAt(this.light, 0);

        container.x = x;
        container.y = y;
        graphics.width = graphics.height = Settings.fireflySize;

        this.container = container;
        this.graphics = graphics;
        app.stage.addChild(this.container);

        // Setup values
        let r = Math.random(); // Kind of a speed attribute. Faster movement -> faster rotation, I guess?
        this.speed = randomFromRange(Settings.fireflySpeed, r);
        this.rotationalSpeed = randomFromRange(Settings.fireflyRotSpeed, r) * randomSign();
        this.container.rotation = Math.random() * 2 * Math.PI;

        this.clock = Math.random();
    }

    update(delta: number) {
        var deltaTime = delta / 60;

        // Clock
        this.clock = this.clock - deltaTime / Settings.blinkDelay;
        this.blinkedBefore += deltaTime;
        this.nudgedBefore += deltaTime;

        if (this.clock <= 0) {
            this.blink();
        }

        if (this.light.visible && this.blinkedBefore > Settings.blinkTime) {
            this.light.visible = false;
        }

        // Graphics
        this.container.rotation += deltaTime * this.rotationalSpeed;
        if (Math.random() * 60 < 1) { // on average, every second
            this.rotationalSpeed *= randomSign();
        }

        this.container.rotation += this.rotationalSpeed * deltaTime;

        let forward = this.container.rotation - Math.PI / 2;
        this.container.x += this.speed * deltaTime * Math.cos(forward);
        this.container.y += this.speed * deltaTime * Math.sin(forward);

        // Wrap around
        let w = this.container.width / 2;
        let h = this.container.height / 2;

        if (this.container.x < -w) {
            this.container.x = this.app.renderer.width + w;
        } else if (this.container.x > this.app.renderer.width + w) {
            this.container.x = -w;
        }

        if (this.container.y < -h) {
            this.container.y = this.app.renderer.height + h;
        } else if (this.container.y > this.app.renderer.height + h) {
            this.container.y = -h;
        }
    }

    blink() {
        this.clock = 1;
        this.blinkedBefore = 0;
        this.light.visible = true;

        Firefly.notifyBlinkObservers(this);
    }

    nudge(otherClock: number) {
        this.clock -= (1 - this.clock) * Settings.nudgeAmount / Settings.blinkDelay;
        if (this.clock < 0) {
            this.clock = 0;
        }
        this.nudgedBefore = 0;
    }

    static registerBlinkObserver(func: Function) {
        if (!Firefly.staticBlinkObservers.includes(func)) {
            Firefly.staticBlinkObservers.push(func);
        }
    }

    static unregisterBlinkObserver(func: Function) {
        var i = Firefly.staticBlinkObservers.indexOf(func);
        if (i != -1) {
            Firefly.staticBlinkObservers.splice(i, 1);
        }
    }
    static notifyBlinkObservers(firefly: Firefly) {
        for (const obs of Firefly.staticBlinkObservers) {
            obs(firefly);
        }
    }

}