import * as PIXI from 'pixi.js';
import Assets, { getResource } from './assets';

export default class Firefly {

    graphics = null;

    constructor(app, x, y) {
        var sprite = new PIXI.Sprite(getResource(app, Assets.firefly).texture);
        sprite.x = x;
        sprite.y = y;

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        this.graphics = sprite;
        app.stage.addChild(this.graphics);
    }

    update(delta) {
        this.graphics.rotation += delta / 60 * 2 * 3.14;
    }
}