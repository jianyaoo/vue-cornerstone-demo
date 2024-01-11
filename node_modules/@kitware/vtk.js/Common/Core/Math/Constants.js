const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const IDENTITY_3X3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const EPSILON = 1e-6;
const VTK_SMALL_NUMBER = 1.0e-12;
var Constants = {
  IDENTITY,
  IDENTITY_3X3,
  EPSILON,
  VTK_SMALL_NUMBER
};

export { EPSILON, IDENTITY, IDENTITY_3X3, VTK_SMALL_NUMBER, Constants as default };
