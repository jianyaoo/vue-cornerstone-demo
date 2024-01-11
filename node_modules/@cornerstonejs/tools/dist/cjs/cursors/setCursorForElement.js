"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elementCursor_1 = require("./elementCursor");
const MouseCursor_1 = __importDefault(require("./MouseCursor"));
const SVGMouseCursor_1 = __importDefault(require("./SVGMouseCursor"));
function setCursorForElement(element, cursorName) {
    let cursor = SVGMouseCursor_1.default.getDefinedCursor(cursorName, true);
    if (!cursor) {
        cursor = MouseCursor_1.default.getDefinedCursor(cursorName);
    }
    if (!cursor) {
        console.log(`Cursor ${cursorName} is not defined either as SVG or as a standard cursor.`);
        cursor = MouseCursor_1.default.getDefinedCursor(cursorName);
    }
    (0, elementCursor_1.setElementCursor)(element, cursor);
}
exports.default = setCursorForElement;
//# sourceMappingURL=setCursorForElement.js.map