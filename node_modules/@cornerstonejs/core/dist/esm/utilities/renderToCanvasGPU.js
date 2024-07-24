import getOrCreateCanvas, { EPSILON, } from '../RenderingEngine/helpers/getOrCreateCanvas';
import { ViewportType, Events } from '../enums';
import { getRenderingEngine } from '../RenderingEngine/getRenderingEngine';
import RenderingEngine from '../RenderingEngine';
import isPTPrescaledWithSUV from './isPTPrescaledWithSUV';
export default function renderToCanvasGPU(canvas, imageOrVolume, modality = undefined, renderingEngineId = '_thumbnails', viewportOptions = {
    displayArea: { imageArea: [1, 1] },
}) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('canvas element is required');
    }
    const isVolume = !imageOrVolume.imageId;
    const image = !isVolume && imageOrVolume;
    const volume = isVolume && imageOrVolume;
    const imageIdToPrint = image?.imageId || volume?.volumeId;
    const viewportId = `renderGPUViewport-${imageIdToPrint}`;
    const element = document.createElement('div');
    const devicePixelRatio = window.devicePixelRatio || 1;
    if (!viewportOptions.displayArea) {
        viewportOptions.displayArea = { imageArea: [1, 1] };
    }
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    element.style.width = `${originalWidth / devicePixelRatio + EPSILON}px`;
    element.style.height = `${originalHeight / devicePixelRatio + EPSILON}px`;
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    document.body.appendChild(element);
    const uniqueId = viewportId.split(':').join('-');
    element.setAttribute('viewport-id-for-remove', uniqueId);
    const temporaryCanvas = getOrCreateCanvas(element);
    const renderingEngine = getRenderingEngine(renderingEngineId) ||
        new RenderingEngine(renderingEngineId);
    let viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
        const viewportInput = {
            viewportId,
            type: isVolume ? ViewportType.ORTHOGRAPHIC : ViewportType.STACK,
            element,
            defaultOptions: {
                ...viewportOptions,
                suppressEvents: true,
            },
        };
        renderingEngine.enableElement(viewportInput);
        viewport = renderingEngine.getViewport(viewportId);
    }
    return new Promise((resolve) => {
        let elementRendered = false;
        let { viewReference } = viewportOptions;
        const onImageRendered = (eventDetail) => {
            if (elementRendered) {
                return;
            }
            if (viewReference) {
                const useViewRef = viewReference;
                viewReference = null;
                viewport.setViewReference(useViewRef);
                viewport.render();
                return;
            }
            const context = canvas.getContext('2d');
            context.drawImage(temporaryCanvas, 0, 0, temporaryCanvas.width, temporaryCanvas.height, 0, 0, canvas.width, canvas.height);
            const origin = viewport.canvasToWorld([0, 0]);
            const topRight = viewport.canvasToWorld([
                temporaryCanvas.width / devicePixelRatio,
                0,
            ]);
            const bottomLeft = viewport.canvasToWorld([
                0,
                temporaryCanvas.height / devicePixelRatio,
            ]);
            const thicknessMm = 1;
            elementRendered = true;
            element.removeEventListener(Events.IMAGE_RENDERED, onImageRendered);
            setTimeout(() => {
                renderingEngine.disableElement(viewportId);
                const elements = document.querySelectorAll(`[viewport-id-for-remove="${uniqueId}"]`);
                elements.forEach((element) => {
                    element.remove();
                });
            }, 0);
            resolve({
                origin,
                bottomLeft,
                topRight,
                thicknessMm,
            });
        };
        element.addEventListener(Events.IMAGE_RENDERED, onImageRendered);
        if (isVolume) {
            viewport.setVolumes([volume], false, true);
        }
        else {
            viewport.renderImageObject(imageOrVolume);
        }
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