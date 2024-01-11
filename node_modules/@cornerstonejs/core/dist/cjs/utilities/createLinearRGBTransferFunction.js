"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColorTransferFunction_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/ColorTransferFunction"));
function createLinearRGBTransferFunction(voiRange) {
    const cfun = ColorTransferFunction_1.default.newInstance();
    let lower = 0;
    let upper = 1024;
    if (voiRange &&
        voiRange.lower !== undefined &&
        voiRange.upper !== undefined) {
        lower = voiRange.lower;
        upper = voiRange.upper;
    }
    cfun.addRGBPoint(lower, 0.0, 0.0, 0.0);
    cfun.addRGBPoint(upper, 1.0, 1.0, 1.0);
    return cfun;
}
exports.default = createLinearRGBTransferFunction;
//# sourceMappingURL=createLinearRGBTransferFunction.js.map