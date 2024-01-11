import { ColorbarRangeTextPosition } from '../enums';
function isRangeTextPositionValid(colorbarWidth, colorbarHeight, rangeTextPosition) {
    const isHorizontal = colorbarWidth >= colorbarHeight;
    const validRangeTextPositions = isHorizontal
        ? [ColorbarRangeTextPosition.Top, ColorbarRangeTextPosition.Bottom]
        : [ColorbarRangeTextPosition.Left, ColorbarRangeTextPosition.Right];
    return validRangeTextPositions.includes(rangeTextPosition);
}
export { isRangeTextPositionValid as default, isRangeTextPositionValid };
//# sourceMappingURL=isRangeTextPositionValid.js.map