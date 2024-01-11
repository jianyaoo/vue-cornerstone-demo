import { Enums } from '@cornerstonejs/core';
import { ToolModes } from '../enums';
import getToolsWithModesForMouseEvent from './shared/getToolsWithModesForMouseEvent';
const { Active, Passive, Enabled } = ToolModes;
const onImageSpacingCalibrated = function (evt) {
    const enabledTools = getToolsWithModesForMouseEvent(evt, [
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
    element.addEventListener(Enums.Events.IMAGE_SPACING_CALIBRATED, onImageSpacingCalibrated);
};
const disable = function (element) {
    element.removeEventListener(Enums.Events.IMAGE_SPACING_CALIBRATED, onImageSpacingCalibrated);
};
export default {
    enable,
    disable,
};
//# sourceMappingURL=imageSpacingCalibratedEventDispatcher.js.map