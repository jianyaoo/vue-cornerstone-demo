import Events from '../enums/Events';
import { keyDown, keyUp } from './keyboardEventHandlers';
const enable = function (element) {
    element.addEventListener(Events.KEY_DOWN, keyDown);
    element.addEventListener(Events.KEY_UP, keyUp);
};
const disable = function (element) {
    element.removeEventListener(Events.KEY_DOWN, keyDown);
    element.removeEventListener(Events.KEY_UP, keyUp);
};
const keyboardToolEventDispatcher = {
    enable,
    disable,
};
export default keyboardToolEventDispatcher;
//# sourceMappingURL=keyboardToolEventDispatcher.js.map