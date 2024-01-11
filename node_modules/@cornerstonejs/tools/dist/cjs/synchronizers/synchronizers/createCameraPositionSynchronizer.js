"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SynchronizerManager_1 = require("../../store/SynchronizerManager");
const core_1 = require("@cornerstonejs/core");
const cameraSyncCallback_1 = __importDefault(require("../callbacks/cameraSyncCallback"));
const { CAMERA_MODIFIED } = core_1.Enums.Events;
function createCameraPositionSynchronizer(synchronizerName) {
    const cameraPositionSynchronizer = (0, SynchronizerManager_1.createSynchronizer)(synchronizerName, CAMERA_MODIFIED, cameraSyncCallback_1.default);
    return cameraPositionSynchronizer;
}
exports.default = createCameraPositionSynchronizer;
//# sourceMappingURL=createCameraPositionSynchronizer.js.map