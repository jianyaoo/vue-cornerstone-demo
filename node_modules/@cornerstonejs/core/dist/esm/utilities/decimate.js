export default function decimate(list, interleave, offset = 0) {
    const interleaveIndices = [];
    for (let i = offset; i < list.length; i += interleave) {
        interleaveIndices.push(i);
    }
    return interleaveIndices;
}
//# sourceMappingURL=decimate.js.map