import BaseVolumeViewport from '../BaseVolumeViewport';
async function setVolumesForViewports(renderingEngine, volumeInputs, viewportIds, immediateRender = false, suppressEvents = false) {
    viewportIds.forEach((viewportId) => {
        const viewport = renderingEngine.getViewport(viewportId);
        if (!viewport) {
            throw new Error(`Viewport with Id ${viewportId} does not exist`);
        }
        if (!(viewport instanceof BaseVolumeViewport)) {
            throw new Error('setVolumesForViewports only supports VolumeViewport and VolumeViewport3D');
        }
    });
    const setVolumePromises = viewportIds.map(async (viewportId) => {
        const viewport = renderingEngine.getViewport(viewportId);
        await viewport.setVolumes(volumeInputs, immediateRender, suppressEvents);
    });
    await Promise.all(setVolumePromises);
    return;
}
export default setVolumesForViewports;
//# sourceMappingURL=setVolumesForViewports.js.map