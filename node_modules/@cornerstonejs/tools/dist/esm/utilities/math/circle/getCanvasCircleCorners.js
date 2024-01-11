import { distanceToPoint } from '../point';
export default function getCanvasCircleCorners(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    const radius = distanceToPoint(center, end);
    const topLeft = [center[0] - radius, center[1] - radius];
    const bottomRight = [center[0] + radius, center[1] + radius];
    return [topLeft, bottomRight];
}
//# sourceMappingURL=getCanvasCircleCorners.js.map