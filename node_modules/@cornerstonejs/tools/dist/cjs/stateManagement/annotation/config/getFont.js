"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
function getFont(styleSpecifier, state, mode) {
    const fontSize = (0, helpers_1.getStyleProperty)('textBoxFontSize', styleSpecifier, state, mode);
    const fontFamily = (0, helpers_1.getStyleProperty)('textBoxFontFamily', styleSpecifier, state, mode);
    return `${fontSize}px ${fontFamily}`;
}
exports.default = getFont;
//# sourceMappingURL=getFont.js.map