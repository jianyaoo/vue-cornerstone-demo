import { m as macro } from '../../../macros2.js';
import vtkBoundingBox from '../../../Common/DataModel/BoundingBox.js';

function vtkBoundsMixin(publicAPI, model) {
  const sourceBounds = [];
  const bbox = [...vtkBoundingBox.INIT_BOUNDS];
  publicAPI.containsPoint = (x, y, z) => {
    if (Array.isArray(x)) {
      return vtkBoundingBox.containsPoint(bbox, x[0], x[1], x[2]);
    }
    return vtkBoundingBox.containsPoint(bbox, x, y, z);
  };
  publicAPI.placeWidget = bounds => {
    model.bounds = [];
    const center = [(bounds[0] + bounds[1]) / 2.0, (bounds[2] + bounds[3]) / 2.0, (bounds[4] + bounds[5]) / 2.0];
    for (let i = 0; i < 6; i++) {
      const axisCenter = center[Math.floor(i / 2)];
      sourceBounds[i] = bounds[i];
      model.bounds[i] = (bounds[i] - axisCenter) * model.placeFactor + axisCenter;
    }
    vtkBoundingBox.setBounds(bbox, model.bounds);
    publicAPI.invokeBoundsChange(model.bounds);
    publicAPI.modified();
  };
  publicAPI.setPlaceFactor = factor => {
    if (model.placeFactor !== factor) {
      model.placeFactor = factor;
      model.bounds = [];
      const center = [(sourceBounds[0] + sourceBounds[1]) / 2.0, (sourceBounds[2] + sourceBounds[3]) / 2.0, (sourceBounds[4] + sourceBounds[5]) / 2.0];
      for (let i = 0; i < 6; i++) {
        const axisCenter = center[Math.floor(i / 2)];
        model.bounds[i] = (sourceBounds[i] - axisCenter) * model.placeFactor + axisCenter;
      }
      vtkBoundingBox.setBounds(bbox, model.bounds);
      publicAPI.invokeBoundsChange(model.bounds);
      publicAPI.modified();
    }
  };
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  bounds: [-1, 1, -1, 1, -1, 1],
  placeFactor: 1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGetArray(publicAPI, model, ['bounds'], 6);
  macro.get(publicAPI, model, ['placeFactor']);
  macro.event(publicAPI, model, 'BoundsChange');
  model.bounds = model.bounds.slice();
  vtkBoundsMixin(publicAPI, model);
}

// ----------------------------------------------------------------------------

var bounds = {
  extend
};

export { bounds as default, extend };
