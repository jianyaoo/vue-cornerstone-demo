"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __importDefault(require("../enums/Events"));
const keyboardEventHandlers_1 = require("./keyboardEventHandlers");
const enable = function (element) {
    element.addEventListener(Events_1.default.KEY_DOWN, keyboardEventHandlers_1.keyDown);
    element.addEventListener(Events_1.default.KEY_UP, keyboardEventHandlers_1.keyUp);
};
const disable = function (element) {
    element.removeEventListener(Events_1.default.KEY_DOWN, keyboardEventHandlers_1.keyDown);
    element.removeEventListener(Events_1.default.KEY_UP, keyboardEventHandlers_1.keyUp);
};
const keyboardToolEventDispatcher = {
    enable,
    disable,
};
exports.default = keyboardToolEventDispatcher;
//# sourceMappingURL=keyboardToolEventDispatcher.js.map