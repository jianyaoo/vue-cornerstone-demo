"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const Events_1 = __importDefault(require("../../enums/Events"));
const getMouseEventPoints_1 = __importDefault(require("./getMouseEventPoints"));
function mouseDoubleClickListener(evt) {
    const element = evt.currentTarget;
    const { viewportId, renderingEngineId } = (0, core_1.getEnabledElement)(element);
    const startPoints = (0, getMouseEventPoints_1.default)(evt, element);
    const deltaPoints = {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    };
    const eventDetail = {
        event: evt,
        eventName: Events_1.default.MOUSE_DOUBLE_CLICK,
        viewportId,
        renderingEngineId,
        camera: {},
        element,
        startPoints,
        lastPoints: startPoints,
        currentPoints: startPoints,
        deltaPoints,
    };
    const consumed = !(0, core_1.triggerEvent)(element, Events_1.default.MOUSE_DOUBLE_CLICK, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
}
exports.default = mouseDoubleClickListener;
//# sourceMappingURL=mouseDoubleClickListener.js.map