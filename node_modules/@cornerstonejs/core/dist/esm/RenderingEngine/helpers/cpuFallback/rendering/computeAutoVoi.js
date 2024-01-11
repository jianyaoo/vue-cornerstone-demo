export default function computeAutoVoi(viewport, image) {
    if (hasVoi(viewport)) {
        return;
    }
    const maxVoi = image.maxPixelValue * image.slope + image.intercept;
    const minVoi = image.minPixelValue * image.slope + image.intercept;
    const ww = maxVoi - minVoi;
    const wc = (maxVoi + minVoi) / 2;
    if (viewport.voi === undefined) {
        viewport.voi = {
            windowWidth: ww,
            windowCenter: wc,
        };
    }
    else {
        viewport.voi.windowWidth = ww;
        viewport.voi.windowCenter = wc;
    }
}
function hasVoi(viewport) {
    const hasLut = viewport.voiLUT && viewport.voiLUT.lut && viewport.voiLUT.lut.length > 0;
    return (hasLut ||
        (viewport.voi.windowWidth !== undefined &&
            viewport.voi.windowCenter !== undefined));
}
//# sourceMappingURL=computeAutoVoi.js.map