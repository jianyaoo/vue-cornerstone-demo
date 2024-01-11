import { getAllIntersectionsWithPolyline } from './getIntersectionWithPolyline';
export default function pointInPolyline(points, point, pointEnd) {
    const intersections = getAllIntersectionsWithPolyline(points, point, [
        point[0],
        pointEnd[1],
    ]);
    if (intersections.length % 2 === 0) {
        return false;
    }
    return true;
}
//# sourceMappingURL=pointInPolyline.js.map