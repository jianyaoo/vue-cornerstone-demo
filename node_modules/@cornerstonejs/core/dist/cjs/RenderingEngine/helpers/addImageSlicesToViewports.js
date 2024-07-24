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
function addImageSlicesToViewports(renderingEngine, stackInputs, viewportIds) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const viewportId of viewportIds) {
            const viewport = renderingEngine.getViewport(viewportId);
            if (!viewport) {
                throw new Error(`Viewport with Id ${viewportId} does not exist`);
            }
            if (!viewport.addImages) {
                console.warn(`Viewport with Id ${viewportId} does not have addImages. Cannot add image segmentation to this viewport.`);
                return;
            }
        }
        const addStackPromises = viewportIds.map((viewportId) => __awaiter(this, void 0, void 0, function* () {
            const viewport = renderingEngine.getViewport(viewportId);
            return viewport.addImages(stackInputs);
        }));
        yield Promise.all(addStackPromises);
    });
}
exports.default = addImageSlicesToViewports;
//# sourceMappingURL=addImageSlicesToViewports.js.map