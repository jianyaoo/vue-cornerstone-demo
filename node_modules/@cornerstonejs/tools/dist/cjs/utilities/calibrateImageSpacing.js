"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const { calibratedPixelSpacingMetadataProvider } = core_1.utilities;
function calibrateImageSpacing(imageId, renderingEngine, calibrationOrScale) {
    if (typeof calibrationOrScale === 'number') {
        calibrationOrScale = {
            type: core_1.Enums.CalibrationTypes.USER,
            scale: calibrationOrScale,
        };
    }
    calibratedPixelSpacingMetadataProvider.add(imageId, calibrationOrScale);
    const viewports = renderingEngine.getStackViewports();
    viewports.forEach((viewport) => {
        const imageIds = viewport.getImageIds();
        if (imageIds.includes(imageId)) {
            viewport.calibrateSpacing(imageId);
        }
    });
}
exports.default = calibrateImageSpacing;
//# sourceMappingURL=calibrateImageSpacing.js.map