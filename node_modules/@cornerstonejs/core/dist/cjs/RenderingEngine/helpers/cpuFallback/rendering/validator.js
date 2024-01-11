"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParameterUndefinedOrNull = exports.validateParameterUndefined = void 0;
function validateParameterUndefined(checkParam, errorMsg) {
    if (checkParam === undefined) {
        throw new Error(errorMsg);
    }
}
exports.validateParameterUndefined = validateParameterUndefined;
function validateParameterUndefinedOrNull(checkParam, errorMsg) {
    if (checkParam === undefined || checkParam === null) {
        throw new Error(errorMsg);
    }
}
exports.validateParameterUndefinedOrNull = validateParameterUndefinedOrNull;
//# sourceMappingURL=validator.js.map