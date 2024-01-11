import { m as macro } from '../../macros2.js';
import vtkXMLWriter from './XMLWriter.js';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkXMLImageDataWriter methods
// ----------------------------------------------------------------------------

function vtkXMLImageDataWriter(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkXMLImageDataWriter');

  // Capture "parentClass" api for internal use
  const superClass = {
    ...publicAPI
  };
  publicAPI.create = dataObject => {
    const parent = superClass.create(dataObject);
    const imageData = parent.ele('ImageData', {
      WholeExtent: dataObject.getExtent().join(' '),
      Origin: dataObject.getOrigin().join(' '),
      Spacing: dataObject.getSpacing().join(' '),
      Direction: dataObject.getDirection().join(' ')
    });
    const piece = imageData.ele('Piece', {
      Extent: dataObject.getExtent().join(' ')
    });
    publicAPI.processDataSetAttributes(piece, 'PointData', dataObject.getPointData());
    publicAPI.processDataSetAttributes(piece, 'CellData', dataObject.getCellData());
    return parent;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  dataType: 'ImageData'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkXMLWriter.extend(publicAPI, model, initialValues);
  vtkXMLImageDataWriter(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkXMLImageDataWriter');

// ----------------------------------------------------------------------------

var vtkXMLImageDataWriter$1 = {
  newInstance,
  extend
};

export { vtkXMLImageDataWriter$1 as default, extend, newInstance };
