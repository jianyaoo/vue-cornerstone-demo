"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleProperty = void 0;
const ToolStyle_1 = __importDefault(require("./ToolStyle"));
function getHierarchalPropertyStyles(property, state, mode) {
    const list = [`${property}`];
    if (state) {
        list.push(`${list[0]}${state}`);
    }
    if (mode) {
        list.push(`${list[list.length - 1]}${mode}`);
    }
    return list;
}
function getStyleProperty(property, styleSpecifier, state, mode) {
    const alternatives = getHierarchalPropertyStyles(property, state, mode);
    for (let i = alternatives.length - 1; i >= 0; --i) {
        const style = ToolStyle_1.default.getStyleProperty(alternatives[i], styleSpecifier);
        if (style !== undefined) {
            return style;
        }
    }
}
exports.getStyleProperty = getStyleProperty;
//# sourceMappingURL=helpers.js.map