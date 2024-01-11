import { vtkSharedVolumeMapper } from '../vtkClasses';
import { getConfiguration } from '../../init';
export default function createVolumeMapper(imageData, vtkOpenGLTexture) {
    const volumeMapper = vtkSharedVolumeMapper.newInstance();
    if (getConfiguration().rendering.preferSizeOverAccuracy) {
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
//# sourceMappingURL=createVolumeMapper.js.map