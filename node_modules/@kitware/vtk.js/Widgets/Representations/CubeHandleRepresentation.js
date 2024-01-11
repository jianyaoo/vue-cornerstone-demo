import { m as macro } from '../../macros2.js';
import vtkCubeSource from '../../Filters/Sources/CubeSource.js';
import vtkGlyphRepresentation from './GlyphRepresentation.js';

// ----------------------------------------------------------------------------
// vtkCubeHandleRepresentation methods
// ----------------------------------------------------------------------------

function vtkCubeHandleRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCubeHandleRepresentation');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
function defaultValues(initialValues) {
  return {
    _pipeline: {
      glyph: vtkCubeSource.newInstance()
    },
    ...initialValues
  };
}
function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkGlyphRepresentation.extend(publicAPI, model, defaultValues(initialValues));

  // Object specific methods
  vtkCubeHandleRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkCubeHandleRepresentation');

// ----------------------------------------------------------------------------

var vtkCubeHandleRepresentation$1 = {
  newInstance,
  extend
};

export { vtkCubeHandleRepresentation$1 as default, extend, newInstance };
