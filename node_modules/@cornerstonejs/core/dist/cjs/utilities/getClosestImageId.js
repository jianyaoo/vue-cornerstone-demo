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
const gl_matrix_1 = require("gl-matrix");
const metaData = __importStar(require("../metaData"));
const getSpacingInNormalDirection_1 = __importDefault(require("./getSpacingInNormalDirection"));
const constants_1 = require("../constants");
function getClosestImageId(imageVolume, worldPos, viewPlaneNormal) {
    if (!imageVolume) {
        return;
    }
    const { direction, imageIds } = imageVolume;
    if (!imageIds || !imageIds.length) {
        return;
    }
    const kVector = direction.slice(6, 9);
    const dotProducts = gl_matrix_1.vec3.dot(kVector, viewPlaneNormal);
    if (Math.abs(dotProducts) < 1 - constants_1.EPSILON) {
        return;
    }
    const spacingInNormalDirection = (0, getSpacingInNormalDirection_1.default)(imageVolume, viewPlaneNormal);
    const halfSpacingInNormalDirection = spacingInNormalDirection / 2;
    let imageIdForTool;
    for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const { imagePositionPatient } = metaData.get('imagePlaneModule', imageId);
        const dir = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.sub(dir, worldPos, imagePositionPatient);
        const dot = gl_matrix_1.vec3.dot(dir, viewPlaneNormal);
        if (Math.abs(dot) < halfSpacingInNormalDirection) {
            imageIdForTool = imageId;
        }
    }
    return imageIdForTool;
}
exports.default = getClosestImageId;
//# sourceMappingURL=getClosestImageId.js.map