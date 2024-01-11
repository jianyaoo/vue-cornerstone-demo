"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTransform_1 = __importDefault(require("./getTransform"));
function default_1(enabledElement, pt) {
    const transform = (0, getTransform_1.default)(enabledElement);
    return transform.transformPoint(pt);
}
exports.default = default_1;
//# sourceMappingURL=pixelToCanvas.js.map