import { m as macro } from '../../macros2.js';
import vtkCubeSource from '../Sources/CubeSource.js';

const {
  vtkErrorMacro
} = macro;

// ----------------------------------------------------------------------------
// vtkImageDataOutlineFilter methods
// ----------------------------------------------------------------------------

function vtkImageDataOutlineFilter(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageDataOutlineFilter');

  // Capture "parentClass" api for internal use
  const superClass = {
    ...publicAPI
  };
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const input = inData[0];
    if (!input || !input.isA('vtkImageData')) {
      vtkErrorMacro('Invalid or missing input');
      return;
    }

    // First create a cube polydata in the index-space of the image.
    // The benefit of using `getSpatialExtent` call is that it automatically
    // takes care of 0.5 voxel padding as required by an vtkImageData representation.
    const spatialExt = input.getSpatialExtent();
    if (!spatialExt) {
      vtkErrorMacro('Unable to fetch spatial extents of input image.');
      return;
    }
    model._cubeSource.setBounds(spatialExt);

    // Then apply index-to-world transform to the cube to create the outline.
    model._cubeSource.setMatrix(input.getIndexToWorld());
    outData[0] = model._cubeSource.getOutputData();
  };
  publicAPI.getMTime = () => Math.max(superClass.getMTime(), model._cubeSource.getMTime());

  // Forward calls for [set/get]Generate[Faces/Lines] functions to cubeSource:
  publicAPI.setGenerateFaces = model._cubeSource.setGenerateFaces;
  publicAPI.setGenerateLines = model._cubeSource.setGenerateLines;
  publicAPI.getGenerateFaces = model._cubeSource.getGenerateFaces;
  publicAPI.getGenerateLines = model._cubeSource.getGenerateLines;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macro.algo(publicAPI, model, 1, 1);

  // Internal persistent objects
  model._cubeSource = vtkCubeSource.newInstance();
  macro.moveToProtected(publicAPI, model, ['cubeSource', 'tmpOut']);

  // Object specific methods
  vtkImageDataOutlineFilter(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImageDataOutlineFilter');

// ----------------------------------------------------------------------------

var vtkImageDataOutlineFilter$1 = {
  newInstance,
  extend
};

export { vtkImageDataOutlineFilter$1 as default, extend, newInstance };
