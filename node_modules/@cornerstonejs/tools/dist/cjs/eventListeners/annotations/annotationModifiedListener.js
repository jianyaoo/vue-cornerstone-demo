"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const triggerAnnotationRenderForViewportIds_1 = __importDefault(require("../../utilities/triggerAnnotationRenderForViewportIds"));
function annotationModifiedListener(evt) {
    const { viewportId, renderingEngineId } = evt.detail;
    const renderingEngine = (0, core_1.getRenderingEngine)(renderingEngineId);
    (0, triggerAnnotationRenderForViewportIds_1.default)(renderingEngine, [viewportId]);
}
exports.default = annotationModifiedListener;
//# sourceMappingURL=annotationModifiedListener.js.map