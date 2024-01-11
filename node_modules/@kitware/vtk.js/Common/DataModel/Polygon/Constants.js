const EPSILON = 1e-6;
const FLOAT_EPSILON = 1.1920929e-7;
const TOLERANCE = 1e-8;
const PolygonWithPointIntersectionState = {
  FAILURE: -1,
  OUTSIDE: 0,
  INSIDE: 1,
  INTERSECTION: 2,
  ON_LINE: 3
};

export { EPSILON, FLOAT_EPSILON, PolygonWithPointIntersectionState, TOLERANCE };
