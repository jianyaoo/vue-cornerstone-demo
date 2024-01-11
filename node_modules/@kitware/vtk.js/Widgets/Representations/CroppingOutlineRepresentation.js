import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkContextRepresentation from './ContextRepresentation.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';
import { origin } from './GlyphRepresentation.js';
import { allocateArray } from './WidgetRepresentation.js';

const {
  vtkErrorMacro
} = macro;

// prettier-ignore
const OUTLINE_ARRAY = [2, 0, 1, 2, 0, 2, 2, 0, 4, 2, 1, 3, 2, 1, 5, 2, 2, 3, 2, 2, 6, 2, 3, 7, 2, 4, 5, 2, 4, 6, 2, 5, 7, 2, 6, 7];

// ----------------------------------------------------------------------------
// vtkCroppingOutlineRepresentation methods
// ----------------------------------------------------------------------------

// Represents a box outline given 8 points as corners.
// Does not work with an arbitrary set of points. An oriented bounding box
// algorithm may be implemented in the future.
function vtkCroppingOutlineRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCroppingOutlineRepresentation');

  // --------------------------------------------------------------------------
  // Internal polydata dataset
  // --------------------------------------------------------------------------

  model.internalPolyData = vtkPolyData.newInstance({
    mtime: 0
  });
  allocateArray(model.internalPolyData, 'lines', OUTLINE_ARRAY.length).getData().set(OUTLINE_ARRAY);
  const applyOrigin = origin(publicAPI, model);

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model.mapper = vtkMapper.newInstance({
    scalarVisibility: false
  });
  model.actor = vtkActor.newInstance({
    parentProp: publicAPI
  });
  model.actor.getProperty().setEdgeColor(...model.edgeColor);
  model.mapper.setInputConnection(publicAPI.getOutputPort());
  model.actor.setMapper(model.mapper);
  publicAPI.addActor(model.actor);

  // --------------------------------------------------------------------------

  publicAPI.requestData = (inData, outData) => {
    const list = publicAPI.getRepresentationStates(inData[0]).filter(state => state.getOrigin && state.getOrigin());
    if (list.length === 8) {
      applyOrigin(model.internalPolyData, list);
      model.internalPolyData.getPoints().modified();
      model.internalPolyData.modified();
      outData[0] = model.internalPolyData;
    } else {
      vtkErrorMacro('CroppingOutlineRepresentation did not get 8 states');
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  edgeColor: [1, 1, 1]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkContextRepresentation.extend(publicAPI, model, initialValues);
  macro.setGetArray(publicAPI, model, ['edgeColor'], 3);
  macro.get(publicAPI, model, ['mapper', 'actor']);

  // Object specific methods
  vtkCroppingOutlineRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkCroppingOutlineRepresentation');

// ----------------------------------------------------------------------------

var vtkCroppingOutlineRepresentation$1 = {
  newInstance,
  extend
};

export { vtkCroppingOutlineRepresentation$1 as default, extend, newInstance };
