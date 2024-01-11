"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterViewportsWithSameOrientation = void 0;
const core_1 = require("@cornerstonejs/core");
function filterViewportsWithSameOrientation(viewports, camera) {
    return viewports.filter((viewport) => {
        const vpCamera = viewport.getCamera();
        return (core_1.utilities.isEqual(vpCamera.viewPlaneNormal, camera.viewPlaneNormal) &&
            core_1.utilities.isEqual(vpCamera.viewUp, camera.viewUp));
    });
}
exports.filterViewportsWithSameOrientation = filterViewportsWithSameOrientation;
exports.default = filterViewportsWithSameOrientation;
//# sourceMappingURL=filterViewportsWithSameOrientation.js.map