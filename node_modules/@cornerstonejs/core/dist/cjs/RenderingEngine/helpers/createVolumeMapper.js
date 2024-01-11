"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vtkClasses_1 = require("../vtkClasses");
const init_1 = require("../../init");
function createVolumeMapper(imageData, vtkOpenGLTexture) {
    const volumeMapper = vtkClasses_1.vtkSharedVolumeMapper.newInstance();
    if ((0, init_1.getConfiguration)().rendering.preferSizeOverAccuracy) {
        volumeMapper.setPreferSizeOverAccuracy(true);
    }
    volumeMapper.setInputData(imageData);
    const spacing = imageData.getSpacing();
    const sampleDistance = (spacing[0] + spacing[1] + spacing[2]) / 6;
    volumeMapper.setMaximumSamplesPerRay(4000);
    volumeMapper.setSampleDistance(sampleDistance);
    volumeMapper.setScalarTexture(vtkOpenGLTexture);
    return volumeMapper;
}
exports.default = createVolumeMapper;
//# sourceMappingURL=createVolumeMapper.js.map