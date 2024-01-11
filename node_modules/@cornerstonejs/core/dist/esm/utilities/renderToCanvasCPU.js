import getDefaultViewport from '../RenderingEngine/helpers/cpuFallback/rendering/getDefaultViewport';
import calculateTransform from '../RenderingEngine/helpers/cpuFallback/rendering/calculateTransform';
import drawImageSync from '../RenderingEngine/helpers/cpuFallback/drawImageSync';
export default function renderToCanvasCPU(canvas, image, modality, renderingEngineId) {
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
        resolve(image.imageId);
    });
}
//# sourceMappingURL=renderToCanvasCPU.js.map