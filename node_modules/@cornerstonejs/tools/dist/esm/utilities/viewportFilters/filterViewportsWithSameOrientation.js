import { utilities as csUtils } from '@cornerstonejs/core';
export function filterViewportsWithSameOrientation(viewports, camera) {
    return viewports.filter((viewport) => {
        const vpCamera = viewport.getCamera();
        return (csUtils.isEqual(vpCamera.viewPlaneNormal, camera.viewPlaneNormal) &&
            csUtils.isEqual(vpCamera.viewUp, camera.viewUp));
    });
}
export default filterViewportsWithSameOrientation;
//# sourceMappingURL=filterViewportsWithSameOrientation.js.map