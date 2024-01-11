const _colormaps = new Map();
function registerColormap(colormap) {
    _colormaps.set(colormap.Name, colormap);
}
function getColormap(name) {
    return _colormaps.get(name);
}
function getColormapNames() {
    return Array.from(_colormaps.keys());
}
export { getColormap, getColormapNames, registerColormap };
//# sourceMappingURL=colormap.js.map