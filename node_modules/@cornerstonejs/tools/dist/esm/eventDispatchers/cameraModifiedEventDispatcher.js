import { Enums } from '@cornerstonejs/core';
import { ToolModes } from '../enums';
import getToolsWithModesForMouseEvent from './shared/getToolsWithModesForMouseEvent';
const { Active, Passive, Enabled } = ToolModes;
const onCameraModified = function (evt) {
    const enabledTools = getToolsWithModesForMouseEvent(evt, [
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
    element.addEventListener(Enums.Events.CAMERA_MODIFIED, onCameraModified);
};
const disable = function (element) {
    element.removeEventListener(Enums.Events.CAMERA_MODIFIED, onCameraModified);
};
export default {
    enable,
    disable,
};
//# sourceMappingURL=cameraModifiedEventDispatcher.js.map