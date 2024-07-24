"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStackToVolumeViewport = void 0;
const helpers_1 = require("../RenderingEngine/helpers");
const volumeLoader_1 = require("../loaders/volumeLoader");
const enums_1 = require("../enums");
function convertStackToVolumeViewport({ viewport, options, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const renderingEngine = viewport.getRenderingEngine();
        let { volumeId } = options;
        if (volumeId.split(':').length === 1) {
            const schema = (0, volumeLoader_1.getUnknownVolumeLoaderSchema)();
            volumeId = `${schema}:${volumeId}`;
        }
        const { id, element } = viewport;
        const viewportId = options.viewportId || id;
        const imageIds = viewport.getImageIds();
        const prevCamera = viewport.getCamera();
        renderingEngine.enableElement({
            viewportId,
            type: enums_1.ViewportType.ORTHOGRAPHIC,
            element,
            defaultOptions: {
                background: options.background,
                orientation: options.orientation,
            },
        });
        const volume = yield (0, volumeLoader_1.createAndCacheVolume)(volumeId, {
            imageIds,
        });
        volume.load();
        const volumeViewport = (renderingEngine.getViewport(viewportId));
        (0, helpers_1.setVolumesForViewports)(renderingEngine, [
            {
                volumeId,
            },
        ], [viewportId]);
        const volumeViewportNewVolumeHandler = () => {
            if (!options.orientation) {
                volumeViewport.setCamera(Object.assign({}, prevCamera));
            }
            volumeViewport.render();
            element.removeEventListener(enums_1.Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
        };
        const addVolumeViewportNewVolumeListener = () => {
            element.addEventListener(enums_1.Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
        };
        addVolumeViewportNewVolumeListener();
        volumeViewport.render();
        return volumeViewport;
    });
}
exports.convertStackToVolumeViewport = convertStackToVolumeViewport;
//# sourceMappingURL=convertStackToVolumeViewport.js.map