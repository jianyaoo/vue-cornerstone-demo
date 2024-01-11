const ViewTypes = {
  DEFAULT: 0,
  GEOMETRY: 1,
  SLICE: 2,
  VOLUME: 3,
  YZ_PLANE: 4,
  // Sagittal
  XZ_PLANE: 5,
  // Coronal
  XY_PLANE: 6 // Axial
};

const RenderingTypes = {
  PICKING_BUFFER: 0,
  FRONT_BUFFER: 1
};
const CaptureOn = {
  MOUSE_MOVE: 0,
  MOUSE_RELEASE: 1
};
var WidgetManagerConst = {
  ViewTypes,
  RenderingTypes,
  CaptureOn
};

export { CaptureOn, RenderingTypes, ViewTypes, WidgetManagerConst as default };
