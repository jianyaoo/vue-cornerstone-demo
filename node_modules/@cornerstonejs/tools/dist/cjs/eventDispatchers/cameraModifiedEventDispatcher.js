"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const enums_1 = require("../enums");
const getToolsWithModesForMouseEvent_1 = __importDefault(require("./shared/getToolsWithModesForMouseEvent"));
const { Active, Passive, Enabled } = enums_1.ToolModes;
const onCameraModified = function (evt) {
    const enabledTools = (0, getToolsWithModesForMouseEvent_1.default)(evt, [
        Active,
        Passive,
        Enabled,
    ]);
    enabledTools.forEach((tool) => {
        if (tool.onCameraModified) {
            tool.onCameraModified(evt);
        }
    });
};
const enable = function (element) {
    element.addEventListener(core_1.Enums.Events.CAMERA_MODIFIED, onCameraModified);
};
const disable = function (element) {
    element.removeEventListener(core_1.Enums.Events.CAMERA_MODIFIED, onCameraModified);
};
exports.default = {
    enable,
    disable,
};
//# sourceMappingURL=cameraModifiedEventDispatcher.js.map