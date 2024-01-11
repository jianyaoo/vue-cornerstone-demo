"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorbarCanvas = exports.default = void 0;
const core_1 = require("@cornerstonejs/core");
const interpolateVec3_1 = __importDefault(require("../../math/vec3/interpolateVec3"));
const common_1 = require("./common");
const { clamp } = core_1.utilities;
class ColorbarCanvas {
    constructor(props) {
        ColorbarCanvas.validateProps(props);
        const { colormap, size = { width: 20, height: 100 }, imageRange = { lower: 0, upper: 1 }, voiRange = { lower: 0, upper: 1 }, container, showFullPixelValueRange = false, } = props;
        this._colormap = colormap;
        this._imageRange = imageRange;
        this._voiRange = voiRange;
        this._showFullImageRange = showFullPixelValueRange;
        this._canvas = this._createRootElement(size);
        if (container) {
            this.appendTo(container);
        }
    }
    get colormap() {
        return this._colormap;
    }
    set colormap(colormap) {
        this._colormap = colormap;
        this.render();
    }
    get size() {
        const { width, height } = this._canvas;
        return { width, height };
    }
    set size(size) {
        const { _canvas: canvas } = this;
        if (!(0, common_1.isColorbarSizeValid)(size) || (0, common_1.areColorbarSizesEqual)(canvas, size)) {
            return;
        }
        this._setCanvasSize(canvas, size);
        this.render();
    }
    get imageRange() {
        return Object.assign({}, this._imageRange);
    }
    set imageRange(imageRange) {
        if (!(0, common_1.isRangeValid)(imageRange) ||
            (0, common_1.areColorbarRangesEqual)(imageRange, this._imageRange)) {
            return;
        }
        this._imageRange = imageRange;
        this.render();
    }
    get voiRange() {
        return Object.assign({}, this._voiRange);
    }
    set voiRange(voiRange) {
        if (!(0, common_1.isRangeValid)(voiRange) ||
            (0, common_1.areColorbarRangesEqual)(voiRange, this._voiRange)) {
            return;
        }
        this._voiRange = voiRange;
        this.render();
    }
    get showFullImageRange() {
        return this._showFullImageRange;
    }
    set showFullImageRange(showFullImageRange) {
        if (showFullImageRange === this._showFullImageRange) {
            return;
        }
        this._showFullImageRange = showFullImageRange;
        this.render();
    }
    appendTo(container) {
        container.appendChild(this._canvas);
        this.render();
    }
    dispose() {
        const { _canvas: canvas } = this;
        const { parentElement } = canvas;
        parentElement === null || parentElement === void 0 ? void 0 : parentElement.removeChild(canvas);
    }
    static validateProps(props) {
        const { size, imageRange, voiRange } = props;
        if (size && !(0, common_1.isColorbarSizeValid)(size)) {
            throw new Error('Invalid "size"');
        }
        if (imageRange && !(0, common_1.isRangeValid)(imageRange)) {
            throw new Error('Invalid "imageRange"');
        }
        if (voiRange && !(0, common_1.isRangeValid)(voiRange)) {
            throw new Error('Invalid "voiRange"');
        }
    }
    _setCanvasSize(canvas, size) {
        const { width, height } = size;
        canvas.width = width;
        canvas.height = height;
        Object.assign(canvas.style, {
            width: `${width}px`,
            height: `${height}px`,
        });
    }
    _createRootElement(size) {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            pointerEvents: 'none',
            boxSizing: 'border-box',
        });
        this._setCanvasSize(canvas, size);
        return canvas;
    }
    render() {
        if (!this._canvas.isConnected) {
            return;
        }
        const { _colormap: colormap } = this;
        const { RGBPoints: rgbPoints } = colormap;
        const colorsCount = rgbPoints.length / 4;
        const getColorPoint = (index) => {
            const offset = 4 * index;
            if (index < 0 || index >= colorsCount) {
                return;
            }
            return {
                index,
                position: rgbPoints[offset],
                color: [
                    rgbPoints[offset + 1],
                    rgbPoints[offset + 2],
                    rgbPoints[offset + 3],
                ],
            };
        };
        const { width, height } = this._canvas;
        const canvasContext = this._canvas.getContext('2d');
        const isHorizontal = width > height;
        const maxValue = isHorizontal ? width : height;
        const { _voiRange: voiRange } = this;
        const range = this._showFullImageRange ? this._imageRange : Object.assign({}, voiRange);
        const { windowWidth } = core_1.utilities.windowLevel.toWindowLevel(voiRange.lower, voiRange.upper);
        let previousColorPoint = undefined;
        let currentColorPoint = getColorPoint(0);
        const incRawPixelValue = (range.upper - range.lower) / (maxValue - 1);
        let rawPixelValue = range.lower;
        for (let i = 0; i < maxValue; i++) {
            const tVoiRange = (rawPixelValue - voiRange.lower) / windowWidth;
            if (currentColorPoint) {
                for (let i = currentColorPoint.index; i < colorsCount; i++) {
                    if (tVoiRange <= currentColorPoint.position) {
                        break;
                    }
                    previousColorPoint = currentColorPoint;
                    currentColorPoint = getColorPoint(i + 1);
                }
            }
            let normColor;
            if (!previousColorPoint) {
                normColor = [...currentColorPoint.color];
            }
            else if (!currentColorPoint) {
                normColor = [...previousColorPoint.color];
            }
            else {
                const tColorRange = (tVoiRange - previousColorPoint.position) /
                    (currentColorPoint.position - previousColorPoint.position);
                normColor = (0, interpolateVec3_1.default)(previousColorPoint.color, currentColorPoint.color, tColorRange);
            }
            const color = normColor.map((color) => clamp(Math.round(color * 255), 0, 255));
            canvasContext.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            if (isHorizontal) {
                canvasContext.fillRect(i, 0, 1, height);
            }
            else {
                canvasContext.fillRect(0, height - i - 1, width, 1);
            }
            rawPixelValue += incRawPixelValue;
        }
    }
}
exports.default = ColorbarCanvas;
exports.ColorbarCanvas = ColorbarCanvas;
//# sourceMappingURL=ColorbarCanvas.js.map