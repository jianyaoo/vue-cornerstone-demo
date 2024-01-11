"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const VolumeMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/VolumeMapper"));
const Constants_1 = require("@kitware/vtk.js/Rendering/OpenGL/Texture/Constants");
const Constants_2 = require("@kitware/vtk.js/Common/Core/DataArray/Constants");
const DataArray_1 = __importDefault(require("@kitware/vtk.js/Common/Core/DataArray"));
const Constants_3 = require("@kitware/vtk.js/Rendering/Core/Property/Constants");
function vtkStreamingOpenGLVolumeMapper(publicAPI, model) {
    model.classHierarchy.push('vtkStreamingOpenGLVolumeMapper');
    publicAPI.buildBufferObjects = (ren, actor) => {
        const image = model.currentInput;
        if (!image) {
            return;
        }
        const scalars = image.getPointData() && image.getPointData().getScalars();
        if (!scalars) {
            return;
        }
        const vprop = actor.getProperty();
        if (!model.jitterTexture.getHandle()) {
            const oTable = new Uint8Array(32 * 32);
            for (let i = 0; i < 32 * 32; ++i) {
                oTable[i] = 255.0 * Math.random();
            }
            model.jitterTexture.setMinificationFilter(Constants_1.Filter.LINEAR);
            model.jitterTexture.setMagnificationFilter(Constants_1.Filter.LINEAR);
            model.jitterTexture.create2DFromRaw(32, 32, 1, Constants_2.VtkDataTypes.UNSIGNED_CHAR, oTable);
        }
        const numComp = scalars.getNumberOfComponents();
        const iComps = vprop.getIndependentComponents();
        const numIComps = iComps ? numComp : 1;
        let toString = `${vprop.getMTime()}`;
        if (model.opacityTextureString !== toString) {
            const oWidth = 1024;
            const oSize = oWidth * 2 * numIComps;
            const ofTable = new Float32Array(oSize);
            const tmpTable = new Float32Array(oWidth);
            for (let c = 0; c < numIComps; ++c) {
                const ofun = vprop.getScalarOpacity(c);
                const opacityFactor = model.renderable.getSampleDistance() /
                    vprop.getScalarOpacityUnitDistance(c);
                const oRange = ofun.getRange();
                ofun.getTable(oRange[0], oRange[1], oWidth, tmpTable, 1);
                for (let i = 0; i < oWidth; ++i) {
                    ofTable[c * oWidth * 2 + i] =
                        1.0 - Math.pow((1.0 - tmpTable[i]), opacityFactor);
                    ofTable[c * oWidth * 2 + i + oWidth] = ofTable[c * oWidth * 2 + i];
                }
            }
            model.opacityTexture.releaseGraphicsResources(model._openGLRenderWindow);
            model.opacityTexture.setMinificationFilter(Constants_1.Filter.LINEAR);
            model.opacityTexture.setMagnificationFilter(Constants_1.Filter.LINEAR);
            if (model._openGLRenderWindow.getWebgl2() ||
                (model.context.getExtension('OES_texture_float') &&
                    model.context.getExtension('OES_texture_float_linear'))) {
                model.opacityTexture.create2DFromRaw(oWidth, 2 * numIComps, 1, Constants_2.VtkDataTypes.FLOAT, ofTable);
            }
            else {
                const oTable = new Uint8Array(oSize);
                for (let i = 0; i < oSize; ++i) {
                    oTable[i] = 255.0 * ofTable[i];
                }
                model.opacityTexture.create2DFromRaw(oWidth, 2 * numIComps, 1, Constants_2.VtkDataTypes.UNSIGNED_CHAR, oTable);
            }
            model.opacityTextureString = toString;
        }
        toString = `${vprop.getMTime()}`;
        if (model.colorTextureString !== toString) {
            const cWidth = 1024;
            const cSize = cWidth * 2 * numIComps * 3;
            const cTable = new Uint8Array(cSize);
            const tmpTable = new Float32Array(cWidth * 3);
            for (let c = 0; c < numIComps; ++c) {
                const cfun = vprop.getRGBTransferFunction(c);
                const cRange = cfun.getRange();
                cfun.getTable(cRange[0], cRange[1], cWidth, tmpTable, 1);
                for (let i = 0; i < cWidth * 3; ++i) {
                    cTable[c * cWidth * 6 + i] = 255.0 * tmpTable[i];
                    cTable[c * cWidth * 6 + i + cWidth * 3] = 255.0 * tmpTable[i];
                }
            }
            model.colorTexture.releaseGraphicsResources(model._openGLRenderWindow);
            model.colorTexture.setMinificationFilter(Constants_1.Filter.LINEAR);
            model.colorTexture.setMagnificationFilter(Constants_1.Filter.LINEAR);
            model.colorTexture.create2DFromRaw(cWidth, 2 * numIComps, 3, Constants_2.VtkDataTypes.UNSIGNED_CHAR, cTable);
            model.colorTextureString = toString;
        }
        publicAPI.updateLabelOutlineThicknessTexture(actor);
        toString = `${image.getMTime()}`;
        if (model.scalarTextureString !== toString) {
            const dims = image.getDimensions();
            const previousTextureParameters = model.scalarTexture.getTextureParameters();
            const dataType = image.getPointData().getScalars().getDataType();
            const data = image.getPointData().getScalars().getData();
            let shouldReset = true;
            if (previousTextureParameters.dataType &&
                previousTextureParameters.dataType === dataType) {
                const previousTextureSize = previousTextureParameters.width *
                    previousTextureParameters.height *
                    previousTextureParameters.depth *
                    previousTextureParameters.numComps;
                if (data.length === previousTextureSize) {
                    shouldReset = false;
                }
            }
            if (shouldReset) {
                model.scalarTexture.setOglNorm16Ext(model.context.getExtension('EXT_texture_norm16'));
                model.scalarTexture.releaseGraphicsResources(model._openGLRenderWindow);
                model.scalarTexture.resetFormatAndType();
                model.scalarTexture.create3DFilterableFromRaw(dims[0], dims[1], dims[2], numComp, scalars.getDataType(), scalars.getData(), model.renderable.getPreferSizeOverAccuracy());
            }
            else {
                model.scalarTexture.deactivate();
                model.scalarTexture.update3DFromRaw(data);
            }
            model.scalarTextureString = toString;
        }
        if (!model.tris.getCABO().getElementCount()) {
            const ptsArray = new Float32Array(12);
            for (let i = 0; i < 4; i++) {
                ptsArray[i * 3] = (i % 2) * 2 - 1.0;
                ptsArray[i * 3 + 1] = i > 1 ? 1.0 : -1.0;
                ptsArray[i * 3 + 2] = -1.0;
            }
            const cellArray = new Uint16Array(8);
            cellArray[0] = 3;
            cellArray[1] = 0;
            cellArray[2] = 1;
            cellArray[3] = 3;
            cellArray[4] = 3;
            cellArray[5] = 0;
            cellArray[6] = 3;
            cellArray[7] = 2;
            const points = DataArray_1.default.newInstance({
                numberOfComponents: 3,
                values: ptsArray,
            });
            points.setName('points');
            const cells = DataArray_1.default.newInstance({
                numberOfComponents: 1,
                values: cellArray,
            });
            model.tris.getCABO().createVBO(cells, 'polys', Constants_3.Representation.SURFACE, {
                points,
                cellOffset: 0,
            });
        }
        model.VBOBuildTime.modified();
    };
    publicAPI.getRenderTargetSize = () => {
        if (model._useSmallViewport) {
            return [model._smallViewportWidth, model._smallViewportHeight];
        }
        const { usize, vsize } = model._openGLRenderer.getTiledSizeAndOrigin();
        return [usize, vsize];
    };
    publicAPI.getRenderTargetOffset = () => {
        const { lowerLeftU, lowerLeftV } = model._openGLRenderer.getTiledSizeAndOrigin();
        return [lowerLeftU, lowerLeftV];
    };
}
const DEFAULT_VALUES = {};
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    VolumeMapper_1.default.extend(publicAPI, model, initialValues);
    model.scalarTexture = initialValues.scalarTexture;
    model.previousState = {};
    vtkStreamingOpenGLVolumeMapper(publicAPI, model);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend, 'vtkStreamingOpenGLVolumeMapper');
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLVolumeMapper.js.map