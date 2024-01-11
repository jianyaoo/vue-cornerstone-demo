"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const labelmapConfig_1 = require("../../tools/displayTools/Labelmap/labelmapConfig");
const SegmentationRepresentations_1 = __importDefault(require("../../enums/SegmentationRepresentations"));
function isValidRepresentationConfig(representationType, config) {
    switch (representationType) {
        case SegmentationRepresentations_1.default.Labelmap:
            return (0, labelmapConfig_1.isValidLabelmapConfig)(config);
        default:
            throw new Error(`Unknown representation type: ${representationType}`);
    }
}
exports.default = isValidRepresentationConfig;
//# sourceMappingURL=isValidRepresentationConfig.js.map