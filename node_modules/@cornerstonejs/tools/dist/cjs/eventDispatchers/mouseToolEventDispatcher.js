"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __importDefault(require("../enums/Events"));
const mouseEventHandlers_1 = require("./mouseEventHandlers");
const enable = function (element) {
    element.addEventListener(Events_1.default.MOUSE_CLICK, mouseEventHandlers_1.mouseClick);
    element.addEventListener(Events_1.default.MOUSE_DOWN, mouseEventHandlers_1.mouseDown);
    element.addEventListener(Events_1.default.MOUSE_DOWN_ACTIVATE, mouseEventHandlers_1.mouseDownActivate);
    element.addEventListener(Events_1.default.MOUSE_DOUBLE_CLICK, mouseEventHandlers_1.mouseDoubleClick);
    element.addEventListener(Events_1.default.MOUSE_DRAG, mouseEventHandlers_1.mouseDrag);
    element.addEventListener(Events_1.default.MOUSE_MOVE, mouseEventHandlers_1.mouseMove);
    element.addEventListener(Events_1.default.MOUSE_UP, mouseEventHandlers_1.mouseUp);
    element.addEventListener(Events_1.default.MOUSE_WHEEL, mouseEventHandlers_1.mouseWheel);
};
const disable = function (element) {
    element.removeEventListener(Events_1.default.MOUSE_CLICK, mouseEventHandlers_1.mouseClick);
    element.removeEventListener(Events_1.default.MOUSE_DOWN, mouseEventHandlers_1.mouseDown);
    element.removeEventListener(Events_1.default.MOUSE_DOWN_ACTIVATE, mouseEventHandlers_1.mouseDownActivate);
    element.removeEventListener(Events_1.default.MOUSE_DOUBLE_CLICK, mouseEventHandlers_1.mouseDoubleClick);
    element.removeEventListener(Events_1.default.MOUSE_DRAG, mouseEventHandlers_1.mouseDrag);
    element.removeEventListener(Events_1.default.MOUSE_MOVE, mouseEventHandlers_1.mouseMove);
    element.removeEventListener(Events_1.default.MOUSE_UP, mouseEventHandlers_1.mouseUp);
    element.removeEventListener(Events_1.default.MOUSE_WHEEL, mouseEventHandlers_1.mouseWheel);
};
const mouseToolEventDispatcher = {
    enable,
    disable,
};
exports.default = mouseToolEventDispatcher;
//# sourceMappingURL=mouseToolEventDispatcher.js.map