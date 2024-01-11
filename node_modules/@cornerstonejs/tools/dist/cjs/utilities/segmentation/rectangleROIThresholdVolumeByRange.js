"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const annotation_1 = require("../../stateManagement/annotation");
const tools_1 = require("../../tools");
const thresholdVolumeByRange_1 = __importDefault(require("./thresholdVolumeByRange"));
const getBoundsIJKFromRectangleAnnotations_1 = __importDefault(require("../rectangleROITool/getBoundsIJKFromRectangleAnnotations"));
function rectangleROIThresholdVolumeByRange(annotationUIDs, segmentationVolume, thresholdVolumeInformation, options) {
    const annotations = annotationUIDs.map((annotationUID) => {
        return annotation_1.state.getAnnotation(annotationUID);
    });
    _validateAnnotations(annotations);
    let boundsIJK;
    for (let i = 0; i < thresholdVolumeInformation.length; i++) {
        const volumeSize = thresholdVolumeInformation[i].volume.getScalarData().length;
        if (volumeSize === segmentationVolume.getScalarData().length || i === 0) {
            boundsIJK = (0, getBoundsIJKFromRectangleAnnotations_1.default)(annotations, thresholdVolumeInformation[i].volume, options);
        }
    }
    const outputSegmentationVolume = (0, thresholdVolumeByRange_1.default)(segmentationVolume, thresholdVolumeInformation, Object.assign(Object.assign({}, options), { boundsIJK }));
    return outputSegmentationVolume;
}
function _validateAnnotations(annotations) {
    const validToolNames = [
        tools_1.RectangleROIThresholdTool.toolName,
        tools_1.RectangleROIStartEndThresholdTool.toolName,
    ];
    for (const annotation of annotations) {
        const name = annotation.metadata.toolName;
        if (!validToolNames.includes(name)) {
            throw new Error('rectangleROIThresholdVolumeByRange only supports RectangleROIThreshold and RectangleROIStartEndThreshold annotations');
        }
    }
}
exports.default = rectangleROIThresholdVolumeByRange;
//# sourceMappingURL=rectangleROIThresholdVolumeByRange.js.map