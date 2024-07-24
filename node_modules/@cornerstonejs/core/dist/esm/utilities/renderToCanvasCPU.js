import getDefaultViewport from '../RenderingEngine/helpers/cpuFallback/rendering/getDefaultViewport';
import calculateTransform from '../RenderingEngine/helpers/cpuFallback/rendering/calculateTransform';
import drawImageSync from '../RenderingEngine/helpers/cpuFallback/drawImageSync';
export default function renderToCanvasCPU(canvas, imageOrVolume, modality, _renderingEngineId, _viewportOptions) {
    const volume = imageOrVolume;
    if (volume.volumeId) {
        throw new Error('Unsupported volume rendering for CPU');
    }
    const image = imageOrVolume;
    const viewport = getDefaultViewport(canvas, image, modality);
    const enabledElement = {
        canvas,
        viewport,
        image,
        renderingTools: {},
    };
    enabledElement.transform = calculateTransform(enabledElement);
    const invalidated = true;
    return new Promise((resolve, reject) => {
        drawImageSync(enabledElement, invalidated);
        resolve(null);
    });
}
//# sourceMappingURL=renderToCanvasCPU.js.map