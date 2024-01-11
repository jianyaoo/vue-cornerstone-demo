"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPseudoColorImage = void 0;
const setToPixelCoordinateSystem_1 = __importDefault(require("./setToPixelCoordinateSystem"));
const now_1 = __importDefault(require("./now"));
const initializeRenderCanvas_1 = __importDefault(require("./initializeRenderCanvas"));
const getLut_1 = __importDefault(require("./getLut"));
const saveLastRendered_1 = __importDefault(require("./saveLastRendered"));
const doesImageNeedToBeRendered_1 = __importDefault(require("./doesImageNeedToBeRendered"));
const storedPixelDataToCanvasImageDataPseudocolorLUT_1 = __importDefault(require("./storedPixelDataToCanvasImageDataPseudocolorLUT"));
const storedPixelDataToCanvasImageDataPseudocolorLUTPET_1 = __importDefault(require("./storedPixelDataToCanvasImageDataPseudocolorLUTPET"));
const colors = __importStar(require("../colors/index"));
const utilities_1 = require("../../../../utilities");
function getRenderCanvas(enabledElement, image, invalidated) {
    if (!enabledElement.renderingTools.renderCanvas) {
        enabledElement.renderingTools.renderCanvas =
            document.createElement('canvas');
    }
    const renderCanvas = enabledElement.renderingTools.renderCanvas;
    let colormap = enabledElement.viewport.colormap || enabledElement.options.colormap;
    if (enabledElement.options && enabledElement.options.colormap) {
        console.warn('enabledElement.options.colormap is deprecated. Use enabledElement.viewport.colormap instead');
    }
    if (colormap && typeof colormap === 'string') {
        colormap = colors.getColormap(colormap);
    }
    if (!colormap) {
        throw new Error('renderPseudoColorImage: colormap not found.');
    }
    const colormapId = colormap.getId();
    if ((0, doesImageNeedToBeRendered_1.default)(enabledElement, image) === false &&
        invalidated !== true &&
        enabledElement.renderingTools.colormapId === colormapId) {
        return renderCanvas;
    }
    if (renderCanvas.width !== image.width ||
        renderCanvas.height !== image.height) {
        (0, initializeRenderCanvas_1.default)(enabledElement, image);
    }
    let start = (0, now_1.default)();
    if (!enabledElement.renderingTools.colorLUT ||
        invalidated ||
        enabledElement.renderingTools.colormapId !== colormapId) {
        colormap.setNumberOfColors(256);
        enabledElement.renderingTools.colorLUT = colormap.createLookupTable();
        enabledElement.renderingTools.colormapId = colormapId;
    }
    const renderCanvasData = enabledElement.renderingTools.renderCanvasData;
    const renderCanvasContext = enabledElement.renderingTools.renderCanvasContext;
    const { viewport } = enabledElement;
    const colorLUT = enabledElement.renderingTools.colorLUT;
    if (viewport.modality === 'PT') {
        const { windowWidth, windowCenter } = viewport.voi;
        const minimum = windowCenter - windowWidth / 2;
        const maximum = windowCenter + windowWidth / 2;
        const range = maximum - minimum;
        const collectedMultiplierTerms = 255.0 / range;
        let petVOILutFunction;
        if (viewport.invert) {
            petVOILutFunction = (value) => {
                return (0, utilities_1.clamp)(Math.floor(255 - (value - minimum) * collectedMultiplierTerms), 0, 255);
            };
        }
        else {
            petVOILutFunction = (value) => {
                return (0, utilities_1.clamp)(Math.floor((value - minimum) * collectedMultiplierTerms), 0, 255);
            };
        }
        (0, storedPixelDataToCanvasImageDataPseudocolorLUTPET_1.default)(image, petVOILutFunction, colorLUT, renderCanvasData.data);
    }
    else {
        const lut = (0, getLut_1.default)(image, enabledElement.viewport, invalidated);
        image.stats = image.stats || {};
        image.stats.lastLutGenerateTime = (0, now_1.default)() - start;
        (0, storedPixelDataToCanvasImageDataPseudocolorLUT_1.default)(image, lut, colorLUT, renderCanvasData.data);
    }
    start = (0, now_1.default)();
    renderCanvasContext.putImageData(renderCanvasData, 0, 0);
    image.stats.lastPutImageDataTime = (0, now_1.default)() - start;
    return renderCanvas;
}
function renderPseudoColorImage(enabledElement, invalidated) {
    if (enabledElement === undefined) {
        throw new Error('drawImage: enabledElement parameter must not be undefined');
    }
    const image = enabledElement.image;
    if (image === undefined) {
        throw new Error('drawImage: image must be loaded before it can be drawn');
    }
    const context = enabledElement.canvas.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = 'black';
    context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);
    context.imageSmoothingEnabled = !enabledElement.viewport.pixelReplication;
    (0, setToPixelCoordinateSystem_1.default)(enabledElement, context);
    const renderCanvas = getRenderCanvas(enabledElement, image, invalidated);
    const sx = enabledElement.viewport.displayedArea.tlhc.x - 1;
    const sy = enabledElement.viewport.displayedArea.tlhc.y - 1;
    const width = enabledElement.viewport.displayedArea.brhc.x - sx;
    const height = enabledElement.viewport.displayedArea.brhc.y - sy;
    context.drawImage(renderCanvas, sx, sy, width, height, 0, 0, width, height);
    enabledElement.renderingTools = (0, saveLastRendered_1.default)(enabledElement);
}
exports.renderPseudoColorImage = renderPseudoColorImage;
//# sourceMappingURL=renderPseudoColorImage.js.map