import { isColorbarSizeValid, isRangeValid, areColorbarRangesEqual, areColorbarSizesEqual, } from './common';
import { ColorbarRangeTextPosition } from './enums/ColorbarRangeTextPosition';
const DEFAULTS = {
    FONT: '10px Arial',
    COLOR: 'white',
    TICK_SIZE: 5,
    TICK_WIDTH: 1,
    TICK_LABEL_MARGIN: 3,
    MAX_NUM_TICKS: 8,
    TICKS_STEPS: [1, 2.5, 5, 10],
};
class ColorbarTicks {
    constructor(props) {
        ColorbarTicks.validateProps(props);
        const { top = 0, left = 0, size = { width: 20, height: 100 }, imageRange = { lower: 0, upper: 1 }, voiRange = { lower: 0, upper: 1 }, ticks: ticksProps, container, showFullPixelValueRange = false, } = props;
        const { style: ticksStyle, position: rangeTextPosition } = ticksProps ?? {};
        this._imageRange = imageRange;
        this._voiRange = voiRange;
        this._font = ticksStyle?.font ?? DEFAULTS.FONT;
        this._color = ticksStyle?.color ?? DEFAULTS.COLOR;
        this._tickSize = ticksStyle?.tickSize ?? DEFAULTS.TICK_SIZE;
        this._tickWidth = ticksStyle?.tickWidth ?? DEFAULTS.TICK_WIDTH;
        this._labelMargin = ticksStyle?.labelMargin ?? DEFAULTS.TICK_LABEL_MARGIN;
        this._maxNumTicks = ticksStyle?.maxNumTicks ?? DEFAULTS.MAX_NUM_TICKS;
        this._rangeTextPosition =
            rangeTextPosition ?? ColorbarRangeTextPosition.Right;
        this._showFullPixelValueRange = showFullPixelValueRange;
        this._canvas = this._createCanvasElement(size, top, left);
        if (container) {
            this.appendTo(container);
        }
    }
    get size() {
        const { width, height } = this._canvas;
        return { width, height };
    }
    set size(size) {
        const { _canvas: canvas } = this;
        if (!isColorbarSizeValid(size) || areColorbarSizesEqual(canvas, size)) {
            return;
        }
        this._setCanvasSize(canvas, size);
        this.render();
    }
    get top() {
        return Number.parseInt(this._canvas.style.top);
    }
    set top(top) {
        const { _canvas: canvas } = this;
        const currentTop = this.top;
        if (top === currentTop) {
            return;
        }
        canvas.style.top = `${top}px`;
        this.render();
    }
    get left() {
        return Number.parseInt(this._canvas.style.left);
    }
    set left(left) {
        const { _canvas: canvas } = this;
        const currentLeft = this.left;
        if (left === currentLeft) {
            return;
        }
        canvas.style.left = `${left}px`;
        this.render();
    }
    get imageRange() {
        return { ...this._imageRange };
    }
    set imageRange(imageRange) {
        if (!isRangeValid(imageRange) ||
            areColorbarRangesEqual(imageRange, this._imageRange)) {
            return;
        }
        this._imageRange = imageRange;
        this.render();
    }
    get voiRange() {
        return { ...this._voiRange };
    }
    set voiRange(voiRange) {
        if (!isRangeValid(voiRange) ||
            areColorbarRangesEqual(voiRange, this._voiRange)) {
            return;
        }
        this._voiRange = voiRange;
        this.render();
    }
    get tickSize() {
        return this._tickSize;
    }
    set tickSize(tickSize) {
        if (tickSize === this._tickSize) {
            return;
        }
        this._tickSize = tickSize;
        this.render();
    }
    get tickWidth() {
        return this._tickWidth;
    }
    set tickWidth(tickWidth) {
        if (tickWidth === this._tickWidth) {
            return;
        }
        this._tickWidth = tickWidth;
        this.render();
    }
    get color() {
        return this._color;
    }
    set color(color) {
        if (color === this._color) {
            return;
        }
        this._color = color;
        this.render();
    }
    get showFullPixelValueRange() {
        return this._showFullPixelValueRange;
    }
    set showFullPixelValueRange(showFullRange) {
        if (showFullRange === this._showFullPixelValueRange) {
            return;
        }
        this._showFullPixelValueRange = showFullRange;
        this.render();
    }
    get visible() {
        return this._canvas.style.display === 'block';
    }
    set visible(visible) {
        if (visible === this.visible) {
            return;
        }
        this._canvas.style.display = visible ? 'block' : 'none';
        if (visible) {
            this.render();
        }
    }
    appendTo(container) {
        container.appendChild(this._canvas);
        this.render();
    }
    static validateProps(props) {
        const { size, imageRange, voiRange } = props;
        if (size && !isColorbarSizeValid(size)) {
            throw new Error('Invalid "size"');
        }
        if (imageRange && !isRangeValid(imageRange)) {
            throw new Error('Invalid "imageRange"');
        }
        if (voiRange && !isRangeValid(voiRange)) {
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
    _createCanvasElement(size, top, left) {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            display: 'none',
            position: 'absolute',
            boxSizing: 'border-box',
            top: `${top}px`,
            left: `${left}px`,
        });
        this._setCanvasSize(canvas, size);
        return canvas;
    }
    _getTicks(range) {
        const { lower, upper } = range;
        const rangeValue = upper - lower;
        const roughStep = rangeValue / (this._maxNumTicks - 1);
        const stepPower = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
        const roughtStepNormalized = roughStep * stepPower;
        const normalizedStep = DEFAULTS.TICKS_STEPS.find((n) => n >= roughtStepNormalized);
        const step = normalizedStep / stepPower;
        const scaleMax = Math.ceil(upper / step) * step;
        const scaleMin = Math.floor(lower / step) * step;
        const ticksCount = Math.round((scaleMax - scaleMin) / step) + 1;
        const ticks = [];
        for (let i = 0; i < ticksCount; i++) {
            ticks.push(scaleMin + i * step);
        }
        return { scaleMin, scaleMax, step, ticks };
    }
    _getLeftTickInfo({ position, labelMeasure }) {
        const { width } = this._canvas;
        const labelX = width - this.tickSize - labelMeasure.width - this._labelMargin;
        const labelPoint = [labelX, position];
        const tickPoints = {
            start: [width - this._tickSize, position],
            end: [width, position],
        };
        return { labelPoint, tickPoints };
    }
    _getRightTickInfo({ position }) {
        const labelPoint = [this._tickSize + this._labelMargin, position];
        const tickPoints = {
            start: [0, position],
            end: [this._tickSize, position],
        };
        return { labelPoint, tickPoints };
    }
    _getTopTickInfo({ position, labelMeasure }) {
        throw new Error('Not implemented');
    }
    _getBottomTickInfo({ position, labelMeasure }) {
        throw new Error('Not implemented');
    }
    render() {
        const { _canvas: canvas } = this;
        if (!canvas.isConnected || !this.visible) {
            return;
        }
        const { width, height } = canvas;
        const isHorizontal = width >= height;
        const maxCanvasPixelValue = isHorizontal ? width : height;
        const canvasContext = canvas.getContext('2d');
        const { _voiRange: voiRange } = this;
        const range = this._showFullPixelValueRange
            ? this._imageRange
            : { ...voiRange };
        const rangeWidth = range.upper - range.lower;
        const { ticks } = this._getTicks(range);
        canvasContext.clearRect(0, 0, width, height);
        canvasContext.font = this._font;
        canvasContext.textBaseline = 'middle';
        canvasContext.fillStyle = this._color;
        canvasContext.strokeStyle = this._color;
        canvasContext.lineWidth = this.tickWidth;
        ticks.forEach((tick) => {
            let position = Math.round(maxCanvasPixelValue * ((tick - range.lower) / rangeWidth));
            if (!isHorizontal) {
                position = height - position;
            }
            if (position < 0 || position > maxCanvasPixelValue) {
                return;
            }
            const label = tick.toString();
            const labelMeasure = canvasContext.measureText(label);
            let tickInfo;
            if (isHorizontal) {
                if (this._rangeTextPosition === ColorbarRangeTextPosition.Top) {
                    tickInfo = this._getTopTickInfo({ position, labelMeasure });
                }
                else {
                    tickInfo = this._getBottomTickInfo({ position, labelMeasure });
                }
            }
            else {
                if (this._rangeTextPosition === ColorbarRangeTextPosition.Left) {
                    tickInfo = this._getLeftTickInfo({ position, labelMeasure });
                }
                else {
                    tickInfo = this._getRightTickInfo({ position });
                }
            }
            const { labelPoint, tickPoints } = tickInfo;
            const { start: tickStart, end: tickEnd } = tickPoints;
            canvasContext.beginPath();
            canvasContext.moveTo(tickStart[0], tickStart[1]);
            canvasContext.lineTo(tickEnd[0], tickEnd[1]);
            canvasContext.fillText(label, labelPoint[0], labelPoint[1]);
            canvasContext.stroke();
            return position;
        });
    }
}
export { ColorbarTicks as default, ColorbarTicks };
//# sourceMappingURL=ColorbarTicks.js.map