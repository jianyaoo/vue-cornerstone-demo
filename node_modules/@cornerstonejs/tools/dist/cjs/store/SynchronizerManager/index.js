"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroySynchronizer = exports.getAllSynchronizers = exports.getSynchronizersForViewport = exports.getSynchronizer = exports.destroy = exports.createSynchronizer = void 0;
const createSynchronizer_1 = __importDefault(require("./createSynchronizer"));
exports.createSynchronizer = createSynchronizer_1.default;
const destroy_1 = __importDefault(require("./destroy"));
exports.destroy = destroy_1.default;
const getSynchronizersForViewport_1 = __importDefault(require("./getSynchronizersForViewport"));
exports.getSynchronizersForViewport = getSynchronizersForViewport_1.default;
const getSynchronizer_1 = __importDefault(require("./getSynchronizer"));
exports.getSynchronizer = getSynchronizer_1.default;
const getAllSynchronizers_1 = __importDefault(require("./getAllSynchronizers"));
exports.getAllSynchronizers = getAllSynchronizers_1.default;
const destroySynchronizer_1 = __importDefault(require("./destroySynchronizer"));
exports.destroySynchronizer = destroySynchronizer_1.default;
//# sourceMappingURL=index.js.map