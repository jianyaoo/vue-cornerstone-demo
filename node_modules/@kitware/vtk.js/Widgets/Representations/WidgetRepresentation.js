import { m as macro } from '../../macros2.js';
import vtkProp from '../../Rendering/Core/Prop.js';
import vtkCellArray from '../../Common/Core/CellArray.js';
import vtkDataArray from '../../Common/Core/DataArray.js';
import vtkPoints from '../../Common/Core/Points.js';
import { Behavior } from './WidgetRepresentation/Constants.js';
import { RenderingTypes } from '../Core/WidgetManager/Constants.js';
import { CATEGORIES } from '../../Rendering/Core/Mapper/CoincidentTopologyHelper.js';
import { POLYDATA_FIELDS } from '../../Common/DataModel/PolyData/Constants.js';

const {
  vtkErrorMacro,
  vtkWarningMacro
} = macro;

// ----------------------------------------------------------------------------
const STYLE_CATEGORIES = ['active', 'inactive', 'static'];
function applyCoincidentTopologyParametersToMapper(mapper, parameters) {
  if (mapper && mapper.setResolveCoincidentTopologyToPolygonOffset) {
    mapper.setResolveCoincidentTopologyToPolygonOffset();
    CATEGORIES.forEach(category => {
      if (parameters[category]) {
        const methodName = `setRelativeCoincidentTopology${category}OffsetParameters`;
        if (mapper[methodName]) {
          const {
            factor,
            offset
          } = parameters[category];
          mapper[methodName](factor, offset);
        }
      }
    });
  }
}
function mergeStyles(elementNames) {
  for (var _len = arguments.length, stylesToMerge = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    stylesToMerge[_key - 1] = arguments[_key];
  }
  const newStyleObject = {
    active: {},
    inactive: {},
    static: {}
  };
  STYLE_CATEGORIES.forEach(category => {
    const cat = newStyleObject[category];
    elementNames.forEach(name => {
      if (!cat[name]) {
        cat[name] = {};
      }
      stylesToMerge.filter(s => s && s[category] && s[category][name]).forEach(s => Object.assign(cat[name], s[category][name]));
    });
  });
  return newStyleObject;
}

// ----------------------------------------------------------------------------

function applyStyles(pipelines, styles, activeActor) {
  if (!activeActor) {
    // static
    Object.keys(styles.static).forEach(name => {
      if (pipelines[name]) {
        pipelines[name].actor.getProperty().set(styles.static[name]);
      }
    });
    // inactive
    Object.keys(styles.inactive).forEach(name => {
      if (pipelines[name]) {
        pipelines[name].actor.getProperty().set(styles.inactive[name]);
      }
    });
  } else {
    Object.keys(pipelines).forEach(name => {
      const style = pipelines[name].actor === activeActor ? styles.active[name] : styles.inactive[name];
      if (style) {
        pipelines[name].actor.getProperty().set(style);
      }
    });
  }
}

// ----------------------------------------------------------------------------

function connectPipeline(pipeline) {
  let source = pipeline.source;
  if (pipeline.filter) {
    if (source.isA('vtkDataSet')) {
      pipeline.filter.setInputData(source);
    } else {
      pipeline.filter.setInputConnection(source.getOutputPort());
    }
    source = pipeline.filter;
  }
  if (source) {
    if (source.isA('vtkDataSet')) {
      pipeline.mapper.setInputData(source);
    } else {
      pipeline.mapper.setInputConnection(source.getOutputPort());
    }
  }
  if (pipeline.glyph) {
    pipeline.mapper.setInputConnection(pipeline.glyph.getOutputPort(), 1);
  }
  pipeline.actor.setMapper(pipeline.mapper);
}

// Internal convenient function to create a data array:
function allocateArray(polyData, name, numberOfTuples, dataType, numberOfComponents) {
  // Check first whether name is points, verts, lines, polys, otherwise it is a point data array.
  let dataArray = polyData[`get${macro.capitalize(name)}`]?.() || polyData.getPointData().getArrayByName(name);
  if (!dataArray || dataType !== undefined && dataArray.getDataType() !== dataType || numberOfComponents !== undefined && dataArray.getNumberOfComponents() !== numberOfComponents) {
    let arrayType = vtkDataArray;
    let arrayDataType = dataType;
    let arrayNumberOfComponents = numberOfComponents;
    if (name === 'points') {
      arrayType = vtkPoints;
      arrayDataType = arrayDataType ?? 'Float32Array';
      arrayNumberOfComponents = numberOfComponents ?? 3;
    } else if (POLYDATA_FIELDS.includes(name)) {
      arrayType = vtkCellArray;
      arrayDataType = arrayDataType ?? 'Uint16Array';
      arrayNumberOfComponents = numberOfComponents ?? 1;
    } else {
      // data array
      arrayDataType = arrayDataType ?? 'Float32Array';
      arrayNumberOfComponents = numberOfComponents ?? 1;
    }
    dataArray = arrayType.newInstance({
      name,
      dataType: arrayDataType,
      numberOfComponents: arrayNumberOfComponents,
      size: arrayNumberOfComponents * numberOfTuples,
      empty: numberOfTuples === 0
    });
    if (name === 'points' || POLYDATA_FIELDS.includes(name)) {
      polyData[`set${macro.capitalize(name)}`](dataArray);
    } else {
      polyData.getPointData().addArray(dataArray);
    }
  } else if (dataArray.getNumberOfTuples() !== numberOfTuples) {
    dataArray.resize(numberOfTuples);
  }
  return dataArray;
}

