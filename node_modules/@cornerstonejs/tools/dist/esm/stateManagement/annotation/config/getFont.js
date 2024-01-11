import { getStyleProperty } from './helpers';
function getFont(styleSpecifier, state, mode) {
    const fontSize = getStyleProperty('textBoxFontSize', styleSpecifier, state, mode);
    const fontFamily = getStyleProperty('textBoxFontFamily', styleSpecifier, state, mode);
    return `${fontSize}px ${fontFamily}`;
}
export default getFont;
//# sourceMappingURL=getFont.js.map