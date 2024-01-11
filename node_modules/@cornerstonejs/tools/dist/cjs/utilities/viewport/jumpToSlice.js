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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const clip_1 = __importDefault(require("../clip"));
const scroll_1 = __importDefault(require("../scroll"));
function jumpToSlice(element, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { imageIndex, debounceLoading, volumeId } = options;
        const enabledElement = (0, core_1.getEnabledElement)(element);
        if (!enabledElement) {
            throw new Error('Element has been disabled');
        }
        const { viewport } = enabledElement;
        const { imageIndex: currentImageIndex, numberOfSlices } = _getImageSliceData(viewport, debounceLoading);
        const imageIndexToJump = _getImageIndexToJump(numberOfSlices, imageIndex);
        const delta = imageIndexToJump - currentImageIndex;
        (0, scroll_1.default)(viewport, { delta, debounceLoading, volumeId });
    });
}
function _getImageSliceData(viewport, debounceLoading) {
    if (viewport instanceof core_1.StackViewport) {
        return {
            numberOfSlices: viewport.getImageIds().length,
            imageIndex: debounceLoading
                ? viewport.getTargetImageIdIndex()
                : viewport.getCurrentImageIdIndex(),
        };
    }
    else if (viewport instanceof core_1.VolumeViewport) {
        return core_1.utilities.getImageSliceDataForVolumeViewport(viewport);
    }
    else {
        throw new Error('Unsupported viewport type');
    }
}
function _getImageIndexToJump(numberOfSlices, imageIndex) {
    const lastSliceIndex = numberOfSlices - 1;
    return (0, clip_1.default)(imageIndex, 0, lastSliceIndex);
}
exports.default = jumpToSlice;
//# sourceMappingURL=jumpToSlice.js.map