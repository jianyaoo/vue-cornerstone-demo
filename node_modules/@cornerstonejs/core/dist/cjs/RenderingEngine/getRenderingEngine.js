"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRenderingEngines = exports.getRenderingEngine = void 0;
const renderingEngineCache_1 = __importDefault(require("./renderingEngineCache"));
function getRenderingEngine(id) {
    return renderingEngineCache_1.default.get(id);
}
exports.getRenderingEngine = getRenderingEngine;
function getRenderingEngines() {
    return renderingEngineCache_1.default.getAll();
}
exports.getRenderingEngines = getRenderingEngines;
exports.default = getRenderingEngine;
//# sourceMappingURL=getRenderingEngine.js.map