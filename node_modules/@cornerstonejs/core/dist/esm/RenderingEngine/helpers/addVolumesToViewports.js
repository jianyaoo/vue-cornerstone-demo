import BaseVolumeViewport from '../BaseVolumeViewport';
async function addVolumesToViewports(renderingEngine, volumeInputs, viewportIds, immediateRender = false, suppressEvents = false) {
    for (const viewportId of viewportIds) {
        const viewport = renderingEngine.getViewport(viewportId);
        if (!viewport) {
            throw new Error(`Viewport with Id ${viewportId} does not exist`);
        }
        if (!(viewport instanceof BaseVolumeViewport)) {
            console.warn(`Viewport with Id ${viewportId} is not a BaseVolumeViewport. Cannot add volume to this viewport.`);
            return;
        }
    }
    const addVolumePromises = viewportIds.map(async (viewportId) => {
        const viewport = renderingEngine.getViewport(viewportId);
        await viewport.addVolumes(volumeInputs, immediateRender, suppressEvents);
    });
    await Promise.all(addVolumePromises);
    return;
}
export default addVolumesToViewports;
//# sourceMappingURL=addVolumesToViewports.js.map