import MouseCursor from './MouseCursor';
import ImageMouseCursor from './ImageMouseCursor';
export default class SVGMouseCursor extends ImageMouseCursor {
    constructor(url: string, x?: number, y?: number, name?: string | undefined, fallback?: MouseCursor | undefined);
    static getDefinedCursor(name: string, pointer?: boolean, color?: string): MouseCursor;
}
