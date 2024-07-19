"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewportElement = exports.EPSILON = void 0;
const VIEWPORT_ELEMENT = 'viewport-element';
const CANVAS_CSS_CLASS = 'cornerstone-canvas';
exports.EPSILON = 1e-4;
function createCanvas(element) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.imageRendering = 'pixelated';
    canvas.classList.add(CANVAS_CSS_CLASS);
    element.appendChild(canvas);
    return canvas;
}
function createViewportElement(element) {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.overflow = 'hidden';
    div.classList.add(VIEWPORT_ELEMENT);
    element.appendChild(div);
    return div;
}
exports.createViewportElement = createViewportElement;
function getOrCreateCanvas(element) {
    const canvasSelector = `canvas.${CANVAS_CSS_CLASS}`;
    const viewportElement = `div.${VIEWPORT_ELEMENT}`;
    const internalDiv = element.querySelector(viewportElement) || createViewportElement(element);
    const canvas = (internalDiv.querySelector(canvasSelector) ||
        createCanvas(internalDiv));
    const rect = internalDiv.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = Math.ceil(rect.width * devicePixelRatio);
    const height = Math.ceil(rect.height * devicePixelRatio);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = (width + exports.EPSILON) / devicePixelRatio + 'px';
    canvas.style.height = (height + exports.EPSILON) / devicePixelRatio + 'px';
    return canvas;
}
exports.default = getOrCreateCanvas;
//# sourceMappingURL=getOrCreateCanvas.js.map