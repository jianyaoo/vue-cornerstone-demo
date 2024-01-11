"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const Events_1 = __importDefault(require("../../enums/Events"));
const getMouseEventPoints_1 = __importDefault(require("./getMouseEventPoints"));
const eventName = Events_1.default.MOUSE_MOVE;
function mouseMoveListener(evt) {
    const element = evt.currentTarget;
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { renderingEngineId, viewportId } = enabledElement;
    const currentPoints = (0, getMouseEventPoints_1.default)(evt);
    const eventDetail = {
        renderingEngineId,
        viewportId,
        camera: {},
        element,
        currentPoints,
        eventName,
        event: evt,
    };
    const consumed = !(0, core_1.triggerEvent)(element, eventName, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
}
exports.default = mouseMoveListener;
//# sourceMappingURL=mouseMoveListener.js.map