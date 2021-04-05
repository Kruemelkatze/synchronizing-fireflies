import fireflySprite from "../assets/firefly.png";

const Assets = {
    firefly: "firefly",
}

const AssetUrls = {
    firefly: fireflySprite
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