"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const labelmapConfig_1 = __importDefault(require("../../tools/displayTools/Labelmap/labelmapConfig"));
const SegmentationRepresentations_1 = __importDefault(require("../../enums/SegmentationRepresentations"));
function getDefaultRepresentationConfig(segmentation) {
    const { type: representationType } = segmentation;
    switch (representationType) {
        case SegmentationRepresentations_1.default.Labelmap:
            return (0, labelmapConfig_1.default)();
        default:
            throw new Error(`Unknown representation type: ${representationType}`);
    }
}
exports.default = getDefaultRepresentationConfig;
//# sourceMappingURL=getDefaultRepresentationConfig.js.map