import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkClosedPolyLineToSurfaceFilter from '../../Filters/General/ClosedPolyLineToSurfaceFilter.js';
import vtkCubeSource from '../../Filters/Sources/CubeSource.js';
import vtkCutter from '../../Filters/Core/Cutter.js';
import vtkCylinderSource from '../../Filters/Sources/CylinderSource.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import vtkMatrixBuilder from '../../Common/Core/MatrixBuilder.js';
import vtkPixelSpaceCallbackMapper from '../../Rendering/Core/PixelSpaceCallbackMapper.js';
import vtkPlane from '../../Common/DataModel/Plane.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';
import vtkSphereSource from '../../Filters/Sources/SphereSource.js';
import vtkStateBuilder from '../Core/StateBuilder.js';
import { getPixelWorldHeightAtCoord } from '../Core/WidgetManager.js';
import vtkWidgetRepresentation from './WidgetRepresentation.js';
import WidgetManagerConst from '../Core/WidgetManager/Constants.js';
import PropertyConst from '../../Rendering/Core/Property/Constants.js';

const {
  RenderingTypes
} = WidgetManagerConst;
const {
  Interpolation,
  Representation
} = PropertyConst;

// ----------------------------------------------------------------------------
// Static methods to build state
// ----------------------------------------------------------------------------

function generateState() {
  return vtkStateBuilder.createBuilder().addField({
    name: 'origin',
    initialValue: [0, 0, 0]
  }).addField({
    name: 'normal',
    initialValue: [0, 0, 1]
  }).addField({
    name: 'activeHandle',
    initialValue: null
  }).addField({
    name: 'updateMethodName'
  }).build();
}

// ----------------------------------------------------------------------------
// Representation style
// ----------------------------------------------------------------------------

const STYLE_PIPELINE_NAMES = ['plane', 'outline', 'normal', 'origin', 'display2D'];
const STYLE_DEFAULT = {
  active: {
    plane: {
      opacity: 1,
      color: [0, 0.9, 0]
    },
    normal: {
      opacity: 1,
      color: [0, 0.9, 0]
    },
    origin: {
      opacity: 1,
      color: [0, 0.9, 0]
    }
  },
  inactive: {
    plane: {
      opacity: 0.6,
      color: [1, 1, 1]
    },
    normal: {
      opacity: 1,
      color: [0.9, 0, 0]
    },
    origin: {
      opacity: 1,
      color: [1, 0, 0]
    }
  },
  static: {
    display2D: {
      representation: Representation.POINT
    },
    outline: {
      color: [1, 1, 1],
      opacity: 1,
      representation: Representation.WIREFRAME,
      interpolation: Interpolation.FLAT
    }
  }
};

// ----------------------------------------------------------------------------
// vtkImplicitPlaneRepresentation methods
// ----------------------------------------------------------------------------

function vtkImplicitPlaneRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImplicitPlaneRepresentation');

  // --------------------------------------------------------------------------
  // Internal polydata dataset
  // --------------------------------------------------------------------------

  model.plane = vtkPlane.newInstance();
  model.matrix = vtkMatrixBuilder.buildFromDegree();
  model._pipelines = {};
  model._pipelines.outline = {
    source: vtkCubeSource.newInstance(),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({
      pickable: false,
      _parentProp: publicAPI
    })
  };
  model._pipelines.plane = {
    source: vtkCutter.newInstance({
      cutFunction: model.plane
    }),
    filter: vtkClosedPolyLineToSurfaceFilter.newInstance(),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({
      pickable: true,
      _parentProp: publicAPI
    })
  };
  model._pipelines.origin = {
    source: vtkSphereSource.newInstance(),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({
      pickable: true,
      _parentProp: publicAPI
    })
  };
  model._pipelines.normal = {
    source: vtkCylinderSource.newInstance(),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({
      pickable: true,
      _parentProp: publicAPI
    })
  };
  model._pipelines.display2D = {
    source: publicAPI,
    mapper: vtkPixelSpaceCallbackMapper.newInstance(),
    actor: vtkActor.newInstance({
      pickable: false,
      _parentProp: publicAPI
    })
  };

  // Plane generation pipeline
  model._pipelines.plane.source.setInputConnection(model._pipelines.outline.source.getOutputPort());
  vtkWidgetRepresentation.connectPipeline(model._pipelines.outline);
  vtkWidgetRepresentation.connectPipeline(model._pipelines.plane);
  vtkWidgetRepresentation.connectPipeline(model._pipelines.origin);
  vtkWidgetRepresentation.connectPipeline(model._pipelines.normal);
  vtkWidgetRepresentation.connectPipeline(model._pipelines.display2D);
  publicAPI.addActor(model._pipelines.outline.actor);
  publicAPI.addActor(model._pipelines.plane.actor);
  publicAPI.addActor(model._pipelines.origin.actor);
  publicAPI.addActor(model._pipelines.normal.actor);
  publicAPI.addActor(model._pipelines.display2D.actor);

  // --------------------------------------------------------------------------

  publicAPI.requestData = (inData, outData) => {
    const state = inData[0];
    const origin = state.getOrigin();
    if (!origin) {
      return;
    }
    const normal = state.getNormal();
    const bounds = state.getBounds();
    model.plane.setOrigin(origin);
    model.plane.setNormal(normal);

    // --------------------------------
    // Update cube parameters
    // --------------------------------

    model._pipelines.outline.source.setCenter((bounds[0] + bounds[1]) * 0.5, (bounds[2] + bounds[3]) * 0.5, (bounds[4] + bounds[5]) * 0.5);
    const xRange = bounds[1] - bounds[0];
    const yRange = bounds[3] - bounds[2];
    const zRange = bounds[5] - bounds[4];
    model._pipelines.outline.source.setXLength(xRange);
    model._pipelines.outline.source.setYLength(yRange);
    model._pipelines.outline.source.setZLength(zRange);

    // --------------------------------
    // Update normal parameters
    // --------------------------------

    let pixelScale = 1;
    if (model.scaleInPixels) {
      pixelScale = getPixelWorldHeightAtCoord(origin, model.displayScaleParams);
    }
    model._pipelines.normal.source.set({
      height: Math.max(xRange, yRange, zRange),
      radius: model.handleSizeRatio * Math.min(xRange, yRange, zRange) * model.axisScale * pixelScale,
      resolution: model.sphereResolution
    });
    const yAxis = model._pipelines.normal.source.getOutputData();
    const newAxis = vtkPolyData.newInstance();
    newAxis.shallowCopy(yAxis);
    newAxis.getPoints().setData(Float32Array.from(yAxis.getPoints().getData()), 3);
    newAxis.getPointData().removeAllArrays();
    model.matrix.identity().translate(origin[0], origin[1], origin[2]).rotateFromDirections([0, 1, 0], normal).apply(newAxis.getPoints().getData());
    model._pipelines.normal.mapper.setInputData(newAxis);

    // --------------------------------
    // Update origin parameters
    // --------------------------------

    model._pipelines.origin.actor.setPosition(origin);
    const handleScale = model.handleSizeRatio * Math.min(xRange, yRange, zRange) * pixelScale;
    model._pipelines.origin.actor.setScale(handleScale, handleScale, handleScale);

    // --------------------------------
    // Update style since state changed
    // --------------------------------

    vtkWidgetRepresentation.applyStyles(model._pipelines, model.representationStyle, state.getActive() && state.getActiveHandle());
    const output = vtkPolyData.newInstance();
    output.shallowCopy(model._pipelines.plane.filter.getOutputData());
    outData[0] = output;
  };

  // --------------------------------------------------------------------------
  // Set/Get Forwarding
  // --------------------------------------------------------------------------

  publicAPI.setSphereResolution = res => {
    model.sphereResolution = res;
    return model._pipelines.origin.source.setPhiResolution(res) && model._pipelines.origin.source.setThetaResolution(res);
  };
  publicAPI.setRepresentationStyle = style => {
    model.representationStyle = vtkWidgetRepresentation.mergeStyles(STYLE_PIPELINE_NAMES, model.representationStyle, style);

    // Apply static and inactive
    vtkWidgetRepresentation.applyStyles(model._pipelines, model.representationStyle);

    // Force requestData to execute
    publicAPI.modified();
  };

  // --------------------------------------------------------------------------
  // WidgetRepresentation API
  // --------------------------------------------------------------------------

  publicAPI.updateActorVisibility = (renderingType, ctxVisible, hVisible) => {
    const {
      planeVisible,
      originVisible,
      normalVisible,
      outlineVisible
    } = model;
    if (renderingType === RenderingTypes.PICKING_BUFFER) {
      model._pipelines.plane.actor.setVisibility(planeVisible);
      model._pipelines.origin.actor.setVisibility(originVisible);
      model._pipelines.normal.actor.setVisibility(normalVisible);
      //
      model._pipelines.plane.actor.getProperty().setOpacity(1);
    } else {
      model._pipelines.outline.actor.setVisibility(outlineVisible && ctxVisible);
      model._pipelines.plane.actor.setVisibility(planeVisible && hVisible);
      model._pipelines.origin.actor.setVisibility(originVisible && hVisible);
      model._pipelines.normal.actor.setVisibility(normalVisible && hVisible);
      //
      const state = model.inputData[0];
      if (state) {
        vtkWidgetRepresentation.applyStyles(model._pipelines, model.representationStyle, state.getActive() && state.getActiveHandle());
      }
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.getSelectedState = (prop, compositeID) => {
    // We only have one state to control us
    // we may want to update some field on the state to highlight the
    // selected handle later on...
    const state = model.inputData[0];
    state.setActiveHandle(prop);
    switch (prop) {
      case model._pipelines.plane.actor:
        state.setUpdateMethodName('updateFromPlane');
        break;
      case model._pipelines.origin.actor:
        state.setUpdateMethodName('updateFromOrigin');
        break;
      case model._pipelines.normal.actor:
        state.setUpdateMethodName('updateFromNormal');
        break;
      default:
        state.setUpdateMethodName('updateFromPlane');
        break;
    }
    return state;
  };

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  publicAPI.setRepresentationStyle(STYLE_DEFAULT);
  publicAPI.setSphereResolution(model.sphereResolution);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  sphereResolution: 24,
  handleSizeRatio: 0.05,
  axisScale: 0.1,
  normalVisible: true,
  originVisible: true,
  planeVisible: true,
  outlineVisible: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkWidgetRepresentation.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['sphereResolution', 'representationStyle']);
  macro.setGet(publicAPI, model, ['handleSizeRatio', 'axisScale', 'normalVisible', 'originVisible', 'planeVisible', 'outlineVisible']);

  // Object specific methods
  vtkImplicitPlaneRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImplicitPlaneRepresentation');

// ----------------------------------------------------------------------------

var vtkImplicitPlaneRepresentation$1 = {
  newInstance,
  extend,
  generateState
};

export { vtkImplicitPlaneRepresentation$1 as default, extend, newInstance };
