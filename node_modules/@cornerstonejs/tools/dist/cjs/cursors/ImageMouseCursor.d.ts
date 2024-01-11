import MouseCursor from './MouseCursor';
export default class ImageMouseCursor extends MouseCursor {
    private url;
    private x;
    private y;
    constructor(url: string, x?: number, y?: number, name?: string | undefined, fallback?: MouseCursor | undefined);
    getStyleProperty(): string;
    static getUniqueInstanceName(prefix: string): string;
}
