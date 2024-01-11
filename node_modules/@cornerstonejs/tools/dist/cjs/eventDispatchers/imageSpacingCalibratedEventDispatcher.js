"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const enums_1 = require("../enums");
const getToolsWithModesForMouseEvent_1 = __importDefault(require("./shared/getToolsWithModesForMouseEvent"));
const { Active, Passive, Enabled } = enums_1.ToolModes;
const onImageSpacingCalibrated = function (evt) {
    const enabledTools = (0, getToolsWithModesForMouseEvent_1.default)(evt, [
        Active,
        Passive,
        Enabled,
    ]);
    enabledTools.forEach((tool) => {
        if (tool.onImageSpacingCalibrated) {
            tool.onImageSpacingCalibrated(evt);
        }
    });
};
const enable = function (element) {
    element.addEventListener(core_1.Enums.Events.IMAGE_SPACING_CALIBRATED, onImageSpacingCalibrated);
};
const disable = function (element) {
    element.removeEventListener(core_1.Enums.Events.IMAGE_SPACING_CALIBRATED, onImageSpacingCalibrated);
};
exports.default = {
    enable,
    disable,
};
//# sourceMappingURL=imageSpacingCalibratedEventDispatcher.js.map