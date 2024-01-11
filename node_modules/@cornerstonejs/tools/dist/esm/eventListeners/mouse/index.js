import mouseDoubleClickListener from './mouseDoubleClickListener';
import mouseDownListener, { mouseDoubleClickIgnoreListener, } from './mouseDownListener';
import mouseMoveListener from './mouseMoveListener';
function disable(element) {
    element.removeEventListener('dblclick', mouseDoubleClickListener);
    element.removeEventListener('mousedown', mouseDownListener);
    element.removeEventListener('mousemove', mouseMoveListener);
    element.removeEventListener('dblclick', mouseDoubleClickIgnoreListener, {
        capture: true,
    });
}
function enable(element) {
    disable(element);
    element.addEventListener('dblclick', mouseDoubleClickListener);
    element.addEventListener('mousedown', mouseDownListener);
    element.addEventListener('mousemove', mouseMoveListener);
    element.addEventListener('dblclick', mouseDoubleClickIgnoreListener, {
        capture: true,
    });
}
export default {
    enable,
    disable,
};
//# sourceMappingURL=index.js.map