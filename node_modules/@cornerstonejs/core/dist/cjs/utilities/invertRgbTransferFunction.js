"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invertRgbTransferFunction(rgbTransferFunction) {
    if (!rgbTransferFunction) {
        return;
    }
    const size = rgbTransferFunction.getSize();
    for (let index = 0; index < size; index++) {
        const nodeValue1 = [];
        rgbTransferFunction.getNodeValue(index, nodeValue1);
        nodeValue1[1] = 1 - nodeValue1[1];
        nodeValue1[2] = 1 - nodeValue1[2];
        nodeValue1[3] = 1 - nodeValue1[3];
        rgbTransferFunction.setNodeValue(index, nodeValue1);
    }
}
exports.default = invertRgbTransferFunction;
//# sourceMappingURL=invertRgbTransferFunction.js.map