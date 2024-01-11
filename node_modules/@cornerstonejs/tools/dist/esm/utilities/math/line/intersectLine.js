function sign(x) {
    return typeof x === 'number'
        ? x
            ? x < 0
                ? -1
                : 1
            : x === x
                ? 0
                : NaN
        : NaN;
}
export default function intersectLine(line1Start, line1End, line2Start, line2End) {
    const [x1, y1] = line1Start;
    const [x2, y2] = line1End;
    const [x3, y3] = line2Start;
    const [x4, y4] = line2End;
    const a1 = y2 - y1;
    const b1 = x1 - x2;
    const c1 = x2 * y1 - x1 * y2;
    const r3 = a1 * x3 + b1 * y3 + c1;
    const r4 = a1 * x4 + b1 * y4 + c1;
    if (r3 !== 0 && r4 !== 0 && sign(r3) === sign(r4)) {
        return;
    }
    const a2 = y4 - y3;
    const b2 = x3 - x4;
    const c2 = x4 * y3 - x3 * y4;
    const r1 = a2 * x1 + b2 * y1 + c2;
    const r2 = a2 * x2 + b2 * y2 + c2;
    if (r1 !== 0 && r2 !== 0 && sign(r1) === sign(r2)) {
        return;
    }
    const denom = a1 * b2 - a2 * b1;
    let num;
    num = b1 * c2 - b2 * c1;
    const x = num / denom;
    num = a2 * c1 - a1 * c2;
    const y = num / denom;
    const intersectionPoint = [x, y];
    return intersectionPoint;
}
//# sourceMappingURL=intersectLine.js.map