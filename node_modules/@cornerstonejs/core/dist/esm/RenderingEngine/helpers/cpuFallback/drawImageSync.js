import now from './rendering/now';
import { renderColorImage } from './rendering/renderColorImage';
import { renderGrayscaleImage } from './rendering/renderGrayscaleImage';
import { renderPseudoColorImage } from './rendering/renderPseudoColorImage';
export default function (enabledElement, invalidated) {
    const image = enabledElement.image;
    if (!enabledElement.canvas || !enabledElement.image) {
        return;
    }
    const start = now();
    image.stats = {
        lastGetPixelDataTime: -1.0,
        lastStoredPixelDataToCanvasImageDataTime: -1.0,
        lastPutImageDataTime: -1.0,
        lastRenderTime: -1.0,
        lastLutGenerateTime: -1.0,
    };
    if (image) {
        let render = image.render;
        if (!render) {
            if (enabledElement.viewport.colormap) {
                render = renderPseudoColorImage;
            }
            else if (image.color) {
                render = renderColorImage;
            }
            else {
                render = renderGrayscaleImage;
            }
        }
        render(enabledElement, invalidated);
    }
    const renderTimeInMs = now() - start;
    image.stats.lastRenderTime = renderTimeInMs;
    enabledElement.invalid = false;
    enabledElement.needsRedraw = false;
}
//# sourceMappingURL=drawImageSync.js.map