export default function getViewportImageCornersInWorld(viewport) {
    const { imageData, dimensions } = viewport.getImageData();
    const { canvas } = viewport;
    const ratio = window.devicePixelRatio;
    const topLeftCanvas = [0, 0];
    const topRightCanvas = [canvas.width / ratio, 0];
    const bottomRightCanvas = [
        canvas.width / ratio,
        canvas.height / ratio,
    ];
    const bottomLeftCanvas = [0, canvas.height / ratio];
    const topLeftWorld = viewport.canvasToWorld(topLeftCanvas);
    const topRightWorld = viewport.canvasToWorld(topRightCanvas);
    const bottomRightWorld = viewport.canvasToWorld(bottomRightCanvas);
    const bottomLeftWorld = viewport.canvasToWorld(bottomLeftCanvas);
    const topLeftImage = imageData.worldToIndex(topLeftWorld);
    const topRightImage = imageData.worldToIndex(topRightWorld);
    const bottomRightImage = imageData.worldToIndex(bottomRightWorld);
    const bottomLeftImage = imageData.worldToIndex(bottomLeftWorld);
    return _getStackViewportImageCorners({
        dimensions,
        imageData,
        topLeftImage,
        topRightImage,
        bottomRightImage,
        bottomLeftImage,
        topLeftWorld,
        topRightWorld,
        bottomRightWorld,
        bottomLeftWorld,
    });
}
function _getStackViewportImageCorners({ dimensions, imageData, topLeftImage, topRightImage, bottomRightImage, bottomLeftImage, topLeftWorld, topRightWorld, bottomRightWorld, bottomLeftWorld, }) {
    const topLeftImageWorld = _isInBounds(topLeftImage, dimensions)
        ? topLeftWorld
        : imageData.indexToWorld([0, 0, 0]);
    const topRightImageWorld = _isInBounds(topRightImage, dimensions)
        ? topRightWorld
        : imageData.indexToWorld([dimensions[0] - 1, 0, 0]);
    const bottomRightImageWorld = _isInBounds(bottomRightImage, dimensions)
        ? bottomRightWorld
        : imageData.indexToWorld([
            dimensions[0] - 1,
            dimensions[1] - 1,
            0,
        ]);
    const bottomLeftImageWorld = _isInBounds(bottomLeftImage, dimensions)
        ? bottomLeftWorld
        : imageData.indexToWorld([0, dimensions[1] - 1, 0]);
    return [
        topLeftImageWorld,
        topRightImageWorld,
        bottomLeftImageWorld,
        bottomRightImageWorld,
    ];
}
function _isInBounds(imageCoord, dimensions) {
    return (imageCoord[0] > 0 ||
        imageCoord[0] < dimensions[0] - 1 ||
        imageCoord[1] > 0 ||
        imageCoord[1] < dimensions[1] - 1 ||
        imageCoord[2] > 0 ||
        imageCoord[2] < dimensions[2] - 1);
}
//# sourceMappingURL=getViewportImageCornersInWorld.js.map