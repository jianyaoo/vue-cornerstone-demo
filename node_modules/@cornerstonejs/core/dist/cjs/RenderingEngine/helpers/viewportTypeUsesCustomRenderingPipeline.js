"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const viewportTypeToViewportClass_1 = __importDefault(require("./viewportTypeToViewportClass"));
function viewportTypeUsesCustomRenderingPipeline(viewportType) {
    return viewportTypeToViewportClass_1.default[viewportType].useCustomRenderingPipeline;
}
exports.default = viewportTypeUsesCustomRenderingPipeline;
//# sourceMappingURL=viewportTypeUsesCustomRenderingPipeline.js.map