import { m as macro } from '../../macros2.js';
import vtkDataArray from '../../Common/Core/DataArray.js';
import vtkXMLWriter from './XMLWriter.js';
import { POLYDATA_FIELDS } from '../../Common/DataModel/PolyData/Constants.js';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkXMLPolyDataWriter methods
// ----------------------------------------------------------------------------

function vtkXMLPolyDataWriter(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkXMLPolyDataWriter');

  // Capture "parentClass" api for internal use
  const superClass = {
    ...publicAPI
  };
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase()).replace(/\s+/g, '');
  }
  publicAPI.create = dataObject => {
    const parent = superClass.create(dataObject);
    const polyData = parent.ele('PolyData', {});
    const piece = polyData.ele('Piece', {
      NumberOfPoints: dataObject.getPoints().getNumberOfPoints(),
      NumberOfVerts: dataObject.getNumberOfVerts(),
      NumberOfLines: dataObject.getNumberOfLines(),
      NumberOfStrips: dataObject.getNumberOfStrips(),
      NumberOfPolys: dataObject.getNumberOfPolys()
    });
    publicAPI.processDataSetAttributes(piece, 'PointData', dataObject.getPointData());
    publicAPI.processDataSetAttributes(piece, 'CellData', dataObject.getCellData());
    publicAPI.processDataArray(piece.ele('Points'), dataObject.getPoints());
    POLYDATA_FIELDS.forEach(cellType => {
      const cellTypeName = camelize(cellType);
      const cells = dataObject[`get${cellTypeName}`]();
      const connectivity = [];
      const offsets = [];
      const cellsData = cells.getData();
      let npts = cellsData[0];
      let offset = 0;
      for (let i = 0; i < cellsData.length;) {
        npts = cellsData[i++];
        for (let j = 0; j < npts; ++j) {
          connectivity.push(cellsData[i++]);
        }
        offset += npts;
        offsets.push(offset);
      }
      const connectivityDataArray = vtkDataArray.newInstance({
        numberOfComponents: 1,
        name: 'connectivity',
        values: Int32Array.from(connectivity)
      });
      const offsetsDataArray = vtkDataArray.newInstance({
        numberOfComponents: 1,
        name: 'offsets',
        values: Int32Array.from(offsets)
      });
      const cellEle = piece.ele(cellTypeName);
      publicAPI.processDataArray(cellEle, connectivityDataArray);
      publicAPI.processDataArray(cellEle, offsetsDataArray);
    });
    return parent;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  dataType: 'PolyData'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkXMLWriter.extend(publicAPI, model, initialValues);
  vtkXMLPolyDataWriter(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkXMLPolyDataWriter');

// ----------------------------------------------------------------------------

var vtkXMLPolyDataWriter$1 = {
  newInstance,
  extend
};

export { vtkXMLPolyDataWriter$1 as default, extend, newInstance };
