function updateVTKImageDataWithCornerstoneImage(sourceImageData, image) {
    const pixelData = image.getPixelData();
    if (!sourceImageData.getPointData) {
        return;
    }
    const scalarData = sourceImageData
        .getPointData()
        .getScalars()
        .getData();
    if (image.color && image.rgba) {
        const newPixelData = new Uint8Array(image.columns * image.rows * 3);
        for (let i = 0; i < image.columns * image.rows; i++) {
            newPixelData[i * 3] = pixelData[i * 4];
            newPixelData[i * 3 + 1] = pixelData[i * 4 + 1];
            newPixelData[i * 3 + 2] = pixelData[i * 4 + 2];
        }
        image.rgba = false;
        image.getPixelData = () => newPixelData;
        scalarData.set(newPixelData);
    }
    else {
        scalarData.set(pixelData);
    }
    sourceImageData.modified();
}
export { updateVTKImageDataWithCornerstoneImage };
//# sourceMappingURL=updateVTKImageDataWithCornerstoneImage.js.map