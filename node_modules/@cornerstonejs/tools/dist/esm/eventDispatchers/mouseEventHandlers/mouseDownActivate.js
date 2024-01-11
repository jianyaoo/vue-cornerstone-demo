import { state } from '../../store';
import getActiveToolForMouseEvent from '../shared/getActiveToolForMouseEvent';
import { setAnnotationSelected } from '../../stateManagement/annotation/annotationSelection';
export default function mouseDownActivate(evt) {
    if (state.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForMouseEvent(evt);
    if (!activeTool) {
        return;
    }
    if (state.isMultiPartToolActive) {
        return;
    }
    if (activeTool.addNewAnnotation) {
        const annotation = activeTool.addNewAnnotation(evt, 'mouse');
        setAnnotationSelected(annotation.annotationUID);
    }
}
//# sourceMappingURL=mouseDownActivate.js.map