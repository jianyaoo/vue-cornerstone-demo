const DEFINED_CURSORS = Symbol('DefinedCursors');
const STANDARD_CURSORS = new Set([
    'alias',
    'all-scroll',
    'auto',
    'cell',
    'col-resize',
    'context-menu',
    'copy',
    'crosshair',
    'default',
    'e-resize',
    'ew-resize',
    'grab',
    'grabbing',
    'help',
    'move',
    'ne-resize',
    'nesw-resize',
    'no-drop',
    'none',
    'not-allowed',
    'n-resize',
    'ns-resize',
    'nw-resize',
    'nwse-resize',
    'pointer',
    'progress',
    'row-resize',
    'se-resize',
    's-resize',
    'sw-resize',
    'text',
    'vertical-text',
    'wait',
    'w-resize',
    'zoom-in',
    'zoom-out',
]);
export default class MouseCursor {
    constructor(name, fallback) {
        this.name = name + '';
        this.fallback = fallback;
    }
    getName() {
        return this.name + '';
    }
    addFallbackStyleProperty(style) {
        const { fallback } = this;
        if (fallback instanceof MouseCursor) {
            return `${style}, ${fallback.getStyleProperty()}`;
        }
        return style + '';
    }
    getStyleProperty() {
        return this.addFallbackStyleProperty(this.name) + '';
    }
    static getDefinedCursor(name) {
        const definedCursors = getDefinedCursors(MouseCursor, DEFINED_CURSORS);
        let mouseCursor = definedCursors.get(name);
        if (mouseCursor instanceof MouseCursor) {
            return mouseCursor;
        }
        if (STANDARD_CURSORS.has(name)) {
            mouseCursor = new MouseCursor(name);
            definedCursors.set(name, mouseCursor);
            return mouseCursor;
        }
    }
    static setDefinedCursor(name, cursor) {
        if (cursor instanceof MouseCursor) {
            const definedCursors = getDefinedCursors(MouseCursor, DEFINED_CURSORS);
            definedCursors.set(name, cursor);
            return true;
        }
        return false;
    }
}
function getDefinedCursors(context, symbol) {
    let definedCursors = context[symbol];
    if (!(definedCursors instanceof Map)) {
        definedCursors = new Map();
        Object.defineProperty(context, symbol, { value: definedCursors });
    }
    return definedCursors;
}
const standardCursorNames = STANDARD_CURSORS.values();
export { standardCursorNames };
//# sourceMappingURL=MouseCursor.js.map