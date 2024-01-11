import { getEnabledElement, triggerEvent } from '@cornerstonejs/core';
import normalizeWheel from './normalizeWheel';
import Events from '../../enums/Events';
import getMouseEventPoints from '../mouse/getMouseEventPoints';
function wheelListener(evt) {
    const element = evt.currentTarget;
    const enabledElement = getEnabledElement(element);
    const { renderingEngineId, viewportId } = enabledElement;
    if (evt.deltaY > -1 && evt.deltaY < 1) {
        return;
    }
    evt.preventDefault();
    const { spinX, spinY, pixelX, pixelY } = normalizeWheel(evt);
    const direction = spinY < 0 ? -1 : 1;
    const eventDetail = {
        event: evt,
        eventName: Events.MOUSE_WHEEL,
        renderingEngineId,
        viewportId,
        element,
        camera: {},
        detail: evt,
        wheel: {
            spinX,
            spinY,
            pixelX,
            pixelY,
            direction,
        },
        points: getMouseEventPoints(evt),
    };
    triggerEvent(element, Events.MOUSE_WHEEL, eventDetail);
}
export default wheelListener;
//# sourceMappingURL=wheelListener.js.map