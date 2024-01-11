"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const getActiveToolForMouseEvent_1 = __importDefault(require("../shared/getActiveToolForMouseEvent"));
const annotationSelection_1 = require("../../stateManagement/annotation/annotationSelection");
function mouseDownActivate(evt) {
    if (store_1.state.isInteractingWithTool) {
        return;
    }
    const activeTool = (0, getActiveToolForMouseEvent_1.default)(evt);
    if (!activeTool) {
        return;
    }
    if (store_1.state.isMultiPartToolActive) {
        return;
    }
    if (activeTool.addNewAnnotation) {
        const annotation = activeTool.addNewAnnotation(evt, 'mouse');
        (0, annotationSelection_1.setAnnotationSelected)(annotation.annotationUID);
    }
}
exports.default = mouseDownActivate;
//# sourceMappingURL=mouseDownActivate.js.map