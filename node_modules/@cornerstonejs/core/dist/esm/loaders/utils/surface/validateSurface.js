export function validateSurface(contourSetData) {
    const { data } = contourSetData;
    if (!data.points || !data.polys) {
        throw new Error('Invalid surface data');
    }
}
//# sourceMappingURL=validateSurface.js.map