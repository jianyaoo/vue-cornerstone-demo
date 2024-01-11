const Shading = {
  FLAT: 0,
  GOURAUD: 1,
  PHONG: 2
};
const Representation = {
  POINTS: 0,
  WIREFRAME: 1,
  SURFACE: 2
};
const Interpolation = Shading;
var PropertyConst = {
  Shading,
  Representation,
  Interpolation
};

export { Interpolation, Representation, Shading, PropertyConst as default };
