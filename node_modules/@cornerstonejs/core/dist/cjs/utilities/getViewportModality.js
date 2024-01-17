"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewportModality = exports.default = void 0;
const cache_1 = __importDefault(require("../cache"));
function getViewportModality(viewport, volumeId) {
    var _a, _b;
    if (viewport.modality) {
        return viewport.modality;
    }
    if (viewport.setVolumes) {
        volumeId = volumeId !== null && volumeId !== void 0 ? volumeId : (_a = viewport.getDefaultActor()) === null || _a === void 0 ? void 0 : _a.uid;
        if (!volumeId) {
            return;
        }
        return (_b = cache_1.default.getVolume(volumeId)) === null || _b === void 0 ? void 0 : _b.metadata.Modality;
    }
    throw new Error('Invalid viewport type');
}
exports.default = getViewportModality;
exports.getViewportModality = getViewportModality;
//# sourceMappingURL=getViewportModality.js.map