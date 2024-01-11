import { getEnabledElement } from '@cornerstonejs/core';
const state = {};
function addToolState(element, data) {
    const enabledElement = getEnabledElement(element);
    const { viewportId } = enabledElement;
    state[viewportId] = data;
}
function getToolState(element) {
    const enabledElement = getEnabledElement(element);
    const { viewportId } = enabledElement;
    return state[viewportId];
}
export { addToolState, getToolState };
//# sourceMappingURL=state.js.map