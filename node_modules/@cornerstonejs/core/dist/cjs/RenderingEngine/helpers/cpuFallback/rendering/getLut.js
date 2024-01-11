"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const computeAutoVoi_1 = __importDefault(require("./computeAutoVoi"));
const lutMatches_1 = __importDefault(require("./lutMatches"));
const generateLut_1 = __importDefault(require("./generateLut"));
function default_1(image, viewport, invalidated) {
    if (image.cachedLut !== undefined &&
        image.cachedLut.windowCenter === viewport.voi.windowCenter &&
        image.cachedLut.windowWidth === viewport.voi.windowWidth &&
        (0, lutMatches_1.default)(image.cachedLut.modalityLUT, viewport.modalityLUT) &&
        (0, lutMatches_1.default)(image.cachedLut.voiLUT, viewport.voiLUT) &&
        image.cachedLut.invert === viewport.invert &&
        invalidated !== true) {
        return image.cachedLut.lutArray;
    }
    (0, computeAutoVoi_1.default)(viewport, image);
    (0, generateLut_1.default)(image, viewport.voi.windowWidth, viewport.voi.windowCenter, viewport.invert, viewport.modalityLUT, viewport.voiLUT);
    image.cachedLut.windowWidth = viewport.voi.windowWidth;
    image.cachedLut.windowCenter = viewport.voi.windowCenter;
    image.cachedLut.invert = viewport.invert;
    image.cachedLut.voiLUT = viewport.voiLUT;
    image.cachedLut.modalityLUT = viewport.modalityLUT;
    return image.cachedLut.lutArray;
}
exports.default = default_1;
//# sourceMappingURL=getLut.js.map