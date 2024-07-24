function areNumbersEqualWithTolerance(num1, num2, tolerance) {
    return Math.abs(num1 - num2) <= tolerance;
}
function areArraysEqual(arr1, arr2, tolerance = 1e-5) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (!areNumbersEqualWithTolerance(arr1[i], arr2[i], tolerance)) {
            return false;
        }
    }
    return true;
}
function isNumberType(value) {
    return typeof value === 'number';
}
function isNumberArrayLike(value) {
    return 'length' in value && typeof value[0] === 'number';
}
export default function isEqual(v1, v2, tolerance = 1e-5) {
    if (typeof v1 !== typeof v2 || v1 === null || v2 === null) {
        return false;
    }
    if (isNumberType(v1) && isNumberType(v2)) {
        return areNumbersEqualWithTolerance(v1, v2, tolerance);
    }
    if (isNumberArrayLike(v1) && isNumberArrayLike(v2)) {
        return areArraysEqual(v1, v2, tolerance);
    }
    return false;
}
const negative = (v) => typeof v === 'number' ? -v : v?.map ? v.map(negative) : !v;
const abs = (v) => typeof v === 'number' ? Math.abs(v) : v?.map ? v.map(abs) : v;
const isEqualNegative = (v1, v2, tolerance = undefined) => isEqual(v1, negative(v2), tolerance);
const isEqualAbs = (v1, v2, tolerance = undefined) => isEqual(abs(v1), abs(v2), tolerance);
export { isEqualNegative, isEqual, isEqualAbs };
//# sourceMappingURL=isEqual.js.map