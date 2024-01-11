import { state } from '../index';
import ToolGroup from './ToolGroup';
function createToolGroup(toolGroupId) {
    const toolGroupWithIdExists = state.toolGroups.some((tg) => tg.id === toolGroupId);
    if (toolGroupWithIdExists) {
        console.warn(`'${toolGroupId}' already exists.`);
        return;
    }
    const toolGroup = new ToolGroup(toolGroupId);
    state.toolGroups.push(toolGroup);
    return toolGroup;
}
export default createToolGroup;
//# sourceMappingURL=createToolGroup.js.map