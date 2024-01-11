"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../store");
const core_1 = require("@cornerstonejs/core");
const VIEWPORT_ELEMENT = 'viewport-element';
function getSvgDrawingHelper(element) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { viewportId, renderingEngineId } = enabledElement;
    const canvasHash = `${viewportId}:${renderingEngineId}`;
    const svgLayerElement = _getSvgLayer(element);
    Object.keys(store_1.state.svgNodeCache[canvasHash]).forEach((cacheKey) => {
        store_1.state.svgNodeCache[canvasHash][cacheKey].touched = false;
    });
    return {
        svgLayerElement: svgLayerElement,
        svgNodeCacheForCanvas: store_1.state.svgNodeCache,
        getSvgNode: getSvgNode.bind(this, canvasHash),
        appendNode: appendNode.bind(this, svgLayerElement, canvasHash),
        setNodeTouched: setNodeTouched.bind(this, canvasHash),
        clearUntouched: clearUntouched.bind(this, svgLayerElement, canvasHash),
    };
}
function _getSvgLayer(element) {
    const viewportElement = `.${VIEWPORT_ELEMENT}`;
    const internalDivElement = element.querySelector(viewportElement);
    const svgLayer = internalDivElement.querySelector(':scope > .svg-layer');
    return svgLayer;
}
function getSvgNode(canvasHash, cacheKey) {
    if (!store_1.state.svgNodeCache[canvasHash]) {
        return;
    }
    if (store_1.state.svgNodeCache[canvasHash][cacheKey]) {
        return store_1.state.svgNodeCache[canvasHash][cacheKey].domRef;
    }
}
function appendNode(svgLayerElement, canvasHash, svgNode, cacheKey) {
    if (!store_1.state.svgNodeCache[canvasHash]) {
        return null;
    }
    store_1.state.svgNodeCache[canvasHash][cacheKey] = {
        touched: true,
        domRef: svgNode,
    };
    svgLayerElement.appendChild(svgNode);
}
function setNodeTouched(canvasHash, cacheKey) {
    if (!store_1.state.svgNodeCache[canvasHash]) {
        return;
    }
    if (store_1.state.svgNodeCache[canvasHash][cacheKey]) {
        store_1.state.svgNodeCache[canvasHash][cacheKey].touched = true;
    }
}
function clearUntouched(svgLayerElement, canvasHash) {
    if (!store_1.state.svgNodeCache[canvasHash]) {
        return;
    }
    Object.keys(store_1.state.svgNodeCache[canvasHash]).forEach((cacheKey) => {
        const cacheEntry = store_1.state.svgNodeCache[canvasHash][cacheKey];
        if (!cacheEntry.touched && cacheEntry.domRef) {
            svgLayerElement.removeChild(cacheEntry.domRef);
            delete store_1.state.svgNodeCache[canvasHash][cacheKey];
        }
    });
}
exports.default = getSvgDrawingHelper;
//# sourceMappingURL=getSvgDrawingHelper.js.map