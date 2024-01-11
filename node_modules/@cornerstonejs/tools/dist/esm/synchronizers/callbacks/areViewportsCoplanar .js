import { vec3 } from 'gl-matrix';
export default function areViewportsCoplanar(viewport1, viewport2) {
    const { viewPlaneNormal: viewPlaneNormal1 } = viewport1.getCamera();
    const { viewPlaneNormal: viewPlaneNormal2 } = viewport2.getCamera();
    const dotProducts = vec3.dot(viewPlaneNormal1, viewPlaneNormal2);
    return Math.abs(dotProducts) > 0.9;
}
//# sourceMappingURL=areViewportsCoplanar%20.js.map