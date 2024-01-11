export function clip(val, low, high) {
    return Math.min(Math.max(low, val), high);
}
export function clipToBox(point, box) {
    point.x = clip(point.x, 0, box.width);
    point.y = clip(point.y, 0, box.height);
}
export default clip;
//# sourceMappingURL=clip.js.map