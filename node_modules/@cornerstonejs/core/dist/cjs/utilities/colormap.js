"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerColormap = exports.getColormapNames = exports.getColormap = void 0;
const _colormaps = new Map();
function registerColormap(colormap) {
    _colormaps.set(colormap.Name, colormap);
}
exports.registerColormap = registerColormap;
function getColormap(name) {
    return _colormaps.get(name);
}
exports.getColormap = getColormap;
function getColormapNames() {
    return Array.from(_colormaps.keys());
}
exports.getColormapNames = getColormapNames;
//# sourceMappingURL=colormap.js.map