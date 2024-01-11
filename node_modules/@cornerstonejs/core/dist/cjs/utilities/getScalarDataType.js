"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getScalarDataType(scalingParameters, scalarData) {
    let type;
    if (scalarData && scalarData instanceof Uint8Array) {
        type = 'Uint8Array';
    }
    else if (scalarData instanceof Float32Array) {
        type = 'Float32Array';
    }
    else if (scalarData instanceof Int16Array) {
        type = 'Int16Array';
    }
    else if (scalarData instanceof Uint16Array) {
        type = 'Uint16Array';
    }
    else {
        throw new Error('Unsupported array type');
    }
    return type;
}
exports.default = getScalarDataType;
//# sourceMappingURL=getScalarDataType.js.map