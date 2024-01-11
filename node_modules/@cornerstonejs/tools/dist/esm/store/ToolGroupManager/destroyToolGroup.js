import { state } from '../index';
import { removeSegmentationsFromToolGroup } from '../../stateManagement/segmentation';
import { segmentationRenderingEngine } from '../../utilities/segmentation/triggerSegmentationRender';
function destroyToolGroup(toolGroupId) {
    const toolGroupIndex = state.toolGroups.findIndex((tg) => tg.id === toolGroupId);
    if (toolGroupIndex > -1) {
        segmentationRenderingEngine.removeToolGroup(toolGroupId);
        removeSegmentationsFromToolGroup(toolGroupId);
        state.toolGroups.splice(toolGroupIndex, 1);
    }
}
export default destroyToolGroup;
//# sourceMappingURL=destroyToolGroup.js.map