"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getImageFitScale_1 = __importDefault(require("./getImageFitScale"));
function default_1(enabledElement, resetPan = true, resetZoom = true) {
    const { canvas, image, viewport } = enabledElement;
    const scale = (0, getImageFitScale_1.default)(canvas, image, 0).scaleFactor;
    viewport.vflip = false;
    viewport.hflip = false;
    if (resetPan) {
        viewport.translation.x = 0;
        viewport.translation.y = 0;
    }
    if (resetZoom) {
        viewport.displayedArea.tlhc.x = 1;
        viewport.displayedArea.tlhc.y = 1;
        viewport.displayedArea.brhc.x = image.columns;
        viewport.displayedArea.brhc.y = image.rows;
        viewport.scale = scale;
    }
}
exports.default = default_1;
//# sourceMappingURL=resetCamera.js.map