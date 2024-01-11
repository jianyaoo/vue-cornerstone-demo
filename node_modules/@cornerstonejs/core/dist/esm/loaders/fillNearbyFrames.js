export function fillNearbyFrames(listener, imageQualityStatusMap, request, image, options) {
    if (!request?.nearbyRequests?.length) {
        return;
    }
    const { arrayBuffer, offset: srcOffset, type, length: frameLength, } = options.targetBuffer;
    if (!arrayBuffer || srcOffset === undefined || !type) {
        return;
    }
    const scalarData = new Float32Array(arrayBuffer);
    const bytesPerPixel = scalarData.byteLength / scalarData.length;
    const offset = options.targetBuffer.offset / bytesPerPixel;
    const src = scalarData.slice(offset, offset + frameLength);
    for (const nearbyItem of request.nearbyRequests) {
        try {
            const { itemId: targetId, imageQualityStatus } = nearbyItem;
            const targetStatus = imageQualityStatusMap.get(targetId);
            if (targetStatus !== undefined && targetStatus >= imageQualityStatus) {
                continue;
            }
            const targetOptions = listener.getLoaderImageOptions(targetId);
            const { offset: targetOffset } = targetOptions.targetBuffer;
            scalarData.set(src, targetOffset / bytesPerPixel);
            const nearbyImage = {
                ...image,
                imageQualityStatus,
            };
            listener.successCallback(targetId, nearbyImage);
            imageQualityStatusMap.set(targetId, imageQualityStatus);
        }
        catch (e) {
            console.log("Couldn't fill nearby item ", nearbyItem.itemId, e);
        }
    }
}
//# sourceMappingURL=fillNearbyFrames.js.map