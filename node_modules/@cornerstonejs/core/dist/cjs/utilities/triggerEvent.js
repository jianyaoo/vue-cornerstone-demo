"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventTarget_1 = __importDefault(require("../eventTarget"));
function triggerEvent(el = eventTarget_1.default, type, detail = null) {
    if (!type) {
        throw new Error('Event type was not defined');
    }
    const event = new CustomEvent(type, {
        detail,
        cancelable: true,
    });
    return el.dispatchEvent(event);
}
exports.default = triggerEvent;
//# sourceMappingURL=triggerEvent.js.map