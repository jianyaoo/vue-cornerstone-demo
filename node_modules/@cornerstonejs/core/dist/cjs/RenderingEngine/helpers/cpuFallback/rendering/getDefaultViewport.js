"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createViewport_1 = __importDefault(require("./createViewport"));
const getImageFitScale_1 = __importDefault(require("./getImageFitScale"));
function default_1(canvas, image, modality, colormap) {
    if (canvas === undefined) {
        throw new Error('getDefaultViewport: parameter canvas must not be undefined');
    }
    if (image === undefined) {
        return (0, createViewport_1.default)();
    }
    const scale = (0, getImageFitScale_1.default)(canvas, image, 0).scaleFactor;
    let voi;
    if (modality === 'PT' && image.isPreScaled) {
        voi = {
            windowWidth: 5,
            windowCenter: 2.5,
        };
    }
    else if (image.windowWidth !== undefined &&
        image.windowCenter !== undefined) {
        voi = {
            windowWidth: Array.isArray(image.windowWidth)
                ? image.windowWidth[0]
                : image.windowWidth,
            windowCenter: Array.isArray(image.windowCenter)
                ? image.windowCenter[0]
                : image.windowCenter,
        };
    }
    return {
        scale,
        translation: {
            x: 0,
            y: 0,
        },
        voi,
        invert: image.invert,
        pixelReplication: false,
        rotation: 0,
        hflip: false,
        vflip: false,
        modalityLUT: image.modalityLUT,
        modality,
        voiLUT: image.voiLUT,
        colormap: colormap !== undefined ? colormap : image.colormap,
        displayedArea: {
            tlhc: {
                x: 1,
                y: 1,
            },
            brhc: {
                x: image.columns,
                y: image.rows,
            },
            rowPixelSpacing: image.rowPixelSpacing === undefined ? 1 : image.rowPixelSpacing,
            columnPixelSpacing: image.columnPixelSpacing === undefined ? 1 : image.columnPixelSpacing,
            presentationSizeMode: 'NONE',
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=getDefaultViewport.js.map