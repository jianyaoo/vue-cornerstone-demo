"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jumpToWorld = exports.jumpToSlice = exports.isViewportPreScaled = void 0;
const isViewportPreScaled_1 = require("./isViewportPreScaled");
Object.defineProperty(exports, "isViewportPreScaled", { enumerable: true, get: function () { return isViewportPreScaled_1.isViewportPreScaled; } });
const jumpToSlice_1 = __importDefault(require("./jumpToSlice"));
exports.jumpToSlice = jumpToSlice_1.default;
const jumpToWorld_1 = __importDefault(require("./jumpToWorld"));
exports.jumpToWorld = jumpToWorld_1.default;
//# sourceMappingURL=index.js.map