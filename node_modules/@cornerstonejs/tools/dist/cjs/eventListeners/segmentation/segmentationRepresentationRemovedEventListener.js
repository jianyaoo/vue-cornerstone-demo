"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const triggerSegmentationRender_1 = __importDefault(require("../../utilities/segmentation/triggerSegmentationRender"));
const segmentationRepresentationRemovedEventListener = function (evt) {
    const { toolGroupId, segmentationRepresentationUID } = evt.detail;
    (0, triggerSegmentationRender_1.default)(toolGroupId);
};
exports.default = segmentationRepresentationRemovedEventListener;
//# sourceMappingURL=segmentationRepresentationRemovedEventListener.js.map