"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getImageFitScale_1 = __importDefault(require("./getImageFitScale"));
function default_1(enabledElement) {
    const { image } = enabledElement;
    enabledElement.viewport.scale = (0, getImageFitScale_1.default)(enabledElement.canvas, image, enabledElement.viewport.rotation).scaleFactor;
    enabledElement.viewport.translation.x = 0;
    enabledElement.viewport.translation.y = 0;
}
exports.default = default_1;
//# sourceMappingURL=fitToWindow.js.map