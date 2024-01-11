import { state as csToolsState } from '../index';
import destroyToolGroup from './destroyToolGroup';
function destroy() {
    const toolGroups = [...csToolsState.toolGroups];
    for (const toolGroup of toolGroups) {
        destroyToolGroup(toolGroup.id);
    }
    csToolsState.toolGroups = [];
}
export default destroy;
//# sourceMappingURL=destroy.js.map