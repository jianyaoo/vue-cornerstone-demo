"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __importDefault(require("../enums/Events"));
const touchEventHandlers_1 = require("./touchEventHandlers");
const enable = function (element) {
    element.addEventListener(Events_1.default.TOUCH_START, touchEventHandlers_1.touchStart);
    element.addEventListener(Events_1.default.TOUCH_START_ACTIVATE, touchEventHandlers_1.touchStartActivate);
    element.addEventListener(Events_1.default.TOUCH_DRAG, touchEventHandlers_1.touchDrag);
    element.addEventListener(Events_1.default.TOUCH_END, touchEventHandlers_1.touchEnd);
    element.addEventListener(Events_1.default.TOUCH_TAP, touchEventHandlers_1.touchTap);
    element.addEventListener(Events_1.default.TOUCH_PRESS, touchEventHandlers_1.touchPress);
};
const disable = function (element) {
    element.removeEventListener(Events_1.default.TOUCH_START, touchEventHandlers_1.touchStart);
    element.removeEventListener(Events_1.default.TOUCH_START_ACTIVATE, touchEventHandlers_1.touchStartActivate);
    element.removeEventListener(Events_1.default.TOUCH_DRAG, touchEventHandlers_1.touchDrag);
    element.removeEventListener(Events_1.default.TOUCH_END, touchEventHandlers_1.touchEnd);
    element.removeEventListener(Events_1.default.TOUCH_PRESS, touchEventHandlers_1.touchPress);
};
const touchToolEventDispatcher = {
    enable,
    disable,
};
exports.default = touchToolEventDispatcher;
//# sourceMappingURL=touchToolEventDispatcher.js.map