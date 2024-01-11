import { BaseVolumeViewport, getRenderingEngine, StackViewport, } from '@cornerstonejs/core';
export default function voiSyncCallback(synchronizerInstance, sourceViewport, targetViewport, voiModifiedEvent, options) {
    const eventDetail = voiModifiedEvent.detail;
    const { volumeId, range, invertStateChanged, invert } = eventDetail;
    const renderingEngine = getRenderingEngine(targetViewport.renderingEngineId);
    if (!renderingEngine) {
        throw new Error(`Rendering Engine does not exist: ${targetViewport.renderingEngineId}`);
    }
    const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
    const tProperties = {
        voiRange: range,
    };
    if (options?.syncInvertState && invertStateChanged) {
        tProperties.invert = invert;
    }
    if (tViewport instanceof BaseVolumeViewport) {
        tViewport.setProperties(tProperties, volumeId);
    }
    else if (tViewport instanceof StackViewport) {
        tViewport.setProperties(tProperties);
    }
    else {
        throw new Error('Viewport type not supported.');
    }
    tViewport.render();
}
//# sourceMappingURL=voiSyncCallback.js.map