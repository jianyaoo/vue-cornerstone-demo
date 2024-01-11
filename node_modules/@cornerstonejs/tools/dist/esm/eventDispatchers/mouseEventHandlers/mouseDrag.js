import getActiveToolForMouseEvent from '../shared/getActiveToolForMouseEvent';
import { state } from '../../store';
export default function mouseDrag(evt) {
    if (state.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForMouseEvent(evt);
    const noFoundToolOrDoesNotHaveMouseDragCallback = !activeTool || typeof activeTool.mouseDragCallback !== 'function';
    if (noFoundToolOrDoesNotHaveMouseDragCallback) {
        return;
    }
    activeTool.mouseDragCallback(evt);
}
//# sourceMappingURL=mouseDrag.js.map