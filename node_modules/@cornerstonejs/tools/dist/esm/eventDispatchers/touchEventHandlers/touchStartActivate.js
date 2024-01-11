import { state } from '../../store';
import { setAnnotationSelected } from '../../stateManagement/annotation/annotationSelection';
import getActiveToolForTouchEvent from '../shared/getActiveToolForTouchEvent';
export default function touchStartActivate(evt) {
    if (state.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForTouchEvent(evt);
    if (!activeTool) {
        return;
    }
    if (state.isMultiPartToolActive) {
        return;
    }
    if (activeTool.addNewAnnotation) {
        const annotation = activeTool.addNewAnnotation(evt, 'touch');
        setAnnotationSelected(annotation.annotationUID);
    }
}
//# sourceMappingURL=touchStartActivate.js.map