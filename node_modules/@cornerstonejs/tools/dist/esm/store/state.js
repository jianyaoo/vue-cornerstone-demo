import _cloneDeep from 'lodash.clonedeep';
import svgNodeCache, { resetSvgNodeCache } from './svgNodeCache';
const defaultState = {
    isInteractingWithTool: false,
    isMultiPartToolActive: false,
    tools: {},
    toolGroups: [],
    synchronizers: [],
    svgNodeCache: svgNodeCache,
    enabledElements: [],
    handleRadius: 6,
};
let state = {
    isInteractingWithTool: false,
    isMultiPartToolActive: false,
    tools: {},
    toolGroups: [],
    synchronizers: [],
    svgNodeCache: svgNodeCache,
    enabledElements: [],
    handleRadius: 6,
};
function resetCornerstoneToolsState() {
    resetSvgNodeCache();
    state = _cloneDeep(defaultState);
}
export { resetCornerstoneToolsState, state, state as default, };
//# sourceMappingURL=state.js.map