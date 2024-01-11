import wheelListener from './wheelListener';
function enable(element) {
    disable(element);
    element.addEventListener('wheel', wheelListener, { passive: false });
}
function disable(element) {
    element.removeEventListener('wheel', wheelListener);
}
export default {
    enable,
    disable,
};
//# sourceMappingURL=index.js.map