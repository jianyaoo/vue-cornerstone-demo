"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getActiveToolForMouseEvent_1 = __importDefault(require("../shared/getActiveToolForMouseEvent"));
const store_1 = require("../../store");
function mouseDrag(evt) {
    if (store_1.state.isInteractingWithTool) {
        return;
    }
    const activeTool = (0, getActiveToolForMouseEvent_1.default)(evt);
    const noFoundToolOrDoesNotHaveMouseDragCallback = !activeTool || typeof activeTool.mouseDragCallback !== 'function';
    if (noFoundToolOrDoesNotHaveMouseDragCallback) {
        return;
    }
    activeTool.mouseDragCallback(evt);
}
exports.default = mouseDrag;
//# sourceMappingURL=mouseDrag.js.map