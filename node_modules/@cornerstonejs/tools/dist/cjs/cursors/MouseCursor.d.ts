export default class MouseCursor {
    private name;
    private fallback;
    constructor(name: string, fallback?: MouseCursor | undefined);
    getName(): string;
    addFallbackStyleProperty(style: string): string;
    getStyleProperty(): string;
    static getDefinedCursor(name: string): MouseCursor | undefined;
    static setDefinedCursor(name: string, cursor: MouseCursor): boolean;
}
declare const standardCursorNames: IterableIterator<string>;
export { standardCursorNames };
