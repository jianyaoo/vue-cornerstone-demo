import { m as macro } from '../../macros2.js';
import vtkDataArray from '../../Common/Core/DataArray.js';
import vtkImageData from '../../Common/DataModel/ImageData.js';

const {
  vtkErrorMacro
} = macro;

// ----------------------------------------------------------------------------
// vtkSampleFunction methods
// ----------------------------------------------------------------------------

function vtkSampleFunction(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSampleFunction');

  // Capture "parentClass" api for internal use
  const superClass = {
    ...publicAPI
  };
  publicAPI.getMTime = () => {
    if (!(model.implicitFunction && model.implicitFunction.getMTime)) {
      return superClass.getMTime();
    }
    return Math.max(superClass.getMTime(), model.implicitFunction.getMTime());
  };
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const imp = model.implicitFunction;
    if (!imp) {
      vtkErrorMacro('An implicit function must be defined');
      return;
    }

    // Create a volume
    const dims = [model.sampleDimensions[0], model.sampleDimensions[1], model.sampleDimensions[2]];
    const numScalars = dims[0] * dims[1] * dims[2];
    if (numScalars < 1 || dims[1] < 2 || dims[1] < 2 || dims[2] < 2) {
      vtkErrorMacro('Bad volume dimensions');
      return;
    }
    const volume = vtkImageData.newInstance();
    const origin = [model.modelBounds[0], model.modelBounds[2], model.modelBounds[4]];
    const spacing = [(model.modelBounds[1] - model.modelBounds[0]) / (dims[0] - 1), (model.modelBounds[3] - model.modelBounds[2]) / (dims[1] - 1), (model.modelBounds[5] - model.modelBounds[4]) / (dims[2] - 1)];
    const sliceSize = dims[0] * dims[1];
    volume.setDimensions(dims);
    volume.setOrigin(origin);
    volume.setSpacing(spacing);

    // Create scalars array
    const s = macro.newTypedArray(model.pointType, numScalars);
    const scalars = vtkDataArray.newInstance({
      name: 'Scalars',
      values: s,
      numberOfComponents: 1
    });
    volume.getPointData().setScalars(scalars);

    // Now loop over volume dimensions and generate scalar values
    let sValue = 0.0;
    const xyz = [0.0, 0.0, 0.0];
    for (let k = 0; k < dims[2]; k++) {
      xyz[2] = origin[2] + k * spacing[2];
      for (let j = 0; j < dims[1]; j++) {
        xyz[1] = origin[1] + j * spacing[1];
        for (let i = 0; i < dims[0]; i++) {
          xyz[0] = origin[0] + i * spacing[0];
          sValue = imp.evaluateFunction(xyz);
          s[i + j * dims[0] + k * sliceSize] = sValue;
        }
      }
    }

    // Update output
    outData[0] = volume;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  implicitFunction: undefined,
  sampleDimensions: [50, 50, 50],
  modelBounds: [-1.0, 1.0, -1.0, 1.0, -1.0, 1.0],
  pointType: 'Float32Array'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macro.algo(publicAPI, model, 1, 1);

  // Generate macros for properties
  macro.setGetArray(publicAPI, model, ['sampleDimensions'], 3);
  macro.setGetArray(publicAPI, model, ['modelBounds'], 6);

  // Object specific methods
  vtkSampleFunction(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSampleFunction');

// ----------------------------------------------------------------------------

var vtkSampleFunction$1 = {
  newInstance,
  extend
};

export { vtkSampleFunction$1 as default, extend, newInstance };
