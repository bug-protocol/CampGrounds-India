const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../public/build/.vite/manifest.json');

let manifestCache = null;

function loadManifest() {
    if (manifestCache) {
        return manifestCache;
    }

    if (!fs.existsSync(manifestPath)) {
        return null;
    }

    manifestCache = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return manifestCache;
}

function getAssetPath(entry, devPath) {
    const manifest = loadManifest();
    if (!manifest || !manifest[entry] || !manifest[entry].file) {
        if (process.env.NODE_ENV !== 'production') {
            return `http://localhost:5173/${devPath}`;
        }
        return null;
    }

    return `/build/${manifest[entry].file}`;
}

module.exports = {
    getAssetPath
};
