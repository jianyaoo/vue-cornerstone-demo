import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import isEqual from './isEqual';
import { actorIsA } from './actorCheck';
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
function findMatchingColormap(rgbPoints, actor) {
    const colormapsVTK = vtkColorMaps.rgbPresetNames.map((presetName) => vtkColorMaps.getPresetByName(presetName));
    const colormapsCS3D = getColormapNames().map((colormapName) => getColormap(colormapName));
    const colormaps = colormapsVTK.concat(colormapsCS3D);
    const matchedColormap = colormaps.find((colormap) => {
        const { RGBPoints: presetRGBPoints } = colormap;
        if (presetRGBPoints.length !== rgbPoints.length) {
            return false;
        }
        for (let i = 0; i < presetRGBPoints.length; i += 4) {
            if (!isEqual(presetRGBPoints.slice(i + 1, i + 4), rgbPoints.slice(i + 1, i + 4))) {
                return false;
            }
        }
        return true;
    });
    if (!matchedColormap) {
        return null;
    }
    const opacity = [];
    if (actorIsA(actor, 'vtkVolume')) {
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
export { getColormap, getColormapNames, registerColormap, findMatchingColormap, };
//# sourceMappingURL=colormap.js.map