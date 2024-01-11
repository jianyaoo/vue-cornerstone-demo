import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkContextRepresentation from './ContextRepresentation.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';
import { allocateArray } from './WidgetRepresentation.js';
import { Behavior } from './WidgetRepresentation/Constants.js';
import { RenderingTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// vtkPlaneHandleRepresentation methods
// ----------------------------------------------------------------------------

function vtkConvexFaceContextRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkConvexFaceContextRepresentation');

  // --------------------------------------------------------------------------
  // Internal polydata dataset
  // --------------------------------------------------------------------------

  model.internalPolyData = vtkPolyData.newInstance({
    mtime: 0
  });
  model.points = new Float32Array(3 * 4);
  model.cells = new Uint8Array([4, 0, 1, 2, 3]);
  model.internalPolyData.getPoints().setData(model.points, 3);
  model.internalPolyData.getPolys().setData(model.cells);
  function allocateSize(polyData, size) {
    const points = allocateArray(polyData, 'points', size).getData();
    const oldCellsSize = polyData.getPolys().getNumberOfValues();
    const cells = allocateArray(polyData, 'polys', size + 1).getData();
    if (oldCellsSize !== cells.length) {
      cells[0] = size;
      for (let i = 0; i < size; i++) {
        cells[i + 1] = i;
      }
    }
    return points;
  }

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model.mapper = vtkMapper.newInstance({
    scalarVisibility: false
  });
  model.actor = vtkActor.newInstance({
    parentProp: publicAPI
  });
  model.actor.getProperty().setOpacity(model.opacity);
  model.mapper.setInputConnection(publicAPI.getOutputPort());
  model.actor.setMapper(model.mapper);
  publicAPI.addActor(model.actor);

  // --------------------------------------------------------------------------

  publicAPI.requestData = (inData, outData) => {
    const list = publicAPI.getRepresentationStates(inData[0]);
    const validState = list.filter(state => state.getOrigin());
    const points = allocateSize(model.internalPolyData, validState.length);
    for (let i = 0; i < validState.length; i++) {
      const coords = validState[i].getOrigin();
      points[i * 3] = coords[0];
      points[i * 3 + 1] = coords[1];
      points[i * 3 + 2] = coords[2];
    }
    model.internalPolyData.modified();
    outData[0] = model.internalPolyData;
  };

  // --------------------------------------------------------------------------

  publicAPI.getSelectedState = (prop, compositeID) => {
    const state = model.inputData[0];
    const list = publicAPI.getRepresentationStates(state);

    // Update state orientation based on face
    if (state.updateFromOriginRightUp) {
      state.updateFromOriginRightUp(list[0].getOrigin(), list[list.length - 1].getOrigin(), list[1].getOrigin());
    }
    return state;
  };

  // --------------------------------------------------------------------------

  const superUpdateActorVisibility = publicAPI.updateActorVisibility;
  publicAPI.updateActorVisibility = function () {
    let renderingType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RenderingTypes.FRONT_BUFFER;
    let ctxVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let handleVisible = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    switch (model.behavior) {
      case Behavior.HANDLE:
        if (renderingType === RenderingTypes.PICKING_BUFFER) {
          model.actor.getProperty().setOpacity(1);
        } else {
          model.actor.getProperty().setOpacity(model.opacity);
        }
        break;
      case Behavior.CONTEXT:
      default:
        model.actor.getProperty().setOpacity(model.opacity);
        break;
    }
    superUpdateActorVisibility(renderingType, ctxVisible, handleVisible);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  defaultColor: [1, 0, 0.5],
  opacity: 0.2
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkContextRepresentation.extend(publicAPI, model, initialValues);
  macro.setGetArray(publicAPI, model, ['defaultColor'], 3);
  macro.get(publicAPI, model, ['mapper', 'actor']);
  macro.setGet(publicAPI, model, ['opacity']);

  // Object specific methods
  vtkConvexFaceContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkConvexFaceContextRepresentation');

// ----------------------------------------------------------------------------

var vtkConvexFaceContextRepresentation$1 = {
  newInstance,
  extend
};

export { vtkConvexFaceContextRepresentation$1 as default, extend, newInstance };
