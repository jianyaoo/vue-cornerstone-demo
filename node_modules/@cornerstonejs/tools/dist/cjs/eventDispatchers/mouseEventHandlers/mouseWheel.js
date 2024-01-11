"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customCallbackHandler_1 = __importDefault(require("../shared/customCallbackHandler"));
const mouseWheel = customCallbackHandler_1.default.bind(null, 'MouseWheel', 'mouseWheelCallback');
exports.default = mouseWheel;
//# sourceMappingURL=mouseWheel.js.map