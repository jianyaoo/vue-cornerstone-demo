"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const getMouseModifierKey = (evt) => {
    if (evt.shiftKey) {
        if (evt.ctrlKey) {
            return enums_1.KeyboardBindings.ShiftCtrl;
        }
        if (evt.altKey) {
            return enums_1.KeyboardBindings.ShiftAlt;
        }
        if (evt.metaKey) {
            return enums_1.KeyboardBindings.ShiftMeta;
        }
        return enums_1.KeyboardBindings.Shift;
    }
    if (evt.ctrlKey) {
        if (evt.altKey) {
            return enums_1.KeyboardBindings.CtrlAlt;
        }
        if (evt.metaKey) {
            return enums_1.KeyboardBindings.CtrlMeta;
        }
        return enums_1.KeyboardBindings.Ctrl;
    }
    if (evt.altKey) {
        return (evt.metaKey && enums_1.KeyboardBindings.AltMeta) || enums_1.KeyboardBindings.Alt;
    }
    if (evt.metaKey) {
        return enums_1.KeyboardBindings.Meta;
    }
    return undefined;
};
exports.default = getMouseModifierKey;
//# sourceMappingURL=getMouseModifier.js.map