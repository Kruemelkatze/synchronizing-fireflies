import fireflySprite from "../assets/firefly.png";
import lightSprite from "../assets/light.png";

const Assets = {
    firefly: "firefly",
    light: "light",
}

const AssetUrls = {
    firefly: fireflySprite,
    light: lightSprite,
}


export function loadAllAssets(app) {
    var loader = app.loader;
    for (let assetName in Assets) {
        loader = loader.add(assetName, AssetUrls[assetName]);
    }
    return loader;
}

export function getResource(app, assetName) {
    return app.loader.resources[assetName];
}

export default Assets;