"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNewAttributesIfValid = void 0;
function setNewAttributesIfValid(attributes, svgNode) {
    Object.keys(attributes).forEach((key) => {
        const newValue = attributes[key];
        if (newValue !== undefined && newValue !== '') {
            svgNode.setAttribute(key, newValue);
        }
    });
}
exports.setNewAttributesIfValid = setNewAttributesIfValid;
exports.default = setNewAttributesIfValid;
//# sourceMappingURL=setNewAttributesIfValid.js.map