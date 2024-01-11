"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateTransform_1 = __importDefault(require("./calculateTransform"));
function default_1(enabledElement, context, scale) {
    if (enabledElement === undefined) {
        throw new Error('setToPixelCoordinateSystem: parameter enabledElement must not be undefined');
    }
    if (context === undefined) {
        throw new Error('setToPixelCoordinateSystem: parameter context must not be undefined');
    }
    const transform = (0, calculateTransform_1.default)(enabledElement, scale);
    const m = transform.getMatrix();
    context.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
}
exports.default = default_1;
//# sourceMappingURL=setToPixelCoordinateSystem.js.map