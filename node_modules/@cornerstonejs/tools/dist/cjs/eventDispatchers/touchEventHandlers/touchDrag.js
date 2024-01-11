"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getActiveToolForTouchEvent_1 = __importDefault(require("../shared/getActiveToolForTouchEvent"));
const store_1 = require("../../store");
function touchDrag(evt) {
    if (store_1.state.isInteractingWithTool) {
        return;
    }
    const activeTool = (0, getActiveToolForTouchEvent_1.default)(evt);
    const noFoundToolOrDoesNotHaveTouchDragCallback = !activeTool || typeof activeTool.touchDragCallback !== 'function';
    if (noFoundToolOrDoesNotHaveTouchDragCallback) {
        return;
    }
    activeTool.touchDragCallback(evt);
}
exports.default = touchDrag;
//# sourceMappingURL=touchDrag.js.map