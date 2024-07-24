"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingColormap = exports.registerColormap = exports.getColormapNames = exports.getColormap = void 0;
const ColorMaps_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps"));
const isEqual_1 = __importDefault(require("./isEqual"));
const actorCheck_1 = require("./actorCheck");
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
function findMatchingColormap(rgbPoints, actor) {
    const colormapsVTK = ColorMaps_1.default.rgbPresetNames.map((presetName) => ColorMaps_1.default.getPresetByName(presetName));
    const colormapsCS3D = getColormapNames().map((colormapName) => getColormap(colormapName));
    const colormaps = colormapsVTK.concat(colormapsCS3D);
    const matchedColormap = colormaps.find((colormap) => {
        const { RGBPoints: presetRGBPoints } = colormap;
        if (presetRGBPoints.length !== rgbPoints.length) {
            return false;
        }
        for (let i = 0; i < presetRGBPoints.length; i += 4) {
            if (!(0, isEqual_1.default)(presetRGBPoints.slice(i + 1, i + 4), rgbPoints.slice(i + 1, i + 4))) {
                return false;
            }
        }
        return true;
    });
    if (!matchedColormap) {
        return null;
    }
    const opacity = [];
    if ((0, actorCheck_1.actorIsA)(actor, 'vtkVolume')) {
        const opacityPoints = actor
            .getProperty()
            .getScalarOpacity(0)
            .getDataPointer();
        if (!opacityPoints) {
            return {
                name: matchedColormap.Name,
            };
        }
        for (let i = 0; i < opacityPoints.length; i += 2) {
            opacity.push({
                value: opacityPoints[i],
                opacity: opacityPoints[i + 1],
            });
        }
    }
    return {
        name: matchedColormap.Name,
        opacity,
    };
}
exports.findMatchingColormap = findMatchingColormap;
//# sourceMappingURL=colormap.js.map