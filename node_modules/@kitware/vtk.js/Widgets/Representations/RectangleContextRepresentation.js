import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkContextRepresentation from './ContextRepresentation.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';
import { allocateArray } from './WidgetRepresentation.js';
import { vec3 } from 'gl-matrix';

// ----------------------------------------------------------------------------
// vtkRectangleContextRepresentation methods
// ----------------------------------------------------------------------------

function vtkRectangleContextRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRectangleContextRepresentation');

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------
  model.internalPolyData = vtkPolyData.newInstance({
    mtime: 0
  });
  model.mapper = vtkMapper.newInstance();
  model.actor = vtkActor.newInstance({
    parentProp: publicAPI
  });
  model.mapper.setInputConnection(publicAPI.getOutputPort());
  model.actor.setMapper(model.mapper);
  model.actor.getProperty().setOpacity(0.2);
  model.actor.getProperty().setColor(0, 1, 0);
  publicAPI.addActor(model.actor);

  // --------------------------------------------------------------------------

  publicAPI.setOpacity = opacity => {
    model.actor.getProperty().setOpacity(opacity);
  };

  // --------------------------------------------------------------------------

  publicAPI.requestData = (inData, outData) => {
    if (model.deleted) {
      return;
    }
    const list = publicAPI.getRepresentationStates(inData[0]);
    // FIXME: support list > 1.
    const state = list[0];
    if (state?.getVisible() && state?.getOrigin()) {
      const point1 = state.getOrigin();
      const point2 = state.getCorner();
      const diagonal = [0, 0, 0];
      vec3.subtract(diagonal, point2, point1);
      const up = state.getUp();
      const upComponent = vec3.dot(diagonal, up);
      const points = allocateArray(model.internalPolyData, 'points', 4).getData();
      points[0] = point1[0];
      points[1] = point1[1];
      points[2] = point1[2];
      points[3] = point1[0] + upComponent * up[0];
      points[4] = point1[1] + upComponent * up[1];
      points[5] = point1[2] + upComponent * up[2];
      points[6] = point2[0];
      points[7] = point2[1];
      points[8] = point2[2];
      points[9] = point2[0] - upComponent * up[0];
      points[10] = point2[1] - upComponent * up[1];
      points[11] = point2[2] - upComponent * up[2];
      if (model.drawFace) {
        const polys = new Uint32Array([4, 0, 1, 2, 3]);
        model.internalPolyData.getPolys().setData(polys, 1);
      }
      if (model.drawBorder) {
        const line = new Uint32Array([5, 0, 1, 2, 3, 0]);
        model.internalPolyData.getLines().setData(line, 1);
      }
    } else {
      model.internalPolyData.getPoints().setData([], 0);
      model.internalPolyData.getPolys().setData([], 0);
      model.internalPolyData.getLines().setData([], 0);
    }
    model.internalPolyData.modified();
    outData[0] = model.internalPolyData;
  };
  publicAPI.getSelectedState = (prop, compositeID) => model.state;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  drawBorder: false,
  drawFace: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkContextRepresentation.extend(publicAPI, model, initialValues);
  macro.setGetArray(publicAPI, model, ['color'], 1);
  macro.setGet(publicAPI, model, ['drawBorder', 'drawFace']);
  macro.get(publicAPI, model, ['mapper', 'actor']);

  // Object specific methods
  vtkRectangleContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkRectangleContextRepresentation');

// ----------------------------------------------------------------------------

var vtkRectangleContextRepresentation$1 = {
  newInstance,
  extend
};

export { vtkRectangleContextRepresentation$1 as default, extend, newInstance };
