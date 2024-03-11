import cache, { ImageVolume } from '../cache';
import { ViewportType } from '../enums';
async function convertVolumeToStackViewport({ viewport, options, }) {
    const volumeViewport = viewport;
    const { id, element } = volumeViewport;
    const renderingEngine = viewport.getRenderingEngine();
    const imageIdIndex = viewport.getCurrentImageIdIndex();
    const { background } = options;
    const viewportId = options.viewportId || id;
    const actorEntry = volumeViewport.getDefaultActor();
    const { uid: volumeId } = actorEntry;
    const volume = cache.getVolume(volumeId);
    if (!(volume instanceof ImageVolume)) {
        throw new Error('Currently, you cannot decache a volume that is not an ImageVolume. So, unfortunately, volumes such as nifti  (which are basic Volume, without imageIds) cannot be decached.');
    }
    const viewportInput = {
        viewportId,
        type: ViewportType.STACK,
        element,
        defaultOptions: {
            background,
        },
    };
    renderingEngine.enableElement(viewportInput);
    const stackViewport = (renderingEngine.getViewport(viewportId));
    const hasCachedImages = volume.imageCacheOffsetMap.size > 0;
    let isAllImagesCached = false;
    if (hasCachedImages) {
        isAllImagesCached = volume.imageIds.every((imageId) => cache.getImage(imageId));
    }
    const volumeUsedInOtherViewports = renderingEngine
        .getVolumeViewports()
        .find((vp) => vp.hasVolumeId(volumeId));
    volume.decache(!volumeUsedInOtherViewports && isAllImagesCached);
    const stack = [...volume.imageIds].reverse();
    let imageIdIndexToJump = Math.max(volume.imageIds.length - imageIdIndex - 1, 0);
    const imageToJump = cache.getImage(stack[imageIdIndexToJump]);
    if (!imageToJump) {
        let minDistance = Infinity;
        let minDistanceIndex = null;
        stack.forEach((imageId, index) => {
            const image = cache.getImage(imageId);
            if (image) {
                const distance = Math.abs(imageIdIndexToJump - index);
                if (distance < minDistance) {
                    minDistance = distance;
                    minDistanceIndex = index;
                }
            }
        });
        imageIdIndexToJump = minDistanceIndex;
    }
    await stackViewport.setStack(stack, imageIdIndexToJump ?? 0);
    stackViewport.render();
    return stackViewport;
}
export { convertVolumeToStackViewport };
//# sourceMappingURL=convertVolumeToStackViewport.js.map