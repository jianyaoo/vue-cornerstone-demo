import { m as macro } from '../../../macros2.js';
import { f as vtkMath } from '../../../Common/Core/Math/index.js';
import { getPixelWorldHeightAtCoord } from '../WidgetManager.js';

// ----------------------------------------------------------------------------

function vtkOriginMixin(publicAPI, model) {
  const superClass = {
    ...publicAPI
  };
  publicAPI.translate = (dx, dy, dz) => {
    const [x, y, z] = publicAPI.getOriginByReference();
    publicAPI.setOrigin(x + dx, y + dy, z + dz);
  };
  publicAPI.getOrigin = displayScaleParams => {
    const origin = superClass.getOrigin();
    if (!model.offset) {
      return origin;
    }
    if (!displayScaleParams) {
      return vtkMath.add(origin, model.offset, origin);
    }
    const pixelWorldHeight = getPixelWorldHeightAtCoord(origin, displayScaleParams);
    const {
      rendererPixelDims
    } = displayScaleParams;
    const totalSize = Math.min(rendererPixelDims[0], rendererPixelDims[1]);
    return vtkMath.multiplyAccumulate(origin, model.offset, totalSize * pixelWorldHeight, origin);
  };
}

// ----------------------------------------------------------------------------
/**
 * offset: optional offset that can be scaled to pixel screen space.
 */
const DEFAULT_VALUES = {
  origin: null,
  offset: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGetArray(publicAPI, model, ['origin', 'offset'], 3);
  vtkOriginMixin(publicAPI, model);
}

// ----------------------------------------------------------------------------

var origin = {
  extend
};

export { origin as default, extend };
