"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze_1 = __importDefault(require("../utilities/deepFreeze"));
const MPR_CAMERA_VALUES = {
    axial: {
        viewPlaneNormal: [0, 0, -1],
        viewUp: [0, -1, 0],
    },
    sagittal: {
        viewPlaneNormal: [1, 0, 0],
        viewUp: [0, 0, 1],
    },
    coronal: {
        viewPlaneNormal: [0, -1, 0],
        viewUp: [0, 0, 1],
    },
};
const mprCameraValues = (0, deepFreeze_1.default)(MPR_CAMERA_VALUES);
exports.default = mprCameraValues;
//# sourceMappingURL=mprCameraValues.js.map