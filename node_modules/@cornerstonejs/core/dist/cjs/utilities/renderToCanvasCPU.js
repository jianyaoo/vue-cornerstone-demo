"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getDefaultViewport_1 = __importDefault(require("../RenderingEngine/helpers/cpuFallback/rendering/getDefaultViewport"));
const calculateTransform_1 = __importDefault(require("../RenderingEngine/helpers/cpuFallback/rendering/calculateTransform"));
const drawImageSync_1 = __importDefault(require("../RenderingEngine/helpers/cpuFallback/drawImageSync"));
function renderToCanvasCPU(canvas, imageOrVolume, modality, _renderingEngineId, _viewportOptions) {
    const volume = imageOrVolume;
    if (volume.volumeId) {
        throw new Error('Unsupported volume rendering for CPU');
    }
    const image = imageOrVolume;
    const viewport = (0, getDefaultViewport_1.default)(canvas, image, modality);
    const enabledElement = {
        canvas,
        viewport,
        image,
        renderingTools: {},
    };
    enabledElement.transform = (0, calculateTransform_1.default)(enabledElement);
    const invalidated = true;
    return new Promise((resolve, reject) => {
        (0, drawImageSync_1.default)(enabledElement, invalidated);
        resolve(null);
    });
}
exports.default = renderToCanvasCPU;
//# sourceMappingURL=renderToCanvasCPU.js.map