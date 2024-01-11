import Events from '../enums/Events';
import { mouseClick, mouseDown, mouseDownActivate, mouseDoubleClick, mouseDrag, mouseMove, mouseUp, mouseWheel, } from './mouseEventHandlers';
const enable = function (element) {
    element.addEventListener(Events.MOUSE_CLICK, mouseClick);
    element.addEventListener(Events.MOUSE_DOWN, mouseDown);
    element.addEventListener(Events.MOUSE_DOWN_ACTIVATE, mouseDownActivate);
    element.addEventListener(Events.MOUSE_DOUBLE_CLICK, mouseDoubleClick);
    element.addEventListener(Events.MOUSE_DRAG, mouseDrag);
    element.addEventListener(Events.MOUSE_MOVE, mouseMove);
    element.addEventListener(Events.MOUSE_UP, mouseUp);
    element.addEventListener(Events.MOUSE_WHEEL, mouseWheel);
};
const disable = function (element) {
    element.removeEventListener(Events.MOUSE_CLICK, mouseClick);
    element.removeEventListener(Events.MOUSE_DOWN, mouseDown);
    element.removeEventListener(Events.MOUSE_DOWN_ACTIVATE, mouseDownActivate);
    element.removeEventListener(Events.MOUSE_DOUBLE_CLICK, mouseDoubleClick);
    element.removeEventListener(Events.MOUSE_DRAG, mouseDrag);
    element.removeEventListener(Events.MOUSE_MOVE, mouseMove);
    element.removeEventListener(Events.MOUSE_UP, mouseUp);
    element.removeEventListener(Events.MOUSE_WHEEL, mouseWheel);
};
const mouseToolEventDispatcher = {
    enable,
    disable,
};
export default mouseToolEventDispatcher;
//# sourceMappingURL=mouseToolEventDispatcher.js.map