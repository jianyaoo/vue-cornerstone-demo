import { m as macro } from '../../macros2.js';
import vtkAbstractImageMapper from './AbstractImageMapper.js';
import vtkImageMapper from './ImageMapper.js';
import { F as createUninitializedBounds } from '../../Common/Core/Math/index.js';
import { intersectWithLineForPointPicking, intersectWithLineForCellPicking } from './AbstractImageMapper/helper.js';
import CoincidentTopologyHelper from './Mapper/CoincidentTopologyHelper.js';

const {
  staticOffsetAPI,
  otherStaticMethods
} = CoincidentTopologyHelper;
const {
  vtkErrorMacro,
  vtkWarningMacro
} = macro;
const {
  SlicingMode
} = vtkImageMapper;

// ----------------------------------------------------------------------------
// vtkImageArrayMapper methods
// ----------------------------------------------------------------------------

function vtkImageArrayMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageArrayMapper');

  //------------------
  // Private functions

  const _computeSliceToSubSliceMap = () => {
    const inputCollection = publicAPI.getInputData();
    if (!inputCollection || inputCollection.empty()) {
      // clear the map
      if (model.sliceToSubSliceMap.length !== 0) {
        model.sliceToSubSliceMap.length = 0;
        publicAPI.modified();
      }
      return;
    }
    if (model.sliceToSubSliceMap.length === 0 || inputCollection.getMTime() > publicAPI.getMTime()) {
      const perImageMap = inputCollection.map((image, index) => {
        const dim = image.getDimensions();
        const out = new Array(dim[model.slicingMode]);
        for (let i = 0; i < out.length; ++i) {
          out[i] = {
            imageIndex: index,
            subSlice: i
          };
        }
        return out;
      });
      model.sliceToSubSliceMap = perImageMap.flat();
      publicAPI.modified();
    }
  };
  const _superSetInputData = publicAPI.setInputData;
  const _superSetInputConnection = publicAPI.setInputConnection;

  //------------------
  // Public functions

  publicAPI.setInputData = inputData => {
    _superSetInputData(inputData);
    _computeSliceToSubSliceMap();
  };
  publicAPI.setInputConnection = function (outputPort) {
    let port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _superSetInputConnection(outputPort, port);
    _computeSliceToSubSliceMap();
  };
  publicAPI.getImage = function () {
    let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : publicAPI.getSlice();
    const inputCollection = publicAPI.getInputData();
    if (!inputCollection) {
      vtkWarningMacro('No input set.');
    } else if (slice < 0 || slice >= publicAPI.getTotalSlices()) {
      vtkWarningMacro('Invalid slice number.');
    } else {
      _computeSliceToSubSliceMap();
      return inputCollection.getItem(model.sliceToSubSliceMap[slice].imageIndex);
    }
    return null;
  };
  publicAPI.getBounds = () => {
    const image = publicAPI.getCurrentImage();
    if (!image) {
      return createUninitializedBounds();
    }
    if (!model.useCustomExtents) {
      return image.getBounds();
    }
    const ex = model.customDisplayExtent.slice();
    // use sub-slice of the current image,
    // which is the k-coordinate.
    const nSlice = publicAPI.getSubSlice();
    ex[4] = nSlice;
    ex[5] = nSlice;
    return image.extentToBounds(ex);
  };
  publicAPI.getBoundsForSlice = function () {
    let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : publicAPI.getSlice();
    let halfThickness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    const image = publicAPI.getImage(slice);
    if (!image) {
      return createUninitializedBounds();
    }
    const extent = image.getSpatialExtent();
    const nSlice = publicAPI.getSubSlice(slice);
    extent[4] = nSlice - halfThickness;
    extent[5] = nSlice + halfThickness;
    return image.extentToBounds(extent);
  };
  publicAPI.getClosestIJKAxis = () => ({
    ijkMode: model.slicingMode,
    flip: false
  });
  publicAPI.computeTotalSlices = () => {
    const inputCollection = publicAPI.getInputData();
    const collectionLength = inputCollection.getNumberOfItems();
    let slicesCount = 0;
    for (let i = 0; i < collectionLength; ++i) {
      const image = inputCollection.getItem(i);
      if (image) {
        slicesCount += image.getDimensions()[model.slicingMode];
      }
    }
    return slicesCount;
  };
  publicAPI.getTotalSlices = () => {
    _computeSliceToSubSliceMap();
    return model.sliceToSubSliceMap.length;
  };

  // set slice number in terms of imageIndex and subSlice number.
  publicAPI.setSlice = slice => {
    const inputCollection = publicAPI.getInputData();
    if (!inputCollection) {
      // No input is set
      vtkWarningMacro('No input set.');
      return;
    }
    const totalSlices = publicAPI.getTotalSlices();
    if (slice >= 0 && slice < totalSlices) {
      model.slice = slice;
      publicAPI.modified();
    } else {
      vtkErrorMacro(`Slice number out of range. Acceptable range is: [0, ${totalSlices > 0 ? totalSlices - 1 : 0}]slice <= totalSlices`);
    }
  };
  publicAPI.computeSlice = (imageIndex, subSlice) => {
    _computeSliceToSubSliceMap();
    return model.sliceToSubSliceMap.findIndex(x => x.imageIndex === imageIndex && x.subSlice === subSlice);
  };
  publicAPI.getImageIndex = function () {
    let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : publicAPI.getSlice();
    _computeSliceToSubSliceMap();
    return model.sliceToSubSliceMap[slice]?.imageIndex;
  };
  publicAPI.getSubSlice = function () {
    let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : publicAPI.getSlice();
    _computeSliceToSubSliceMap();
    return model.sliceToSubSliceMap[slice]?.subSlice;
  };
  publicAPI.getCurrentImage = () => publicAPI.getImage(publicAPI.getSlice());
  publicAPI.intersectWithLineForPointPicking = (p1, p2) => intersectWithLineForPointPicking(p1, p2, publicAPI);
  publicAPI.intersectWithLineForCellPicking = (p1, p2) => intersectWithLineForCellPicking(p1, p2, publicAPI);
}

// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  slicingMode: SlicingMode.K,
  sliceToSubSliceMap: []
};
function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  vtkAbstractImageMapper.extend(publicAPI, model, initialValues);

  // Build VTK API
  macro.get(publicAPI, model, ['slicingMode']);
  CoincidentTopologyHelper.implementCoincidentTopologyMethods(publicAPI, model);

  // Object methods
  vtkImageArrayMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImageArrayMapper');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend,
  ...staticOffsetAPI,
  ...otherStaticMethods
};

export { index as default, extend, newInstance };
