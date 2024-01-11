"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invertOrientationStringLPS(orientationString) {
    let inverted = orientationString.replace('H', 'f');
    inverted = inverted.replace('F', 'h');
    inverted = inverted.replace('R', 'l');
    inverted = inverted.replace('L', 'r');
    inverted = inverted.replace('A', 'p');
    inverted = inverted.replace('P', 'a');
    inverted = inverted.toUpperCase();
    return inverted;
}
exports.default = invertOrientationStringLPS;
//# sourceMappingURL=invertOrientationStringLPS.js.map