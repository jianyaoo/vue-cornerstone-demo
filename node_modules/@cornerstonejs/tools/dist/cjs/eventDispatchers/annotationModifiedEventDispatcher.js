"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const Events_1 = __importDefault(require("../enums/Events"));
const triggerAnnotationRenderForViewportIds_1 = __importDefault(require("../utilities/triggerAnnotationRenderForViewportIds"));
const onAnnotationModified = function (evt) {
    const { viewportId, renderingEngineId } = evt.detail;
    const renderingEngine = (0, core_1.getRenderingEngine)(renderingEngineId);
    (0, triggerAnnotationRenderForViewportIds_1.default)(renderingEngine, [viewportId]);
};
const enable = function () {
    core_1.eventTarget.addEventListener(Events_1.default.ANNOTATION_MODIFIED, onAnnotationModified);
};
const disable = function () {
    core_1.eventTarget.removeEventListener(Events_1.default.ANNOTATION_MODIFIED, onAnnotationModified);
};
exports.default = {
    enable,
    disable,
};
//# sourceMappingURL=annotationModifiedEventDispatcher.js.map