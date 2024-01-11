"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BELOW_RANGE_COLOR_INDEX = 0;
const ABOVE_RANGE_COLOR_INDEX = 1;
const NAN_COLOR_INDEX = 2;
function HSVToRGB(hue, sat, val) {
    if (hue > 1) {
        throw new Error('HSVToRGB expects hue < 1');
    }
    const rgb = [];
    if (sat === 0) {
        rgb[0] = val;
        rgb[1] = val;
        rgb[2] = val;
        return rgb;
    }
    const hueCase = Math.floor(hue * 6);
    const frac = 6 * hue - hueCase;
    const lx = val * (1 - sat);
    const ly = val * (1 - sat * frac);
    const lz = val * (1 - sat * (1 - frac));
    switch (hueCase) {
        case 0:
        case 6:
            rgb[0] = val;
            rgb[1] = lz;
            rgb[2] = lx;
            break;
        case 1:
            rgb[0] = ly;
            rgb[1] = val;
            rgb[2] = lx;
            break;
        case 2:
            rgb[0] = lx;
            rgb[1] = val;
            rgb[2] = lz;
            break;
        case 3:
            rgb[0] = lx;
            rgb[1] = ly;
            rgb[2] = val;
            break;
        case 4:
            rgb[0] = lz;
            rgb[1] = lx;
            rgb[2] = val;
            break;
        case 5:
            rgb[0] = val;
            rgb[1] = lx;
            rgb[2] = ly;
            break;
    }
    return rgb;
}
function linearIndexLookupMain(v, p) {
    let dIndex;
    if (v < p.Range[0]) {
        dIndex = p.MaxIndex + BELOW_RANGE_COLOR_INDEX + 1.5;
    }
    else if (v > p.Range[1]) {
        dIndex = p.MaxIndex + ABOVE_RANGE_COLOR_INDEX + 1.5;
    }
    else {
        dIndex = (v + p.Shift) * p.Scale;
    }
    return Math.floor(dIndex);
}
class LookupTable {
    constructor() {
        this.NumberOfColors = 256;
        this.Ramp = 'linear';
        this.TableRange = [0, 255];
        this.HueRange = [0, 0.66667];
        this.SaturationRange = [1, 1];
        this.ValueRange = [1, 1];
        this.AlphaRange = [1, 1];
        this.NaNColor = [128, 0, 0, 255];
        this.BelowRangeColor = [0, 0, 0, 255];
        this.UseBelowRangeColor = true;
        this.AboveRangeColor = [255, 255, 255, 255];
        this.UseAboveRangeColor = true;
        this.InputRange = [0, 255];
        this.Table = [];
    }
    setNumberOfTableValues(number) {
        this.NumberOfColors = number;
    }
    setRamp(ramp) {
        this.Ramp = ramp;
    }
    setTableRange(start, end) {
        this.TableRange[0] = start;
        this.TableRange[1] = end;
    }
    setHueRange(start, end) {
        this.HueRange[0] = start;
        this.HueRange[1] = end;
    }
    setSaturationRange(start, end) {
        this.SaturationRange[0] = start;
        this.SaturationRange[1] = end;
    }
    setValueRange(start, end) {
        this.ValueRange[0] = start;
        this.ValueRange[1] = end;
    }
    setRange(start, end) {
        this.InputRange[0] = start;
        this.InputRange[1] = end;
    }
    setAlphaRange(start, end) {
        this.AlphaRange[0] = start;
        this.AlphaRange[1] = end;
    }
    getColor(scalar) {
        return this.mapValue(scalar);
    }
    build(force) {
        if (this.Table.length > 1 && !force) {
            return;
        }
        this.Table = [];
        const maxIndex = this.NumberOfColors - 1;
        let hinc, sinc, vinc, ainc;
        if (maxIndex) {
            hinc = (this.HueRange[1] - this.HueRange[0]) / maxIndex;
            sinc = (this.SaturationRange[1] - this.SaturationRange[0]) / maxIndex;
            vinc = (this.ValueRange[1] - this.ValueRange[0]) / maxIndex;
            ainc = (this.AlphaRange[1] - this.AlphaRange[0]) / maxIndex;
        }
        else {
            hinc = sinc = vinc = ainc = 0.0;
        }
        for (let i = 0; i <= maxIndex; i++) {
            const hue = this.HueRange[0] + i * hinc;
            const sat = this.SaturationRange[0] + i * sinc;
            const val = this.ValueRange[0] + i * vinc;
            const alpha = this.AlphaRange[0] + i * ainc;
            const rgb = HSVToRGB(hue, sat, val);
            const c_rgba = [0, 0, 0, 0];
            switch (this.Ramp) {
                case 'scurve':
                    c_rgba[0] = Math.floor(127.5 * (1.0 + Math.cos((1.0 - rgb[0]) * Math.PI)));
                    c_rgba[1] = Math.floor(127.5 * (1.0 + Math.cos((1.0 - rgb[1]) * Math.PI)));
                    c_rgba[2] = Math.floor(127.5 * (1.0 + Math.cos((1.0 - rgb[2]) * Math.PI)));
                    c_rgba[3] = Math.floor(alpha * 255);
                    break;
                case 'linear':
                    c_rgba[0] = Math.floor(rgb[0] * 255 + 0.5);
                    c_rgba[1] = Math.floor(rgb[1] * 255 + 0.5);
                    c_rgba[2] = Math.floor(rgb[2] * 255 + 0.5);
                    c_rgba[3] = Math.floor(alpha * 255 + 0.5);
                    break;
                case 'sqrt':
                    c_rgba[0] = Math.floor(Math.sqrt(rgb[0]) * 255 + 0.5);
                    c_rgba[1] = Math.floor(Math.sqrt(rgb[1]) * 255 + 0.5);
                    c_rgba[2] = Math.floor(Math.sqrt(rgb[2]) * 255 + 0.5);
                    c_rgba[3] = Math.floor(Math.sqrt(alpha) * 255 + 0.5);
                    break;
                default:
                    throw new Error(`Invalid Ramp value (${this.Ramp})`);
            }
            this.Table.push(c_rgba);
        }
        this.buildSpecialColors();
    }
    buildSpecialColors() {
        const numberOfColors = this.NumberOfColors;
        const belowRangeColorIndex = numberOfColors + BELOW_RANGE_COLOR_INDEX;
        const aboveRangeColorIndex = numberOfColors + ABOVE_RANGE_COLOR_INDEX;
        const nanColorIndex = numberOfColors + NAN_COLOR_INDEX;
        if (this.UseBelowRangeColor || numberOfColors === 0) {
            this.Table[belowRangeColorIndex] = this.BelowRangeColor;
        }
        else {
            this.Table[belowRangeColorIndex] = this.Table[0];
        }
        if (this.UseAboveRangeColor || numberOfColors === 0) {
            this.Table[aboveRangeColorIndex] = this.AboveRangeColor;
        }
        else {
            this.Table[aboveRangeColorIndex] = this.Table[numberOfColors - 1];
        }
        this.Table[nanColorIndex] = this.NaNColor;
    }
    mapValue(v) {
        const index = this.getIndex(v);
        if (index < 0) {
            return this.NaNColor;
        }
        else if (index === 0) {
            if (this.UseBelowRangeColor && v < this.TableRange[0]) {
                return this.BelowRangeColor;
            }
        }
        else if (index === this.NumberOfColors - 1) {
            if (this.UseAboveRangeColor && v > this.TableRange[1]) {
                return this.AboveRangeColor;
            }
        }
        return this.Table[index];
    }
    getIndex(v) {
        const p = {
            Range: [],
            MaxIndex: this.NumberOfColors - 1,
            Shift: -this.TableRange[0],
            Scale: 1,
        };
        if (this.TableRange[1] <= this.TableRange[0]) {
            p.Scale = Number.MAX_VALUE;
        }
        else {
            p.Scale = p.MaxIndex / (this.TableRange[1] - this.TableRange[0]);
        }
        p.Range[0] = this.TableRange[0];
        p.Range[1] = this.TableRange[1];
        if (isNaN(v)) {
            return -1;
        }
        let index = linearIndexLookupMain(v, p);
        if (index === this.NumberOfColors + BELOW_RANGE_COLOR_INDEX) {
            index = 0;
        }
        else if (index === this.NumberOfColors + ABOVE_RANGE_COLOR_INDEX) {
            index = this.NumberOfColors - 1;
        }
        return index;
    }
    setTableValue(index, rgba) {
        if (arguments.length === 5) {
            rgba = Array.prototype.slice.call(arguments, 1);
        }
        if (index < 0) {
            throw new Error(`Can't set the table value for negative index (${index})`);
        }
        if (index >= this.NumberOfColors) {
            new Error(`Index ${index} is greater than the number of colors ${this.NumberOfColors}`);
        }
        this.Table[index] = rgba;
        if (index === 0 || index === this.NumberOfColors - 1) {
            this.buildSpecialColors();
        }
    }
}
exports.default = LookupTable;
//# sourceMappingURL=lookupTable.js.map