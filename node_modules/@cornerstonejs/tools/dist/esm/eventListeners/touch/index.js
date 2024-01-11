import preventGhostClick from './preventGhostClick';
import touchStartListener from './touchStartListener';
function disable(element) {
    preventGhostClick.disable(element);
    element.removeEventListener('touchstart', touchStartListener);
}
function enable(element) {
    disable(element);
    preventGhostClick.enable(element);
    element.addEventListener('touchstart', touchStartListener, {
        passive: false,
    });
}
export default {
    enable,
    disable,
};
//# sourceMappingURL=index.js.map