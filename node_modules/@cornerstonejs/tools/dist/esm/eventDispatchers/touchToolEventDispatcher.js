import Events from '../enums/Events';
import { touchStart, touchStartActivate, touchDrag, touchEnd, touchTap, touchPress, } from './touchEventHandlers';
const enable = function (element) {
    element.addEventListener(Events.TOUCH_START, touchStart);
    element.addEventListener(Events.TOUCH_START_ACTIVATE, touchStartActivate);
    element.addEventListener(Events.TOUCH_DRAG, touchDrag);
    element.addEventListener(Events.TOUCH_END, touchEnd);
    element.addEventListener(Events.TOUCH_TAP, touchTap);
    element.addEventListener(Events.TOUCH_PRESS, touchPress);
};
const disable = function (element) {
    element.removeEventListener(Events.TOUCH_START, touchStart);
    element.removeEventListener(Events.TOUCH_START_ACTIVATE, touchStartActivate);
    element.removeEventListener(Events.TOUCH_DRAG, touchDrag);
    element.removeEventListener(Events.TOUCH_END, touchEnd);
    element.removeEventListener(Events.TOUCH_PRESS, touchPress);
};
const touchToolEventDispatcher = {
    enable,
    disable,
};
export default touchToolEventDispatcher;
//# sourceMappingURL=touchToolEventDispatcher.js.map