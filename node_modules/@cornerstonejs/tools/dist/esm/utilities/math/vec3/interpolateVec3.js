const interpolateVec3 = (a, b, t) => {
    return [
        a[0] * (1 - t) + b[0] * t,
        a[1] * (1 - t) + b[1] * t,
        a[2] * (1 - t) + b[2] * t,
    ];
};
export { interpolateVec3 as default, interpolateVec3 };
//# sourceMappingURL=interpolateVec3.js.map