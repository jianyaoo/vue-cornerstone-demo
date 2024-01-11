import { ToolModes } from '../enums';
import getToolsWithModesForElement from '../utilities/getToolsWithModesForElement';
import filterToolsWithAnnotationsForElement from './filterToolsWithAnnotationsForElement';
export default function cancelActiveManipulations(element) {
    const tools = getToolsWithModesForElement(element, [
        ToolModes.Active,
        ToolModes.Passive,
    ]);
    const toolsWithData = filterToolsWithAnnotationsForElement(element, tools);
    for (const { tool } of toolsWithData) {
        const annotationUID = tool.cancel(element);
        if (annotationUID) {
            return annotationUID;
        }
    }
}
//# sourceMappingURL=cancelActiveManipulations.js.map