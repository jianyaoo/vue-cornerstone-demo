"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const getEnabledElement_1 = __importDefault(require("../getEnabledElement"));
function getImageLegacy(element) {
    const enabledElement = (0, getEnabledElement_1.default)(element);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    if (!(viewport instanceof __1.StackViewport)) {
        throw new Error(`An image can only be fetched for a stack viewport and not for a viewport of type: ${viewport.type}`);
    }
    return viewport.getCornerstoneImage();
}
exports.default = getImageLegacy;
//# sourceMappingURL=getImageLegacy.js.map