"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const Synchronizer_1 = __importDefault(require("./Synchronizer"));
function createSynchronizer(synchronizerId, eventName, eventHandler, options) {
    const synchronizerWithSameIdExists = index_1.state.synchronizers.some((sync) => sync.id === synchronizerId);
    if (synchronizerWithSameIdExists) {
        throw new Error(`Synchronizer with id '${synchronizerId}' already exists.`);
    }
    const synchronizer = new Synchronizer_1.default(synchronizerId, eventName, eventHandler, options);
    index_1.state.synchronizers.push(synchronizer);
    return synchronizer;
}
exports.default = createSynchronizer;
//# sourceMappingURL=createSynchronizer.js.map