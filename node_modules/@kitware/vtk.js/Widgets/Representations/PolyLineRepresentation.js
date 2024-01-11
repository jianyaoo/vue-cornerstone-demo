import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import { B as areEquals } from '../../Common/Core/Math/index.js';
import vtkBoundingBox from '../../Common/DataModel/BoundingBox.js';
import vtkTubeFilter from '../../Filters/General/TubeFilter.js';
import { getPixelWorldHeightAtCoord } from '../Core/WidgetManager.js';
import vtkWidgetRepresentation, { allocateArray } from './WidgetRepresentation.js';
import { RenderingTypes } from '../Core/WidgetManager/Constants.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';

// ----------------------------------------------------------------------------
// vtkPolyLineRepresentation methods
// ----------------------------------------------------------------------------

function vtkPolyLineRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPolyLineRepresentation');
  const superClass = {
    ...publicAPI
  };

  // --------------------------------------------------------------------------
  // Internal polydata dataset
  // --------------------------------------------------------------------------
  const internalPolyData = vtkPolyData.newInstance({
    mtime: 0
  });
  function allocateSize(polyData, size) {
    let closePolyLine = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let points = null;
    if (size < 2) {
      // FIXME: Why 1 point and not 0 ?
      points = allocateArray(polyData, 'points', 1).getData();
      points.set([0, 0, 0]);
      allocateArray(polyData, 'lines', 0).getData();
    } else if (!polyData.getPoints() || polyData.getPoints().length !== size * 3) {
      points = allocateArray(polyData, 'points', size).getData();
      const cellSize = size + (closePolyLine ? 1 : 0);
      if (polyData.getLines().getNumberOfCells() !== 1 || polyData.getLines().getCellSizes()[0] !== cellSize) {
        const lines = allocateArray(polyData, 'lines', cellSize + 1); // +1 for the number of points
        const cellData = lines.getData();
        cellData[0] = cellSize;
        for (let i = 1; i <= cellSize; i++) {
          cellData[i] = i - 1;
        }
        if (closePolyLine) {
          cellData[cellSize] = 0;
        }
        lines.setData(cellData);
      }
    }
    return points;
  }

  /**
   * Change the line/tube thickness.
   * @param {number} lineThickness
   */
  function applyLineThickness(lineThickness) {
    let scaledLineThickness = lineThickness;
    if (publicAPI.getScaleInPixels() && internalPolyData) {
      const center = vtkBoundingBox.getCenter(internalPolyData.getBounds());
      scaledLineThickness *= getPixelWorldHeightAtCoord(center, model.displayScaleParams);
    }
    model._pipelines.tubes.filter.setRadius(scaledLineThickness);
  }

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model._pipelines = {
    tubes: {
      source: publicAPI,
      filter: vtkTubeFilter.newInstance({
        radius: model.lineThickness,
        numberOfSides: 12,
        capping: false
      }),
      mapper: vtkMapper.newInstance(),
      actor: vtkActor.newInstance({
        parentProp: publicAPI
      })
    }
  };
  vtkWidgetRepresentation.connectPipeline(model._pipelines.tubes);
  publicAPI.addActor(model._pipelines.tubes.actor);

  // --------------------------------------------------------------------------
  publicAPI.requestData = (inData, outData) => {
    const state = inData[0];
    outData[0] = internalPolyData;

    // Remove invalid and coincident points for tube filter.
    const list = publicAPI.getRepresentationStates(state).reduce((subStates, subState) => {
      const subStateOrigin = subState.getOrigin && subState.getOrigin() ? subState.getOrigin() : null;
      const previousSubStateOrigin = subStates.length && subStates[subStates.length - 1].getOrigin();
      if (!subStateOrigin || previousSubStateOrigin && areEquals(subStateOrigin, previousSubStateOrigin)) {
        return subStates;
      }
      subStates.push(subState);
      return subStates;
    }, []);
    const size = list.length;
    const points = allocateSize(outData[0], size, model.closePolyLine && size > 2);
    if (points) {
      for (let i = 0; i < size; i++) {
        const coords = list[i].getOrigin();
        points[i * 3] = coords[0];
        points[i * 3 + 1] = coords[1];
        points[i * 3 + 2] = coords[2];
      }
    }
    outData[0].getPoints().modified();
    outData[0].modified();
    const lineThickness = state.getLineThickness?.() ?? model.lineThickness;
    applyLineThickness(lineThickness);
  };

  /**
   * When mousing over the line, if behavior != CONTEXT,
   * returns the parent state.
   * @param {object} prop
   * @param {number} compositeID
   * @returns {object}
   */
  publicAPI.getSelectedState = (prop, compositeID) => model.inputData[0];
  publicAPI.updateActorVisibility = (renderingType, ctxVisible, hVisible) => {
    const state = model.inputData[0];

    // Make lines/tubes thicker for picking
    let lineThickness = state.getLineThickness?.() ?? model.lineThickness;
    if (renderingType === RenderingTypes.PICKING_BUFFER) {
      lineThickness = Math.max(4, lineThickness);
    }
    applyLineThickness(lineThickness);
    return superClass.updateActorVisibility(renderingType, ctxVisible, hVisible);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  threshold: Number.EPSILON,
  closePolyLine: false,
  lineThickness: 2,
  scaleInPixels: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const newDefault = {
    ...DEFAULT_VALUES,
    ...initialValues
  };
  vtkWidgetRepresentation.extend(publicAPI, model, newDefault);
  macro.setGet(publicAPI, model, ['threshold', 'closePolyLine', 'lineThickness']);
  vtkPolyLineRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPolyLineRepresentation');

// ----------------------------------------------------------------------------

var vtkPolyLineRepresentation$1 = {
  newInstance,
  extend
};

export { vtkPolyLineRepresentation$1 as default, extend, newInstance };
