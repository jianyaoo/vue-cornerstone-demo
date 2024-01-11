import { n as newInstance$1 } from '../../macros2.js';
import vtkWebGPUBufferManager from './BufferManager.js';
import vtkWebGPUCellArrayMapper from './CellArrayMapper.js';
import vtkViewNode from '../SceneGraph/ViewNode.js';
import { registerOverride } from './ViewNodeFactory.js';

const {
  PrimitiveTypes
} = vtkWebGPUBufferManager;

// ----------------------------------------------------------------------------
// vtkWebGPUPolyDataMapper methods
// ----------------------------------------------------------------------------

function vtkWebGPUPolyDataMapper2D(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGPUPolyDataMapper2D');
  publicAPI.createCellArrayMapper = () => vtkWebGPUCellArrayMapper.newInstance();
  publicAPI.buildPass = prepass => {
    if (prepass) {
      model.WebGPUActor = publicAPI.getFirstAncestorOfType('vtkWebGPUActor2D');
      if (!model.renderable.getStatic()) {
        model.renderable.update();
      }
      const poly = model.renderable.getInputData();
      model.renderable.mapScalars(poly, 1.0);
      publicAPI.updateCellArrayMappers(poly);
    }
  };
  publicAPI.updateCellArrayMappers = poly => {
    const prims = [poly.getVerts(), poly.getLines(), poly.getPolys(), poly.getStrips()];

    // we instantiate a cell array mapper for each cellArray that has cells
    // and they handle the rendering of that cell array
    const cellMappers = [];
    let cellOffset = 0;
    for (let i = PrimitiveTypes.Points; i <= PrimitiveTypes.Triangles; i++) {
      if (prims[i].getNumberOfValues() > 0) {
        if (!model.primitives[i]) {
          model.primitives[i] = publicAPI.createCellArrayMapper();
        }
        const cellMapper = model.primitives[i];
        cellMapper.setCellArray(prims[i]);
        cellMapper.setCurrentInput(poly);
        cellMapper.setCellOffset(cellOffset);
        cellMapper.setPrimitiveType(i);
        cellMapper.setRenderable(model.renderable);
        cellMapper.setIs2D(true);
        cellOffset += prims[i].getNumberOfCells();
        cellMappers.push(cellMapper);
      } else {
        model.primitives[i] = null;
      }
    }
    publicAPI.prepareNodes();
    publicAPI.addMissingChildren(cellMappers);
    publicAPI.removeUnusedNodes();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    primitives: [],
    ...initialValues
  };
}

// ----------------------------------------------------------------------------
function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));

  // Inheritance
  vtkViewNode.extend(publicAPI, model, initialValues);
  model.primitives = [];

  // Object methods
  vtkWebGPUPolyDataMapper2D(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = newInstance$1(extend, 'vtkWebGPUPolyDataMapper2D');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

// Register ourself to WebGPU backend if imported
registerOverride('vtkMapper2D', newInstance);

export { index as default, extend, newInstance };
