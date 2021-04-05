import * as PIXI from 'pixi.js';
import Assets, { getResource } from './assets';
import { Settings } from './main';
import { randomFromRange, randomSign } from './utils';

export default class Firefly {

    graphics = null;
    app = null;

    angle = 0;
    speed = 0;
    rotationalSpeed = 0;

    constructor(app, x, y) {
        this.app = app;

        var sprite = new PIXI.Sprite(getResource(app, Assets.firefly).texture);
        sprite.x = x;
        sprite.y = y;

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.width = sprite.height = Settings.fireflySize;

        this.graphics = sprite;
        app.stage.addChild(this.graphics);

        let r = Math.random(); // Kind of a speed attribute. Faster movement -> faster rotation, I guess?
        this.speed = randomFromRange(Settings.fireflySpeed, r);
        this.rotationalSpeed = randomFromRange(Settings.fireflyRotSpeed, r) * randomSign();
        this.graphics.rotation = Math.random() * 2 * Math.PI;
    }

    update(delta) {
        this.graphics.rotation += delta / 60 * this.rotationalSpeed;
        if (Math.random() * 60 < 1) { // on average, every second
            this.rotationalSpeed *= randomSign();
        }

        this.graphics.rotation += this.rotationalSpeed * delta / 60;

        let forward = this.graphics.rotation - Math.PI / 2;
        this.graphics.x += this.speed * delta / 60 * Math.cos(forward);
        this.graphics.y += this.speed * delta / 60 * Math.sin(forward);

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
}