"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerAnnotationRenderForViewportIds = void 0;
const triggerAnnotationRender_1 = __importDefault(require("./triggerAnnotationRender"));
function triggerAnnotationRenderForViewportIds(renderingEngine, viewportIdsToRender) {
    if (!viewportIdsToRender.length) {
        return;
    }
    viewportIdsToRender.forEach((viewportId) => {
        const { element } = renderingEngine.getViewport(viewportId);
        (0, triggerAnnotationRender_1.default)(element);
    });
}
exports.triggerAnnotationRenderForViewportIds = triggerAnnotationRenderForViewportIds;
exports.default = triggerAnnotationRenderForViewportIds;
//# sourceMappingURL=triggerAnnotationRenderForViewportIds.js.map