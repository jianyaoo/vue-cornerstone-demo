import { ViewTypes } from '../../Core/WidgetManager/Constants.js';

const ScrollingMethods = {
  MIDDLE_MOUSE_BUTTON: 0,
  LEFT_MOUSE_BUTTON: 1,
  RIGHT_MOUSE_BUTTON: 2
};

// Note: These strings are used in ResliceCursorWidget/behavior.js
// as method's names
const InteractionMethodsName = {
  TranslateAxis: 'translateAxis',
  RotateLine: 'rotateLine',
  TranslateCenter: 'translateCenter',
  TranslateCenterAndUpdatePlanes: 'translateCenterAndUpdatePlanes'
};
const defaultViewUpFromViewType = {
  [ViewTypes.YZ_PLANE]: [0, 0, 1],
  // Sagittal
  [ViewTypes.XZ_PLANE]: [0, 0, 1],
  // Coronal
  [ViewTypes.XY_PLANE]: [0, -1, 0] // Axial
};

const xyzToViewType = [ViewTypes.YZ_PLANE, ViewTypes.XZ_PLANE, ViewTypes.XY_PLANE];
const viewTypeToXYZ = {
  [ViewTypes.YZ_PLANE]: 0,
  [ViewTypes.XZ_PLANE]: 1,
  [ViewTypes.XY_PLANE]: 2
};
const planeNames = ['X', 'Y', 'Z'];
const viewTypeToPlaneName = {
  [ViewTypes.YZ_PLANE]: 'X',
  [ViewTypes.XZ_PLANE]: 'Y',
  [ViewTypes.XY_PLANE]: 'Z'
};
const planeNameToViewType = {
  X: ViewTypes.YZ_PLANE,
  Y: ViewTypes.XZ_PLANE,
  Z: ViewTypes.XY_PLANE
};
const lineNames = ['YinX', 'ZinX', 'XinY', 'ZinY', 'XinZ', 'YinZ'];
var Constants = {
  ScrollingMethods,
  InteractionMethodsName,
  xyzToViewType,
  viewTypeToXYZ,
  planeNames,
  viewTypeToPlaneName,
  planeNameToViewType,
  lineNames
};

export { InteractionMethodsName, ScrollingMethods, Constants as default, defaultViewUpFromViewType, lineNames, planeNameToViewType, planeNames, viewTypeToPlaneName, viewTypeToXYZ, xyzToViewType };
