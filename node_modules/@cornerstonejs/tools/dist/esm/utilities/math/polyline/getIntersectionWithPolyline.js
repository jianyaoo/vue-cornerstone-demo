import { vec2 } from 'gl-matrix';
function getAllIntersectionsWithPolyline(points, p1, q1, closed = true) {
    let initialI;
    let j;
    const intersections = [];
    if (closed) {
        j = points.length - 1;
        initialI = 0;
    }
    else {
        j = 0;
        initialI = 1;
    }
    for (let i = initialI; i < points.length; i++) {
        const p2 = points[j];
        const q2 = points[i];
        if (doesIntersect(p1, q1, p2, q2)) {
            intersections.push([j, i]);
        }
        j = i;
    }
    return intersections;
}
function getIntersectionCoordinatesWithPolyline(points, p1, q1, closed = true) {
    const result = [];
    const polylineIndexes = getAllIntersectionsWithPolyline(points, p1, q1, closed);
    for (let i = 0; i < polylineIndexes.length; i++) {
        const p2 = points[polylineIndexes[i][0]];
        const q2 = points[polylineIndexes[i][1]];
        const intersection = getIntersection(p1, q1, p2, q2);
        result.push(intersection);
    }
    return result;
}
function getFirstIntersectionWithPolyline(points, p1, q1, closed = true) {
    let initialI;
    let j;
    if (closed) {
        j = points.length - 1;
        initialI = 0;
    }
    else {
        j = 0;
        initialI = 1;
    }
    for (let i = initialI; i < points.length; i++) {
        const p2 = points[j];
        const q2 = points[i];
        if (doesIntersect(p1, q1, p2, q2)) {
            return [j, i];
        }
        j = i;
    }
}
function getClosestIntersectionWithPolyline(points, p1, q1, closed = true) {
    let initialI;
    let j;
    if (closed) {
        j = points.length - 1;
        initialI = 0;
    }
    else {
        j = 0;
        initialI = 1;
    }
    const intersections = [];
    for (let i = initialI; i < points.length; i++) {
        const p2 = points[j];
        const q2 = points[i];
        if (doesIntersect(p1, q1, p2, q2)) {
            intersections.push([j, i]);
        }
        j = i;
    }
    if (intersections.length === 0) {
        return;
    }
    const distances = [];
    intersections.forEach((intersection) => {
        const intersectionPoints = [
            points[intersection[0]],
            points[intersection[1]],
        ];
        const midpoint = [
            (intersectionPoints[0][0] + intersectionPoints[1][0]) / 2,
            (intersectionPoints[0][1] + intersectionPoints[1][1]) / 2,
        ];
        distances.push(vec2.distance(midpoint, p1));
    });
    const minDistance = Math.min(...distances);
    const indexOfMinDistance = distances.indexOf(minDistance);
    return {
        segment: intersections[indexOfMinDistance],
        distance: minDistance,
    };
}
function doesIntersect(p1, q1, p2, q2) {
    let result = false;
    const orient = [
        orientation(p1, q1, p2),
        orientation(p1, q1, q2),
        orientation(p2, q2, p1),
        orientation(p2, q2, q1),
    ];
    if (orient[0] !== orient[1] && orient[2] !== orient[3]) {
        return true;
    }
    if (orient[0] === 0 && onSegment(p1, p2, q1)) {
        result = true;
    }
    else if (orient[1] === 0 && onSegment(p1, q2, q1)) {
        result = true;
    }
    else if (orient[2] === 0 && onSegment(p2, p1, q2)) {
        result = true;
    }
    else if (orient[3] === 0 && onSegment(p2, q1, q2)) {
        result = true;
    }
    return result;
}
function orientation(p, q, r) {
    const orientationValue = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (orientationValue === 0) {
        return 0;
    }
    return orientationValue > 0 ? 1 : 2;
}
function onSegment(p, q, r) {
    if (q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])) {
        return true;
    }
    return false;
}
function getIntersection(p1, q1, p2, q2) {
    const denominator = (q2[1] - p2[1]) * (q1[0] - p1[0]) - (q2[0] - p2[0]) * (q1[1] - p1[1]);
    if (denominator == 0) {
        return;
    }
    let a = p1[1] - p2[1];
    let b = p1[0] - p2[0];
    const numerator1 = (q2[0] - p2[0]) * a - (q2[1] - p2[1]) * b;
    const numerator2 = (q1[0] - p1[0]) * a - (q1[1] - p1[1]) * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    const resultX = p1[0] + a * (q1[0] - p1[0]);
    const resultY = p1[1] + a * (q1[1] - p1[1]);
    return [resultX, resultY];
}
export { getAllIntersectionsWithPolyline, getFirstIntersectionWithPolyline, getClosestIntersectionWithPolyline, getIntersectionCoordinatesWithPolyline, };
//# sourceMappingURL=getIntersectionWithPolyline.js.map