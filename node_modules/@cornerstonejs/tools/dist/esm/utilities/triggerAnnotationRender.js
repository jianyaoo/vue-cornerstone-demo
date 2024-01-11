import { getEnabledElement, triggerEvent, getRenderingEngine, } from '@cornerstonejs/core';
import { Events, ToolModes } from '../enums';
import { draw as drawSvg } from '../drawingSvg';
import getToolsWithModesForElement from './getToolsWithModesForElement';
const { Active, Passive, Enabled } = ToolModes;
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
        const enabledElement = getEnabledElement(element);
        if (!enabledElement) {
            console.warn('Element has been disabled');
            return;
        }
        const renderingEngine = getRenderingEngine(enabledElement.renderingEngineId);
        if (!renderingEngine) {
            console.warn('rendering Engine has been destroyed');
            return;
        }
        const enabledTools = getToolsWithModesForElement(element, [
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
        drawSvg(element, (svgDrawingHelper) => {
            let anyRendered = false;
            const handleDrawSvg = (tool) => {
                if (tool.renderAnnotation) {
                    const rendered = tool.renderAnnotation(enabledElement, svgDrawingHelper);
                    anyRendered = anyRendered || rendered;
                }
            };
            enabledTools.forEach(handleDrawSvg);
            if (anyRendered) {
                triggerEvent(element, Events.ANNOTATION_RENDERED, { ...eventDetail });
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
function triggerAnnotationRender(element) {
    annotationRenderingEngine.renderViewport(element);
}
export { annotationRenderingEngine, triggerAnnotationRender };
export default triggerAnnotationRender;
//# sourceMappingURL=triggerAnnotationRender.js.map