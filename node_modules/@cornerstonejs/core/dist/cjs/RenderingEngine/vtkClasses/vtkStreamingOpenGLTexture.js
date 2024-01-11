"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const Texture_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Texture"));
const HalfFloat_1 = __importDefault(require("@kitware/vtk.js/Common/Core/HalfFloat"));
const init_1 = require("../../init");
function vtkStreamingOpenGLTexture(publicAPI, model) {
    model.classHierarchy.push('vtkStreamingOpenGLTexture');
    const superCreate3DFilterableFromRaw = publicAPI.create3DFilterableFromRaw;
    publicAPI.create3DFilterableFromRaw = (width, height, depth, numComps, dataType, data, preferSizeOverAccuracy) => {
        model.inputDataType = dataType;
        model.inputNumComps = numComps;
        superCreate3DFilterableFromRaw(width, height, depth, numComps, dataType, data, preferSizeOverAccuracy);
    };
    publicAPI.update3DFromRaw = (data) => {
        const { updatedFrames } = model;
        if (!updatedFrames.length) {
            return;
        }
        model._openGLRenderWindow.activateTexture(publicAPI);
        publicAPI.createTexture();
        publicAPI.bind();
        let bytesPerVoxel;
        let TypedArrayConstructor;
        if (data instanceof Uint8Array) {
            bytesPerVoxel = 1;
            TypedArrayConstructor = Uint8Array;
        }
        else if (data instanceof Int16Array) {
            bytesPerVoxel = 2;
            TypedArrayConstructor = Int16Array;
        }
        else if (data instanceof Uint16Array) {
            bytesPerVoxel = 2;
            TypedArrayConstructor = Uint16Array;
        }
        else if (data instanceof Float32Array) {
            bytesPerVoxel = 4;
            TypedArrayConstructor = Float32Array;
        }
        else {
            throw new Error(`No support for given TypedArray.`);
        }
        for (let i = 0; i < updatedFrames.length; i++) {
            if (updatedFrames[i]) {
                model.fillSubImage3D(data, i, bytesPerVoxel, TypedArrayConstructor);
            }
        }
        model.updatedFrames = [];
        if (model.generateMipmap) {
            model.context.generateMipmap(model.target);
        }
        publicAPI.deactivate();
        return true;
    };
    model.fillSubImage3D = (data, frameIndex, bytesPerVoxel, TypedArrayConstructor) => {
        const buffer = data.buffer;
        const frameLength = model.width * model.height;
        const frameLengthInBytes = frameLength * model.components * bytesPerVoxel;
        const zOffset = frameIndex * frameLengthInBytes;
        const rowLength = model.width * model.components;
        const gl = model.context;
        const MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        let blockHeight = Math.floor((bytesPerVoxel * MAX_TEXTURE_SIZE) / model.width);
        blockHeight = Math.min(blockHeight, model.height);
        const { useNorm16Texture, preferSizeOverAccuracy } = (0, init_1.getConfiguration)().rendering;
        if (useNorm16Texture && !preferSizeOverAccuracy) {
            blockHeight = 1;
        }
        const multiRowBlockLength = rowLength * blockHeight;
        const multiRowBlockLengthInBytes = multiRowBlockLength * bytesPerVoxel;
        const normalBlocks = Math.floor(model.height / blockHeight);
        const lastBlockHeight = model.height % blockHeight;
        const multiRowLastBlockLength = rowLength * lastBlockHeight;
        for (let block = 0; block < normalBlocks; block++) {
            const yOffset = block * blockHeight;
            let dataView = new TypedArrayConstructor(buffer, zOffset + block * multiRowBlockLengthInBytes, multiRowBlockLength);
            if (model.useHalfFloat &&
                (TypedArrayConstructor === Uint16Array ||
                    TypedArrayConstructor === Int16Array)) {
                for (let idx = 0; idx < dataView.length; idx++) {
                    dataView[idx] = HalfFloat_1.default.toHalf(dataView[idx]);
                }
                if (TypedArrayConstructor === Int16Array) {
                    dataView = new Uint16Array(dataView);
                }
            }
            gl.texSubImage3D(model.target, 0, 0, yOffset, frameIndex, model.width, blockHeight, 1, model.format, model.openGLDataType, dataView);
        }
        if (lastBlockHeight !== 0) {
            const yOffset = normalBlocks * blockHeight;
            const dataView = new TypedArrayConstructor(buffer, zOffset + normalBlocks * multiRowBlockLengthInBytes, multiRowLastBlockLength);
            gl.texSubImage3D(model.target, 0, 0, yOffset, frameIndex, model.width, lastBlockHeight, 1, model.format, model.openGLDataType, dataView);
        }
    };
    publicAPI.getTextureParameters = () => {
        return {
            width: model.width,
            height: model.height,
            depth: model.depth,
            numComps: model.inputNumComps,
            dataType: model.inputDataType,
        };
    };
    publicAPI.setUpdatedFrame = (frameIndex) => {
        model.updatedFrames[frameIndex] = true;
    };
}
const DEFAULT_VALUES = {
    updatedFrames: [],
};
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    Texture_1.default.extend(publicAPI, model, initialValues);
    vtkStreamingOpenGLTexture(publicAPI, model);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend, 'vtkStreamingOpenGLTexture');
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLTexture.js.map