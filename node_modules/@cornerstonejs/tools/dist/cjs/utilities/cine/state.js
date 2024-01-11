"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolState = exports.addToolState = void 0;
const core_1 = require("@cornerstonejs/core");
const state = {};
function addToolState(element, data) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { viewportId } = enabledElement;
    state[viewportId] = data;
}
exports.addToolState = addToolState;
function getToolState(element) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { viewportId } = enabledElement;
    return state[viewportId];
}
exports.getToolState = getToolState;
//# sourceMappingURL=state.js.map