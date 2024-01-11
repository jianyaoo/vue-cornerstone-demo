import { m as macro } from '../../macros2.js';
import Constants from './Property2D/Constants.js';
import { Representation } from './Property/Constants.js';

const {
  DisplayLocation
} = Constants;

// ----------------------------------------------------------------------------
// vtkProperty2D methods
// ----------------------------------------------------------------------------

function vtkProperty2D(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkProperty2D');
  publicAPI.setDisplayLocationToBackground = () => publicAPI.setDisplayLocation(DisplayLocation.BACKGROUND);
  publicAPI.setDisplayLocationToForeground = () => publicAPI.setDisplayLocation(DisplayLocation.FOREGROUND);
  publicAPI.setRepresentationToWireframe = () => publicAPI.setRepresentation(Representation.WIREFRAME);
  publicAPI.setRepresentationToSurface = () => publicAPI.setRepresentation(Representation.SURFACE);
  publicAPI.setRepresentationToPoints = () => publicAPI.setRepresentation(Representation.POINTS);
  publicAPI.getRepresentationAsString = () => macro.enumToString(Representation, model.representation);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  color: [1, 1, 1],
  opacity: 1,
  pointSize: 1,
  lineWidth: 1,
  representation: Representation.SURFACE,
  displayLocation: DisplayLocation.FOREGROUND
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['opacity', 'lineWidth', 'pointSize', 'displayLocation', 'representation']);
  macro.setGetArray(publicAPI, model, ['color'], 3);

  // Object methods
  vtkProperty2D(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkProperty2D');

// ----------------------------------------------------------------------------

var vtkProperty2D$1 = {
  newInstance,
  extend,
  ...Constants
};

export { vtkProperty2D$1 as default, extend, newInstance };
