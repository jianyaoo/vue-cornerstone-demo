"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Volume_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Volume"));
const volumeLoader_1 = require("../../loaders/volumeLoader");
const createVolumeMapper_1 = __importDefault(require("./createVolumeMapper"));
const utilities_1 = require("../../utilities");
const enums_1 = require("../../enums");
const setDefaultVolumeVOI_1 = __importDefault(require("./setDefaultVolumeVOI"));
function createVolumeActor(props, element, viewportId, suppressEvents = false, useNativeDataType = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const { volumeId, callback, blendMode } = props;
        const imageVolume = yield (0, volumeLoader_1.loadVolume)(volumeId);
        if (!imageVolume) {
            throw new Error(`imageVolume with id: ${imageVolume.volumeId} does not exist`);
        }
        const { imageData, vtkOpenGLTexture } = imageVolume;
        const volumeMapper = (0, createVolumeMapper_1.default)(imageData, vtkOpenGLTexture);
        if (blendMode) {
            volumeMapper.setBlendMode(blendMode);
        }
        const volumeActor = Volume_1.default.newInstance();
        volumeActor.setMapper(volumeMapper);
        const numberOfComponents = imageData
            .getPointData()
            .getScalars()
            .getNumberOfComponents();
        if (numberOfComponents === 3) {
            volumeActor.getProperty().setIndependentComponents(false);
        }
        yield (0, setDefaultVolumeVOI_1.default)(volumeActor, imageVolume, useNativeDataType);
        if (callback) {
            callback({ volumeActor, volumeId });
        }
        if (!suppressEvents) {
            triggerVOIModified(element, viewportId, volumeActor, volumeId);
        }
        return volumeActor;
    });
}
function triggerVOIModified(element, viewportId, volumeActor, volumeId) {
    const voiRange = volumeActor
        .getProperty()
        .getRGBTransferFunction(0)
        .getRange();
    const voiModifiedEventDetail = {
        viewportId,
        range: {
            lower: voiRange[0],
            upper: voiRange[1],
        },
        volumeId,
    };
    (0, utilities_1.triggerEvent)(element, enums_1.Events.VOI_MODIFIED, voiModifiedEventDetail);
}
exports.default = createVolumeActor;
//# sourceMappingURL=createVolumeActor.js.map