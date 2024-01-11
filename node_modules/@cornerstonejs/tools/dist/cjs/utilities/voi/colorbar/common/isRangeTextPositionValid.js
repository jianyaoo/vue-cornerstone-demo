"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRangeTextPositionValid = exports.default = void 0;
const enums_1 = require("../enums");
function isRangeTextPositionValid(colorbarWidth, colorbarHeight, rangeTextPosition) {
    const isHorizontal = colorbarWidth >= colorbarHeight;
    const validRangeTextPositions = isHorizontal
        ? [enums_1.ColorbarRangeTextPosition.Top, enums_1.ColorbarRangeTextPosition.Bottom]
        : [enums_1.ColorbarRangeTextPosition.Left, enums_1.ColorbarRangeTextPosition.Right];
    return validRangeTextPositions.includes(rangeTextPosition);
}
exports.default = isRangeTextPositionValid;
exports.isRangeTextPositionValid = isRangeTextPositionValid;
//# sourceMappingURL=isRangeTextPositionValid.js.map