"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTransferFunctionNodes = exports.getTransferFunctionNodes = void 0;
function getTransferFunctionNodes(transferFunction) {
    const size = transferFunction.getSize();
    const values = [];
    for (let index = 0; index < size; index++) {
        const nodeValue1 = [];
        transferFunction.getNodeValue(index, nodeValue1);
        values.push(nodeValue1);
    }
    return values;
}
exports.getTransferFunctionNodes = getTransferFunctionNodes;
function setTransferFunctionNodes(transferFunction, nodes) {
    if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length)) {
        return;
    }
    transferFunction.removeAllPoints();
    nodes.forEach((node) => {
        transferFunction.addRGBPoint(...node);
    });
}
exports.setTransferFunctionNodes = setTransferFunctionNodes;
//# sourceMappingURL=transferFunctionUtils.js.map