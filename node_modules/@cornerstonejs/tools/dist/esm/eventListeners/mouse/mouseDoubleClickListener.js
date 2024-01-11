import { getEnabledElement, triggerEvent } from '@cornerstonejs/core';
import Events from '../../enums/Events';
import getMouseEventPoints from './getMouseEventPoints';
function mouseDoubleClickListener(evt) {
    const element = evt.currentTarget;
    const { viewportId, renderingEngineId } = getEnabledElement(element);
    const startPoints = getMouseEventPoints(evt, element);
    const deltaPoints = {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    };
    const eventDetail = {
        event: evt,
        eventName: Events.MOUSE_DOUBLE_CLICK,
        viewportId,
        renderingEngineId,
        camera: {},
        element,
        startPoints,
        lastPoints: startPoints,
        currentPoints: startPoints,
        deltaPoints,
    };
    const consumed = !triggerEvent(element, Events.MOUSE_DOUBLE_CLICK, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
}
export default mouseDoubleClickListener;
//# sourceMappingURL=mouseDoubleClickListener.js.map