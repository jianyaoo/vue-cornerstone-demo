import getOrCreateCanvas from '../RenderingEngine/helpers/getOrCreateCanvas';
import { ViewportType, Events } from '../enums';
import { getRenderingEngine } from '../RenderingEngine/getRenderingEngine';
import RenderingEngine from '../RenderingEngine';
import isPTPrescaledWithSUV from './isPTPrescaledWithSUV';
export default function renderToCanvasGPU(canvas, image, modality = undefined, renderingEngineId = '_thumbnails') {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('canvas element is required');
    }
    const imageIdToPrint = image.imageId;
    const viewportId = `renderGPUViewport-${imageIdToPrint}`;
    const imageId = image.imageId;
    const element = document.createElement('div');
    element.style.width = `${canvas.width}px`;
    element.style.height = `${canvas.height}px`;
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    const devicePixelRatio = window.devicePixelRatio || 1;
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    canvas.width = originalWidth * devicePixelRatio;
    canvas.height = originalHeight * devicePixelRatio;
    canvas.style.width = `${originalWidth}px`;
    canvas.style.height = `${originalHeight}px`;
    document.body.appendChild(element);
    const uniqueId = viewportId.split(':').join('-');
    element.setAttribute('viewport-id-for-remove', uniqueId);
    const renderingEngine = getRenderingEngine(renderingEngineId) ||
        new RenderingEngine(renderingEngineId);
    let viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
        const stackViewportInput = {
            viewportId,
            type: ViewportType.STACK,
            element,
            defaultOptions: {
                suppressEvents: true,
            },
        };
        renderingEngine.enableElement(stackViewportInput);
        viewport = renderingEngine.getViewport(viewportId);
    }
    return new Promise((resolve) => {
        let elementRendered = false;
        const onImageRendered = (eventDetail) => {
            if (elementRendered) {
                return;
            }
            const temporaryCanvas = getOrCreateCanvas(element);
            const context = canvas.getContext('2d');
            context.drawImage(temporaryCanvas, 0, 0, temporaryCanvas.width, temporaryCanvas.height, 0, 0, canvas.width, canvas.height);
            elementRendered = true;
            element.removeEventListener(Events.IMAGE_RENDERED, onImageRendered);
            setTimeout(() => {
                renderingEngine.disableElement(viewportId);
                const elements = document.querySelectorAll(`[viewport-id-for-remove="${uniqueId}"]`);
                elements.forEach((element) => {
                    element.remove();
                });
            }, 0);
            resolve(imageId);
        };
        element.addEventListener(Events.IMAGE_RENDERED, onImageRendered);
        viewport.renderImageObject(image);
        viewport.resetCamera();
        if (modality === 'PT' && !isPTPrescaledWithSUV(image)) {
            viewport.setProperties({
                voiRange: {
                    lower: image.minPixelValue,
                    upper: image.maxPixelValue,
                },
            });
        }
        viewport.render();
    });
}
//# sourceMappingURL=renderToCanvasGPU.js.map