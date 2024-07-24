import { setVolumesForViewports } from '../RenderingEngine/helpers';
import { createAndCacheVolume, getUnknownVolumeLoaderSchema, } from '../loaders/volumeLoader';
import { Events, ViewportType } from '../enums';
async function convertStackToVolumeViewport({ viewport, options, }) {
    const renderingEngine = viewport.getRenderingEngine();
    let { volumeId } = options;
    if (volumeId.split(':').length === 1) {
        const schema = getUnknownVolumeLoaderSchema();
        volumeId = `${schema}:${volumeId}`;
    }
    const { id, element } = viewport;
    const viewportId = options.viewportId || id;
    const imageIds = viewport.getImageIds();
    const prevCamera = viewport.getCamera();
    renderingEngine.enableElement({
        viewportId,
        type: ViewportType.ORTHOGRAPHIC,
        element,
        defaultOptions: {
            background: options.background,
            orientation: options.orientation,
        },
    });
    const volume = await createAndCacheVolume(volumeId, {
        imageIds,
    });
    volume.load();
    const volumeViewport = (renderingEngine.getViewport(viewportId));
    setVolumesForViewports(renderingEngine, [
        {
            volumeId,
        },
    ], [viewportId]);
    const volumeViewportNewVolumeHandler = () => {
        if (!options.orientation) {
            volumeViewport.setCamera({
                ...prevCamera,
            });
        }
        volumeViewport.render();
        element.removeEventListener(Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
    };
    const addVolumeViewportNewVolumeListener = () => {
        element.addEventListener(Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
    };
    addVolumeViewportNewVolumeListener();
    volumeViewport.render();
    return volumeViewport;
}
export { convertStackToVolumeViewport };
//# sourceMappingURL=convertStackToVolumeViewport.js.map