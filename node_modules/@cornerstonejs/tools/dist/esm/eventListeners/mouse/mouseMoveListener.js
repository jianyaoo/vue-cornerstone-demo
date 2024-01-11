import { getEnabledElement, triggerEvent } from '@cornerstonejs/core';
import Events from '../../enums/Events';
import getMouseEventPoints from './getMouseEventPoints';
const eventName = Events.MOUSE_MOVE;
function mouseMoveListener(evt) {
    const element = evt.currentTarget;
    const enabledElement = getEnabledElement(element);
    const { renderingEngineId, viewportId } = enabledElement;
    const currentPoints = getMouseEventPoints(evt);
    const eventDetail = {
        renderingEngineId,
        viewportId,
        camera: {},
        element,
        currentPoints,
        eventName,
        event: evt,
    };
    const consumed = !triggerEvent(element, eventName, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
}
export default mouseMoveListener;
//# sourceMappingURL=mouseMoveListener.js.map