import { state } from '../index';
import { ToolModes } from '../../enums';
const MODES = [ToolModes.Active, ToolModes.Passive, ToolModes.Enabled];
function getToolGroupsWithToolName(toolName) {
    return state.toolGroups.filter(({ toolOptions }) => {
        const toolGroupToolNames = Object.keys(toolOptions);
        for (let i = 0; i < toolGroupToolNames.length; i++) {
            if (toolName !== toolGroupToolNames[i]) {
                continue;
            }
            if (!toolOptions[toolName]) {
                continue;
            }
            if (MODES.includes(toolOptions[toolName].mode)) {
                return true;
            }
        }
        return false;
    });
}
export default getToolGroupsWithToolName;
//# sourceMappingURL=getToolGroupsWithToolName.js.map