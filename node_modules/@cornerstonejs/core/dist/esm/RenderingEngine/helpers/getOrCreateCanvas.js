const VIEWPORT_ELEMENT = 'viewport-element';
const CANVAS_CSS_CLASS = 'cornerstone-canvas';
function createCanvas(element) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.classList.add(CANVAS_CSS_CLASS);
    element.appendChild(canvas);
    return canvas;
}
export function createViewportElement(element) {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '100%';
    div.style.height = '100%';
    div.classList.add(VIEWPORT_ELEMENT);
    element.appendChild(div);
    return div;
}
export default function getOrCreateCanvas(element) {
    const canvasSelector = `canvas.${CANVAS_CSS_CLASS}`;
    const viewportElement = `div.${VIEWPORT_ELEMENT}`;
    const internalDiv = element.querySelector(viewportElement) || createViewportElement(element);
    return internalDiv.querySelector(canvasSelector) || createCanvas(internalDiv);
}
//# sourceMappingURL=getOrCreateCanvas.js.map