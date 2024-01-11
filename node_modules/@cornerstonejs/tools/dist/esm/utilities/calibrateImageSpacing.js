import { utilities, Enums } from '@cornerstonejs/core';
const { calibratedPixelSpacingMetadataProvider } = utilities;
export default function calibrateImageSpacing(imageId, renderingEngine, calibrationOrScale) {
    if (typeof calibrationOrScale === 'number') {
        calibrationOrScale = {
            type: Enums.CalibrationTypes.USER,
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
//# sourceMappingURL=calibrateImageSpacing.js.map