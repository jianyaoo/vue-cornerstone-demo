import { KeyboardBindings as kb } from '../../enums';
const getMouseModifierKey = (evt) => {
    if (evt.shiftKey) {
        if (evt.ctrlKey) {
            return kb.ShiftCtrl;
        }
        if (evt.altKey) {
            return kb.ShiftAlt;
        }
        if (evt.metaKey) {
            return kb.ShiftMeta;
        }
        return kb.Shift;
    }
    if (evt.ctrlKey) {
        if (evt.altKey) {
            return kb.CtrlAlt;
        }
        if (evt.metaKey) {
            return kb.CtrlMeta;
        }
        return kb.Ctrl;
    }
    if (evt.altKey) {
        return (evt.metaKey && kb.AltMeta) || kb.Alt;
    }
    if (evt.metaKey) {
        return kb.Meta;
    }
    return undefined;
};
export default getMouseModifierKey;
//# sourceMappingURL=getMouseModifier.js.map