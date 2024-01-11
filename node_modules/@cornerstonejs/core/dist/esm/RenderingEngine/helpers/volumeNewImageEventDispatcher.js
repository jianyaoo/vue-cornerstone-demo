import { getImageSliceDataForVolumeViewport, triggerEvent, } from '../../utilities';
import { Events } from '../../enums';
import { getRenderingEngine } from '../getRenderingEngine';
import BaseVolumeViewport from '../BaseVolumeViewport';
const state = {};
export function resetVolumeNewImageState(viewportId) {
    if (state[viewportId] !== undefined) {
        delete state[viewportId];
    }
}
function volumeNewImageEventDispatcher(cameraEvent) {
    const { renderingEngineId, viewportId } = cameraEvent.detail;
    const renderingEngine = getRenderingEngine(renderingEngineId);
    const viewport = renderingEngine.getViewport(viewportId);
    if (!(viewport instanceof BaseVolumeViewport)) {
        throw new Error(`volumeNewImageEventDispatcher: viewport is not a BaseVolumeViewport`);
    }
    if (state[viewport.id] === undefined) {
        state[viewport.id] = 0;
    }
    const sliceData = getImageSliceDataForVolumeViewport(viewport);
    if (!sliceData) {
        console.warn(`volumeNewImageEventDispatcher: sliceData is undefined for viewport ${viewport.id}`);
        return;
    }
    const { numberOfSlices, imageIndex } = sliceData;
    if (state[viewport.id] === imageIndex) {
        return;
    }
    state[viewport.id] = imageIndex;
    const eventDetail = {
        imageIndex,
        viewportId,
        renderingEngineId,
        numberOfSlices,
    };
    triggerEvent(viewport.element, Events.VOLUME_NEW_IMAGE, eventDetail);
}
export default volumeNewImageEventDispatcher;
//# sourceMappingURL=volumeNewImageEventDispatcher.js.map