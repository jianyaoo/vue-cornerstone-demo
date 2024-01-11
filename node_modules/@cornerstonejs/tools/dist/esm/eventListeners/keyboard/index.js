import keyDownListener, { getModifierKey } from './keyDownListener';
function enable(element) {
    disable(element);
    element.addEventListener('keydown', keyDownListener);
}
function disable(element) {
    element.removeEventListener('keydown', keyDownListener);
}
export default {
    enable,
    disable,
    getModifierKey,
};
//# sourceMappingURL=index.js.map