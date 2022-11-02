import * as PIXI from 'pixi.js';

import fireflySprite from "../assets/firefly.png" ;
import lightSprite from "../assets/light.png";

const Assets = {
    firefly: PIXI.Texture.from(fireflySprite),
    light: PIXI.Texture.from(lightSprite),
}

export default Assets;