"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SynchronizerManager_1 = require("../../store/SynchronizerManager");
const core_1 = require("@cornerstonejs/core");
const voiSyncCallback_1 = __importDefault(require("../callbacks/voiSyncCallback"));
function createVOISynchronizer(synchronizerName, options = { syncInvertState: true }) {
    const VOISynchronizer = (0, SynchronizerManager_1.createSynchronizer)(synchronizerName, core_1.Enums.Events.VOI_MODIFIED, voiSyncCallback_1.default, options);
    return VOISynchronizer;
}
exports.default = createVOISynchronizer;
//# sourceMappingURL=createVOISynchronizer.js.map