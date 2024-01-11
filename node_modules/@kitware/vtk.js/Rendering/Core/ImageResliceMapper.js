import CoincidentTopologyHelper from './Mapper/CoincidentTopologyHelper.js';
import Constants from './ImageResliceMapper/Constants.js';
import { m as macro } from '../../macros2.js';
import vtkAbstractImageMapper from './AbstractImageMapper.js';
import vtkBoundingBox from '../../Common/DataModel/BoundingBox.js';

const {
  SlabTypes
} = Constants;
const {
  staticOffsetAPI,
  otherStaticMethods
} = CoincidentTopologyHelper;

// ----------------------------------------------------------------------------
// vtkImageResliceMapper methods
// ----------------------------------------------------------------------------

function vtkImageResliceMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageResliceMapper');
  publicAPI.getBounds = () => {
    let bds = [...vtkBoundingBox.INIT_BOUNDS];
    const image = publicAPI.getInputData();
    if (publicAPI.getSlicePolyData()) {
      bds = publicAPI.getSlicePolyData().getBounds();
    } else if (image) {
      bds = image.getBounds();
      if (publicAPI.getSlicePlane()) {
        vtkBoundingBox.cutWithPlane(bds, publicAPI.getSlicePlane().getOrigin(), publicAPI.getSlicePlane().getNormal());
      }
    }
    return bds;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  slabThickness: 0.0,
  slabTrapezoidIntegration: 0,
  slabType: SlabTypes.MEAN,
  slicePlane: null,
  slicePolyData: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  vtkAbstractImageMapper.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['slabThickness', 'slabTrapezoidIntegration', 'slabType', 'slicePlane', 'slicePolyData']);
  CoincidentTopologyHelper.implementCoincidentTopologyMethods(publicAPI, model);

  // Object methods
  vtkImageResliceMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImageResliceMapper');

// ----------------------------------------------------------------------------

var vtkImageResliceMapper$1 = {
  newInstance,
  extend,
  ...staticOffsetAPI,
  ...otherStaticMethods
};

export { vtkImageResliceMapper$1 as default, extend, newInstance };
