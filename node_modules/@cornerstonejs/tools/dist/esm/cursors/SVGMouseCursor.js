import { ToolModes, AnnotationStyleStates } from '../enums';
import ImageMouseCursor from './ImageMouseCursor';
import { getDefinedSVGCursorDescriptor } from './SVGCursorDescriptor';
import { getStyleProperty } from '../stateManagement/annotation/config/helpers';
const PROPERTY = 'color';
const STATE = AnnotationStyleStates.Highlighted;
const MODE = ToolModes.Active;
export default class SVGMouseCursor extends ImageMouseCursor {
    constructor(url, x, y, name, fallback) {
        super(url, x, y, name, fallback);
    }
    static getDefinedCursor(name, pointer = false, color) {
        if (!color) {
            color = getStyleProperty(PROPERTY, {}, STATE, MODE);
        }
        const urn = getCursorURN(name, pointer, color);
        let cursor = super.getDefinedCursor(urn);
        if (!cursor) {
            const descriptor = getDefinedSVGCursorDescriptor(name);
            if (descriptor) {
                cursor = createSVGMouseCursor(descriptor, urn, pointer, color, super.getDefinedCursor('default'));
                super.setDefinedCursor(urn, cursor);
            }
        }
        return cursor;
    }
}
function format(template, dictionary) {
    const dict = Object(dictionary);
    const defined = Object.prototype.hasOwnProperty.bind(dict);
    return (template + '').replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return defined(key) ? dict[key] + '' : '';
    });
}
function getCursorURN(name, pointer, color) {
    const type = pointer ? 'pointer' : 'cursor';
    return `${type}:${name}/${color}`;
}
function createSVGMouseCursor(descriptor, name, pointer, color, fallback) {
    const { x, y } = descriptor.mousePoint;
    return new SVGMouseCursor(createSVGIconUrl(descriptor, pointer, { color }), x, y, name, fallback);
}
function createSVGIconUrl(descriptor, pointer, options) {
    return URL.createObjectURL(createSVGIconBlob(descriptor, pointer, options));
}
function createSVGIconBlob(descriptor, pointer, options) {
    const svgString = (pointer ? createSVGIconWithPointer : createSVGIcon)(descriptor, options);
    return new Blob([svgString], { type: 'image/svg+xml' });
}
function createSVGIcon(descriptor, options) {
    const { iconContent, iconSize, viewBox } = descriptor;
    const svgString = `
    <svg data-icon="cursor" role="img" xmlns="http://www.w3.org/2000/svg"
      width="${iconSize}" height="${iconSize}" viewBox="0 0
      ${viewBox.x} ${viewBox.y}">
      ${iconContent}
    </svg>`;
    return format(svgString, options);
}
function createSVGIconWithPointer(descriptor, options) {
    const { iconContent, iconSize, viewBox, mousePointerGroupString } = descriptor;
    const scale = iconSize / Math.max(viewBox.x, viewBox.y, 1);
    const svgSize = 16 + iconSize;
    const svgString = `
    <svg data-icon="cursor" role="img" xmlns="http://www.w3.org/2000/svg"
      width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
      <g>${mousePointerGroupString}</g>
      <g transform="translate(16, 16) scale(${scale})">${iconContent}</g>
    </svg>`;
    return format(svgString, options);
}
//# sourceMappingURL=SVGMouseCursor.js.map