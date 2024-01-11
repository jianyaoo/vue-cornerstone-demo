import { setElementCursor } from './elementCursor';
import MouseCursor from './MouseCursor';
import SVGMouseCursor from './SVGMouseCursor';
function setCursorForElement(element, cursorName) {
    let cursor = SVGMouseCursor.getDefinedCursor(cursorName, true);
    if (!cursor) {
        cursor = MouseCursor.getDefinedCursor(cursorName);
    }
    if (!cursor) {
        console.log(`Cursor ${cursorName} is not defined either as SVG or as a standard cursor.`);
        cursor = MouseCursor.getDefinedCursor(cursorName);
    }
    setElementCursor(element, cursor);
}
export default setCursorForElement;
//# sourceMappingURL=setCursorForElement.js.map