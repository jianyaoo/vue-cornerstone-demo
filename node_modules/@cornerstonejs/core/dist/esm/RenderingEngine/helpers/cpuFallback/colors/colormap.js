import LookupTable from './lookupTable';
import CPU_COLORMAPS from '../../../../constants/cpuColormaps';
const COLOR_TRANSPARENT = [0, 0, 0, 0];
function linspace(a, b, n) {
    n = n === null ? 100 : n;
    const increment = (b - a) / (n - 1);
    const vector = [];
    while (n-- > 0) {
        vector.push(a);
        a += increment;
    }
    vector[vector.length - 1] = b;
    return vector;
}
function getRank(array, elem) {
    let left = 0;
    let right = array.length - 1;
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const midElem = array[mid];
        if (midElem === elem) {
            return mid;
        }
        else if (elem < midElem) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }
    return left;
}
function searchSorted(inputArray, values) {
    let i;
    const indexes = [];
    const len = values.length;
    inputArray.sort(function (a, b) {
        return a - b;
    });
    for (i = 0; i < len; i++) {
        indexes[i] = getRank(inputArray, values[i]);
    }
    return indexes;
}
function makeMappingArray(N, data, gamma) {
    let i;
    const x = [];
    const y0 = [];
    const y1 = [];
    const lut = [];
    gamma = gamma === null ? 1 : gamma;
    for (i = 0; i < data.length; i++) {
        const element = data[i];
        x.push((N - 1) * element[0]);
        y0.push(element[1]);
        y1.push(element[1]);
    }
    const xLinSpace = linspace(0, 1, N);
    for (i = 0; i < N; i++) {
        xLinSpace[i] = (N - 1) * Math.pow(xLinSpace[i], gamma);
    }
    const xLinSpaceIndexes = searchSorted(x, xLinSpace);
    for (i = 1; i < N - 1; i++) {
        const index = xLinSpaceIndexes[i];
        const colorPercent = (xLinSpace[i] - x[index - 1]) / (x[index] - x[index - 1]);
        const colorDelta = y0[index] - y1[index - 1];
        lut[i] = colorPercent * colorDelta + y1[index - 1];
    }
    lut[0] = y1[0];
    lut[N - 1] = y0[data.length - 1];
    return lut;
}
function createLinearSegmentedColormap(segmentedData, N, gamma) {
    let i;
    const lut = [];
    N = N === null ? 256 : N;
    gamma = gamma === null ? 1 : gamma;
    const redLut = makeMappingArray(N, segmentedData.red, gamma);
    const greenLut = makeMappingArray(N, segmentedData.green, gamma);
    const blueLut = makeMappingArray(N, segmentedData.blue, gamma);
    for (i = 0; i < N; i++) {
        const red = Math.round(redLut[i] * 255);
        const green = Math.round(greenLut[i] * 255);
        const blue = Math.round(blueLut[i] * 255);
        const rgba = [red, green, blue, 255];
        lut.push(rgba);
    }
    return lut;
}
export function getColormapsList() {
    const colormaps = [];
    const keys = Object.keys(CPU_COLORMAPS);
    keys.forEach(function (key) {
        if (CPU_COLORMAPS.hasOwnProperty(key)) {
            const colormap = CPU_COLORMAPS[key];
            colormaps.push({
                id: key,
                name: colormap.name,
            });
        }
    });
    colormaps.sort(function (a, b) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName === bName) {
            return 0;
        }
        return aName < bName ? -1 : 1;
    });
    return colormaps;
}
export function getColormap(id, colormapData) {
    let colormap = CPU_COLORMAPS[id];
    if (!colormap) {
        colormap = CPU_COLORMAPS[id] = colormapData || {
            name: '',
            colors: [],
        };
    }
    if (!colormap.colors && colormap.segmentedData) {
        colormap.colors = createLinearSegmentedColormap(colormap.segmentedData, colormap.numColors, colormap.gamma);
    }
    const cpuFallbackColormap = {
        getId() {
            return id;
        },
        getColorSchemeName() {
            return colormap.name;
        },
        setColorSchemeName(name) {
            colormap.name = name;
        },
        getNumberOfColors() {
            return colormap.colors.length;
        },
        setNumberOfColors(numColors) {
            while (colormap.colors.length < numColors) {
                colormap.colors.push(COLOR_TRANSPARENT);
            }
            colormap.colors.length = numColors;
        },
        getColor(index) {
            if (this.isValidIndex(index)) {
                return colormap.colors[index];
            }
            return COLOR_TRANSPARENT;
        },
        getColorRepeating(index) {
            const numColors = colormap.colors.length;
            index = numColors ? index % numColors : 0;
            return this.getColor(index);
        },
        setColor(index, rgba) {
            if (this.isValidIndex(index)) {
                colormap.colors[index] = rgba;
            }
        },
        addColor(rgba) {
            colormap.colors.push(rgba);
        },
        insertColor(index, rgba) {
            if (this.isValidIndex(index)) {
                colormap.colors.splice(index, 1, rgba);
            }
        },
        removeColor(index) {
            if (this.isValidIndex(index)) {
                colormap.colors.splice(index, 1);
            }
        },
        clearColors() {
            colormap.colors = [];
        },
        buildLookupTable(lut) {
            if (!lut) {
                return;
            }
            const numColors = colormap.colors.length;
            lut.setNumberOfTableValues(numColors);
            for (let i = 0; i < numColors; i++) {
                lut.setTableValue(i, colormap.colors[i]);
            }
        },
        createLookupTable() {
            const lut = new LookupTable();
            this.buildLookupTable(lut);
            return lut;
        },
        isValidIndex(index) {
            return index >= 0 && index < colormap.colors.length;
        },
    };
    return cpuFallbackColormap;
}
//# sourceMappingURL=colormap.js.map