"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
function createMergedLabelmapForIndex(labelmaps, segmentIndex = 1, volumeId = 'mergedLabelmap') {
    labelmaps.forEach(({ direction, dimensions, origin, spacing }) => {
        if (!core_1.utilities.isEqual(dimensions, labelmaps[0].dimensions) ||
            !core_1.utilities.isEqual(direction, labelmaps[0].direction) ||
            !core_1.utilities.isEqual(spacing, labelmaps[0].spacing) ||
            !core_1.utilities.isEqual(origin, labelmaps[0].origin)) {
            throw new Error('labelmaps must have the same size and shape');
        }
    });
    const labelmap = labelmaps[0];
    const arrayType = labelmap.getScalarData().constructor;
    const outputData = new arrayType(labelmap.getScalarData().length);
    labelmaps.forEach((labelmap) => {
        const scalarData = labelmap.getScalarData();
        for (let i = 0; i < scalarData.length; i++) {
            if (scalarData[i] === segmentIndex) {
                outputData[i] = segmentIndex;
            }
        }
    });
    const options = {
        scalarData: outputData,
        metadata: labelmap.metadata,
        spacing: labelmap.spacing,
        origin: labelmap.origin,
        direction: labelmap.direction,
        dimensions: labelmap.dimensions,
    };
    const preventCache = true;
    const mergedVolume = core_1.volumeLoader.createLocalVolume(options, volumeId, preventCache);
    return mergedVolume;
}
exports.default = createMergedLabelmapForIndex;
//# sourceMappingURL=createMergedLabelmapForIndex.js.map