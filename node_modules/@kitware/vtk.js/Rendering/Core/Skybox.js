import { m as macro } from '../../macros2.js';
import vtkActor from './Actor.js';

// ----------------------------------------------------------------------------
// vtkSkybox methods
// ----------------------------------------------------------------------------

function vtkSkybox(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSkybox');
  publicAPI.getIsOpaque = () => true;
  publicAPI.hasTranslucentPolygonalGeometry = () => false;
  publicAPI.getSupportsSelection = () => false;
}

// ----------------------------------------------------------------------------
// Object fSkyboxy
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  format: 'box'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkActor.extend(publicAPI, model, initialValues);

  // Build VTK API
  macro.setGet(publicAPI, model, ['format' // can be box or background, in the future sphere, floor as well
  ]);

  // Object methods
  vtkSkybox(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSkybox');

// ----------------------------------------------------------------------------

var vtkSkybox$1 = {
  newInstance,
  extend
};

export { vtkSkybox$1 as default, extend, newInstance };
