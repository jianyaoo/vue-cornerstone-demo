"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterViewportsWithFrameOfReferenceUID(viewports, FrameOfReferenceUID) {
    const numViewports = viewports.length;
    const viewportsWithFrameOfReferenceUID = [];
    for (let vp = 0; vp < numViewports; vp++) {
        const viewport = viewports[vp];
        if (viewport.getFrameOfReferenceUID() === FrameOfReferenceUID) {
            viewportsWithFrameOfReferenceUID.push(viewport);
        }
    }
    return viewportsWithFrameOfReferenceUID;
}
exports.default = filterViewportsWithFrameOfReferenceUID;
//# sourceMappingURL=filterViewportsWithFrameOfReferenceUID.js.map