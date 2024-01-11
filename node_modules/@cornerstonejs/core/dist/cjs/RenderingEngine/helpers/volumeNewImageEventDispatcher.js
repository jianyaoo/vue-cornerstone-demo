"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetVolumeNewImageState = void 0;
const utilities_1 = require("../../utilities");
const enums_1 = require("../../enums");
const getRenderingEngine_1 = require("../getRenderingEngine");
const BaseVolumeViewport_1 = __importDefault(require("../BaseVolumeViewport"));
const state = {};
function resetVolumeNewImageState(viewportId) {
    if (state[viewportId] !== undefined) {
        delete state[viewportId];
    }
}
exports.resetVolumeNewImageState = resetVolumeNewImageState;
function volumeNewImageEventDispatcher(cameraEvent) {
    const { renderingEngineId, viewportId } = cameraEvent.detail;
    const renderingEngine = (0, getRenderingEngine_1.getRenderingEngine)(renderingEngineId);
    const viewport = renderingEngine.getViewport(viewportId);
    if (!(viewport instanceof BaseVolumeViewport_1.default)) {
        throw new Error(`volumeNewImageEventDispatcher: viewport is not a BaseVolumeViewport`);
    }
    if (state[viewport.id] === undefined) {
        state[viewport.id] = 0;
    }
    const sliceData = (0, utilities_1.getImageSliceDataForVolumeViewport)(viewport);
    if (!sliceData) {
        console.warn(`volumeNewImageEventDispatcher: sliceData is undefined for viewport ${viewport.id}`);
        return;
    }
    const { numberOfSlices, imageIndex } = sliceData;
    if (state[viewport.id] === imageIndex) {
        return;
    }
    state[viewport.id] = imageIndex;
    const eventDetail = {
        imageIndex,
        viewportId,
        renderingEngineId,
        numberOfSlices,
    };
    (0, utilities_1.triggerEvent)(viewport.element, enums_1.Events.VOLUME_NEW_IMAGE, eventDetail);
}
exports.default = volumeNewImageEventDispatcher;
//# sourceMappingURL=volumeNewImageEventDispatcher.js.map