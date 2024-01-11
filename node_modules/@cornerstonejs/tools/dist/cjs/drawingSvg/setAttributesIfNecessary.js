"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttributesIfNecessary = void 0;
function setAttributesIfNecessary(attributes, svgNode) {
    Object.keys(attributes).forEach((key) => {
        const currentValue = svgNode.getAttribute(key);
        const newValue = attributes[key];
        if (newValue === undefined || newValue === '') {
            svgNode.removeAttribute(key);
        }
        else if (currentValue !== newValue) {
            svgNode.setAttribute(key, newValue);
        }
    });
}
exports.setAttributesIfNecessary = setAttributesIfNecessary;
exports.default = setAttributesIfNecessary;
//# sourceMappingURL=setAttributesIfNecessary.js.map