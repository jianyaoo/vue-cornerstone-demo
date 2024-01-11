"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const normalizeWheel_1 = __importDefault(require("./normalizeWheel"));
const Events_1 = __importDefault(require("../../enums/Events"));
const getMouseEventPoints_1 = __importDefault(require("../mouse/getMouseEventPoints"));
function wheelListener(evt) {
    const element = evt.currentTarget;
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { renderingEngineId, viewportId } = enabledElement;
    if (evt.deltaY > -1 && evt.deltaY < 1) {
        return;
    }
    evt.preventDefault();
    const { spinX, spinY, pixelX, pixelY } = (0, normalizeWheel_1.default)(evt);
    const direction = spinY < 0 ? -1 : 1;
    const eventDetail = {
        event: evt,
        eventName: Events_1.default.MOUSE_WHEEL,
        renderingEngineId,
        viewportId,
        element,
        camera: {},
        detail: evt,
        wheel: {
            spinX,
            spinY,
            pixelX,
            pixelY,
            direction,
        },
        points: (0, getMouseEventPoints_1.default)(evt),
    };
    (0, core_1.triggerEvent)(element, Events_1.default.MOUSE_WHEEL, eventDetail);
}
exports.default = wheelListener;
//# sourceMappingURL=wheelListener.js.map