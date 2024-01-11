"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SynchronizerManager_1 = require("../../store/SynchronizerManager");
const core_1 = require("@cornerstonejs/core");
const zoomPanSyncCallback_1 = __importDefault(require("../callbacks/zoomPanSyncCallback"));
const { CAMERA_MODIFIED } = core_1.Enums.Events;
function createZoomPanSynchronizer(synchronizerName) {
    const zoomPanSynchronizer = (0, SynchronizerManager_1.createSynchronizer)(synchronizerName, CAMERA_MODIFIED, zoomPanSyncCallback_1.default);
    return zoomPanSynchronizer;
}
exports.default = createZoomPanSynchronizer;
//# sourceMappingURL=createZoomPanSynchronizer.js.map