import { vec2 } from 'gl-matrix';
const pointsAreWithinCloseContourProximity = (p1, p2, closeContourProximity) => {
    return vec2.dist(p1, p2) < closeContourProximity;
};
export default pointsAreWithinCloseContourProximity;
//# sourceMappingURL=pointsAreWithinCloseContourProximity.js.map