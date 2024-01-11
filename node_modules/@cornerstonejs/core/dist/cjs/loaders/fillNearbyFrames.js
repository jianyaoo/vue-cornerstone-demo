"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillNearbyFrames = void 0;
function fillNearbyFrames(listener, imageQualityStatusMap, request, image, options) {
    var _a;
    if (!((_a = request === null || request === void 0 ? void 0 : request.nearbyRequests) === null || _a === void 0 ? void 0 : _a.length)) {
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
            const nearbyImage = Object.assign(Object.assign({}, image), { imageQualityStatus });
            listener.successCallback(targetId, nearbyImage);
            imageQualityStatusMap.set(targetId, imageQualityStatus);
        }
        catch (e) {
            console.log("Couldn't fill nearby item ", nearbyItem.itemId, e);
        }
    }
}
exports.fillNearbyFrames = fillNearbyFrames;
//# sourceMappingURL=fillNearbyFrames.js.map