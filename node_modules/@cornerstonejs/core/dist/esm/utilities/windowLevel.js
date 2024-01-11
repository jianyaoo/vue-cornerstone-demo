function toWindowLevel(low, high) {
    const windowWidth = Math.abs(high - low) + 1;
    const windowCenter = (low + high + 1) / 2;
    return { windowWidth, windowCenter };
}
function toLowHighRange(windowWidth, windowCenter) {
    const lower = windowCenter - 0.5 - (windowWidth - 1) / 2;
    const upper = windowCenter - 0.5 + (windowWidth - 1) / 2;
    return { lower, upper };
}
export { toWindowLevel, toLowHighRange };
//# sourceMappingURL=windowLevel.js.map