// ----------------------------------------------------------------------------
// vtkWidgetRepresentation
// ----------------------------------------------------------------------------

function vtkWidgetRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWidgetRepresentation');

  // Internal cache
  const cache = {
    mtimes: {},
    states: []
  };
  model._onCoincidentTopologyParametersChanged = () => {
    publicAPI.getActors().forEach(actor => {
      applyCoincidentTopologyParametersToMapper(actor.getMapper(), model.coincidentTopologyParameters);
    });
  };

  // --------------------------------------------------------------------------
  publicAPI.getActors = () => model.actors;
  publicAPI.getNestedProps = publicAPI.getActors;
  // --------------------------------------------------------------------------

  publicAPI.setLabels = function () {
    for (var _len2 = arguments.length, labels = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      labels[_key2] = arguments[_key2];
    }
    if (labels.length === 1) {
      model.labels = [].concat(labels[0]);
    } else {
      model.labels = labels;
    }
    publicAPI.modified();
  };
  publicAPI.getRepresentationStates = function () {
    let input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : model.inputData[0];
    if (cache.mtimes.representation === publicAPI.getMTime() && cache.mtimes.input === input.getMTime()) {
      return cache.states;
    }

    // Reinitialize cache
    cache.mtimes.representation = publicAPI.getMTime();
    cache.mtimes.input = input.getMTime();
    cache.states = [];

    // Fill states that are going to be used in the representation
    model.labels.forEach(name => {
      cache.states = cache.states.concat(input.getStatesWithLabel(name) || []);
    });
    return cache.states;
  };
  publicAPI.getSelectedState = (prop, compositeID) => {
    const representationStates = publicAPI.getRepresentationStates();
    if (compositeID < representationStates.length) {
      return representationStates[compositeID];
    }
    vtkErrorMacro(`Representation ${publicAPI.getClassName()} should implement getSelectedState(prop, compositeID) method.`);
    return null;
  };
  publicAPI.updateActorVisibility = function () {
    let renderingType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RenderingTypes.FRONT_BUFFER;
    let ctxVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let handleVisible = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let otherFlag = true;
    switch (model.behavior) {
      case Behavior.HANDLE:
        otherFlag = renderingType === RenderingTypes.PICKING_BUFFER || handleVisible;
        break;
      case Behavior.CONTEXT:
        otherFlag = ctxVisible;
        break;
      default:
        otherFlag = true;
        break;
    }
    const visibilityFlag = otherFlag;
    for (let i = 0; i < model.actors.length; i++) {
      if (model.visibilityFlagArray) {
        model.actors[i].setVisibility(visibilityFlag && model.visibilityFlagArray[i]);
      } else {
        model.actors[i].setVisibility(visibilityFlag);
      }
    }
    if (model.alwaysVisibleActors) {
      for (let i = 0; i < model.alwaysVisibleActors.length; i++) {
        model.alwaysVisibleActors[i].setVisibility(true);
      }
    }
  };

  // Add warning to model.actors.push
  model.actors.push = function () {
    vtkWarningMacro('You should use publicAPI.addActor() to initialize the actor properly');
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    args.forEach(actor => publicAPI.addActor(actor));
  };
  publicAPI.addActor = actor => {
    applyCoincidentTopologyParametersToMapper(actor.getMapper(), model.coincidentTopologyParameters);
    Array.prototype.push.apply(model.actors, [actor]);
  };

  // Make sure setting the labels at build time works with string/array...
  publicAPI.setLabels(model.labels);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    activeScaleFactor: 1.2,
    activeColor: 1,
    useActiveColor: true,
    actors: [],
    labels: [],
    behavior: Behavior.CONTEXT,
    coincidentTopologyParameters: {
      Point: {
        factor: -1.0,
        offset: -1.0
      },
      Line: {
        factor: -1.0,
        offset: -1.0
      },
      Polygon: {
        factor: -1.0,
        offset: -1.0
      }
    },
    scaleInPixels: false,
    displayScaleParams: {
      dispHeightFactor: 1,
      cameraPosition: [0, 0, 0],
      cameraDir: [1, 0, 0],
      isParallel: false,
      rendererPixelDims: [1, 1]
    },
    _internalArrays: {},
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Object methods
  vtkProp.extend(publicAPI, model, defaultValues(initialValues));
  macro.algo(publicAPI, model, 1, 1);
  macro.get(publicAPI, model, ['labels', 'displayScaleParams', 'coincidentTopologyParameters']);
  macro.set(publicAPI, model, [{
    type: 'object',
    name: 'displayScaleParams'
  }, {
    type: 'object',
    name: 'coincidentTopologyParameters'
  }]);
  macro.setGet(publicAPI, model, ['scaleInPixels', 'activeScaleFactor', 'activeColor', 'useActiveColor']);

  // Object specific methods
  vtkWidgetRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkWidgetRepresentation$1 = {
  extend,
  mergeStyles,
  applyStyles,
  connectPipeline
};

export { allocateArray, applyStyles, connectPipeline, vtkWidgetRepresentation$1 as default, extend, mergeStyles };
