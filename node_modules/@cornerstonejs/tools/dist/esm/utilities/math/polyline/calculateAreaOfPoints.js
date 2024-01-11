export default function calculateAreaOfPoints(points) {
    const n = points.length;
    let area = 0.0;
    let j = n - 1;
    for (let i = 0; i < n; i++) {
        area += (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
        j = i;
    }
    return Math.abs(area / 2.0);
}
//# sourceMappingURL=calculateAreaOfPoints.js.map