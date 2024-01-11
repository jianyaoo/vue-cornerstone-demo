"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const filterViewportsWithFrameOfReferenceUID_1 = __importDefault(require("./filterViewportsWithFrameOfReferenceUID"));
const filterViewportsWithToolEnabled_1 = __importDefault(require("./filterViewportsWithToolEnabled"));
const filterViewportsWithParallelNormals_1 = __importDefault(require("./filterViewportsWithParallelNormals"));
function getViewportIdsWithToolToRender(element, toolName, requireParallelNormals = true) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { renderingEngine, FrameOfReferenceUID } = enabledElement;
    let viewports = renderingEngine.getViewports();
    viewports = (0, filterViewportsWithFrameOfReferenceUID_1.default)(viewports, FrameOfReferenceUID);
    viewports = (0, filterViewportsWithToolEnabled_1.default)(viewports, toolName);
    const viewport = renderingEngine.getViewport(enabledElement.viewportId);
    if (requireParallelNormals) {
        viewports = (0, filterViewportsWithParallelNormals_1.default)(viewports, viewport.getCamera());
    }
    const viewportIds = viewports.map((vp) => vp.id);
    return viewportIds;
}
exports.default = getViewportIdsWithToolToRender;
//# sourceMappingURL=getViewportIdsWithToolToRender.js.map