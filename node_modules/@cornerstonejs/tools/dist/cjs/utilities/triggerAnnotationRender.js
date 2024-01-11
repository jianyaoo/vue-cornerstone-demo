"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerAnnotationRender = exports.annotationRenderingEngine = void 0;
const core_1 = require("@cornerstonejs/core");
const enums_1 = require("../enums");
const drawingSvg_1 = require("../drawingSvg");
const getToolsWithModesForElement_1 = __importDefault(require("./getToolsWithModesForElement"));
const { Active, Passive, Enabled } = enums_1.ToolModes;
class AnnotationRenderingEngine {
    constructor() {
        this._needsRender = new Set();
        this._animationFrameSet = false;
        this._animationFrameHandle = null;
        this._renderFlaggedViewports = () => {
            this._throwIfDestroyed();
            const elements = Array.from(this._viewportElements.values());
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (this._needsRender.has(element)) {
                    this._triggerRender(element);
                    this._needsRender.delete(element);
                    if (this._needsRender.size === 0) {
                        this._animationFrameSet = false;
                        this._animationFrameHandle = null;
                        return;
                    }
                }
            }
        };
        this._viewportElements = new Map();
    }
    addViewportElement(viewportId, element) {
        this._viewportElements.set(viewportId, element);
    }
    removeViewportElement(viewportId, element) {
        this._viewportElements.delete(viewportId);
        this._needsRender.delete(element);
        this._reset();
    }
    renderViewport(element) {
        this._setViewportsToBeRenderedNextFrame([element]);
    }
    _throwIfDestroyed() {
        if (this.hasBeenDestroyed) {
            throw new Error('this.destroy() has been manually called to free up memory, can not longer use this instance. Instead make a new one.');
        }
    }
    _setAllViewportsToBeRenderedNextFrame() {
        const elements = [...this._viewportElements.values()];
        elements.forEach((element) => {
            this._needsRender.add(element);
        });
        this._renderFlaggedViewports();
    }
    _setViewportsToBeRenderedNextFrame(elements) {
        const elementsEnabled = [...this._viewportElements.values()];
        elements.forEach((element) => {
            if (elementsEnabled.indexOf(element) !== -1) {
                this._needsRender.add(element);
            }
        });
        this._render();
    }
    _render() {
        if (this._needsRender.size > 0 && this._animationFrameSet === false) {
            this._animationFrameHandle = window.requestAnimationFrame(this._renderFlaggedViewports);
            this._animationFrameSet = true;
        }
    }
    _triggerRender(element) {
        const enabledElement = (0, core_1.getEnabledElement)(element);
        if (!enabledElement) {
            console.warn('Element has been disabled');
            return;
        }
        const renderingEngine = (0, core_1.getRenderingEngine)(enabledElement.renderingEngineId);
        if (!renderingEngine) {
            console.warn('rendering Engine has been destroyed');
            return;
        }
        const enabledTools = (0, getToolsWithModesForElement_1.default)(element, [
            Active,
            Passive,
            Enabled,
        ]);
        const { renderingEngineId, viewportId } = enabledElement;
        const eventDetail = {
            element,
            renderingEngineId,
            viewportId,
        };
        (0, drawingSvg_1.draw)(element, (svgDrawingHelper) => {
            let anyRendered = false;
            const handleDrawSvg = (tool) => {
                if (tool.renderAnnotation) {
                    const rendered = tool.renderAnnotation(enabledElement, svgDrawingHelper);
                    anyRendered = anyRendered || rendered;
                }
            };
            enabledTools.forEach(handleDrawSvg);
            if (anyRendered) {
                (0, core_1.triggerEvent)(element, enums_1.Events.ANNOTATION_RENDERED, Object.assign({}, eventDetail));
            }
        });
    }
    _reset() {
        window.cancelAnimationFrame(this._animationFrameHandle);
        this._needsRender.clear();
        this._animationFrameSet = false;
        this._animationFrameHandle = null;
        this._setAllViewportsToBeRenderedNextFrame();
    }
}
const annotationRenderingEngine = new AnnotationRenderingEngine();
exports.annotationRenderingEngine = annotationRenderingEngine;
function triggerAnnotationRender(element) {
    annotationRenderingEngine.renderViewport(element);
}
exports.triggerAnnotationRender = triggerAnnotationRender;
exports.default = triggerAnnotationRender;
//# sourceMappingURL=triggerAnnotationRender.js.map