"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.convertVolumeToStackViewport = void 0;
const cache_1 = __importStar(require("../cache"));
const enums_1 = require("../enums");
function convertVolumeToStackViewport({ viewport, options, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const volumeViewport = viewport;
        const { id, element } = volumeViewport;
        const renderingEngine = viewport.getRenderingEngine();
        const imageIdIndex = viewport.getCurrentImageIdIndex();
        const { background } = options;
        const viewportId = options.viewportId || id;
        const actorEntry = volumeViewport.getDefaultActor();
        const { uid: volumeId } = actorEntry;
        const volume = cache_1.default.getVolume(volumeId);
        if (!(volume instanceof cache_1.ImageVolume)) {
            throw new Error('Currently, you cannot decache a volume that is not an ImageVolume. So, unfortunately, volumes such as nifti  (which are basic Volume, without imageIds) cannot be decached.');
        }
        const viewportInput = {
            viewportId,
            type: enums_1.ViewportType.STACK,
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
            isAllImagesCached = volume.imageIds.every((imageId) => cache_1.default.getImage(imageId));
        }
        const volumeUsedInOtherViewports = renderingEngine
            .getVolumeViewports()
            .find((vp) => vp.hasVolumeId(volumeId));
        volume.decache(!volumeUsedInOtherViewports && isAllImagesCached);
        const stack = [...volume.imageIds].reverse();
        let imageIdIndexToJump = Math.max(volume.imageIds.length - imageIdIndex - 1, 0);
        const imageToJump = cache_1.default.getImage(stack[imageIdIndexToJump]);
        if (!imageToJump) {
            let minDistance = Infinity;
            let minDistanceIndex = null;
            stack.forEach((imageId, index) => {
                const image = cache_1.default.getImage(imageId);
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
        yield stackViewport.setStack(stack, imageIdIndexToJump !== null && imageIdIndexToJump !== void 0 ? imageIdIndexToJump : 0);
        stackViewport.render();
        return stackViewport;
    });
}
exports.convertVolumeToStackViewport = convertVolumeToStackViewport;
//# sourceMappingURL=convertVolumeToStackViewport.js.map