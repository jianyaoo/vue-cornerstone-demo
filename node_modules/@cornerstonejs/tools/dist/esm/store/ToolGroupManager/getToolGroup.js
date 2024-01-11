import { state } from '../index';
function getToolGroup(toolGroupId) {
    return state.toolGroups.find((s) => s.id === toolGroupId);
}
export default getToolGroup;
//# sourceMappingURL=getToolGroup.js.map