const ContrastEnhanceMode = {
  NONE: 0,
  LIC: 1,
  COLOR: 2,
  BOTH: 3
};
const NoiseType = {
  UNIFORM: 0,
  GAUSSIAN: 1
};
const ColorMode = {
  BLEND: 0,
  MULTIPLY: 1
};
var Constants = {
  ColorMode,
  ContrastEnhanceMode,
  NoiseType
};

export { ColorMode, ContrastEnhanceMode, NoiseType, Constants as default };
