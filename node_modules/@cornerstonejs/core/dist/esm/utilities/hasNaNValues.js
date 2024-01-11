export default function hasNaNValues(input) {
    if (Array.isArray(input)) {
        return input.some((value) => Number.isNaN(value));
    }
    return Number.isNaN(input);
}
//# sourceMappingURL=hasNaNValues.js.map