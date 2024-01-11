import computeAutoVoi from './computeAutoVoi';
import lutMatches from './lutMatches';
import generateLut from './generateLut';
export default function (image, viewport, invalidated) {
    if (image.cachedLut !== undefined &&
        image.cachedLut.windowCenter === viewport.voi.windowCenter &&
        image.cachedLut.windowWidth === viewport.voi.windowWidth &&
        lutMatches(image.cachedLut.modalityLUT, viewport.modalityLUT) &&
        lutMatches(image.cachedLut.voiLUT, viewport.voiLUT) &&
        image.cachedLut.invert === viewport.invert &&
        invalidated !== true) {
        return image.cachedLut.lutArray;
    }
    computeAutoVoi(viewport, image);
    generateLut(image, viewport.voi.windowWidth, viewport.voi.windowCenter, viewport.invert, viewport.modalityLUT, viewport.voiLUT);
    image.cachedLut.windowWidth = viewport.voi.windowWidth;
    image.cachedLut.windowCenter = viewport.voi.windowCenter;
    image.cachedLut.invert = viewport.invert;
    image.cachedLut.voiLUT = viewport.voiLUT;
    image.cachedLut.modalityLUT = viewport.modalityLUT;
    return image.cachedLut.lutArray;
}
//# sourceMappingURL=getLut.js.map