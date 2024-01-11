"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const now_1 = __importDefault(require("./rendering/now"));
const renderColorImage_1 = require("./rendering/renderColorImage");
const renderGrayscaleImage_1 = require("./rendering/renderGrayscaleImage");
const renderPseudoColorImage_1 = require("./rendering/renderPseudoColorImage");
function default_1(enabledElement, invalidated) {
    const image = enabledElement.image;
    if (!enabledElement.canvas || !enabledElement.image) {
        return;
    }
    const start = (0, now_1.default)();
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
                render = renderPseudoColorImage_1.renderPseudoColorImage;
            }
            else if (image.color) {
                render = renderColorImage_1.renderColorImage;
            }
            else {
                render = renderGrayscaleImage_1.renderGrayscaleImage;
            }
        }
        render(enabledElement, invalidated);
    }
    const renderTimeInMs = (0, now_1.default)() - start;
    image.stats.lastRenderTime = renderTimeInMs;
    enabledElement.invalid = false;
    enabledElement.needsRedraw = false;
}
exports.default = default_1;
//# sourceMappingURL=drawImageSync.js.map