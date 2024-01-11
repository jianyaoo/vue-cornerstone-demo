export function validateParameterUndefined(checkParam, errorMsg) {
    if (checkParam === undefined) {
        throw new Error(errorMsg);
    }
}
export function validateParameterUndefinedOrNull(checkParam, errorMsg) {
    if (checkParam === undefined || checkParam === null) {
        throw new Error(errorMsg);
    }
}
//# sourceMappingURL=validator.js.map