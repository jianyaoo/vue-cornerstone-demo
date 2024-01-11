import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkImplicitPlaneRepresentation from '../Representations/ImplicitPlaneRepresentation.js';
import vtkLineManipulator from '../Manipulators/LineManipulator.js';
import vtkTrackballManipulator from '../Manipulators/TrackballManipulator.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Widget linked to a view
// ----------------------------------------------------------------------------

function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkPlaneWidget');
  model._isDragging = false;
  publicAPI.setDisplayCallback = callback => model.representations[0].setDisplayCallback(callback);
  publicAPI.updateCursor = () => {
    switch (model.activeState.getUpdateMethodName()) {
      case 'updateFromOrigin':
        model._apiSpecificRenderWindow.setCursor('crosshair');
        break;
      case 'updateFromPlane':
        model._apiSpecificRenderWindow.setCursor('move');
        break;
      case 'updateFromNormal':
        model._apiSpecificRenderWindow.setCursor('alias');
        break;
      default:
        model._apiSpecificRenderWindow.setCursor('grabbing');
        break;
    }
  };
  publicAPI.handleLeftButtonPress = callData => {
    if (!model.activeState || !model.activeState.getActive() || !model.pickable) {
      return macro.VOID;
    }
    model.lineManipulator.setWidgetOrigin(model.widgetState.getOrigin());
    model.planeManipulator.setWidgetOrigin(model.widgetState.getOrigin());
    model.trackballManipulator.reset(callData); // setup trackball delta

    if (model.dragable) {
      model._isDragging = true;
      model._apiSpecificRenderWindow.setCursor('grabbing');
      model._interactor.requestAnimation(publicAPI);
    }
    publicAPI.invokeStartInteractionEvent();
    return macro.EVENT_ABORT;
  };
  publicAPI.handleMouseMove = callData => {
    if (model._isDragging) {
      return publicAPI.handleEvent(callData);
    }
    return macro.VOID;
  };
  publicAPI.handleLeftButtonRelease = () => {
    if (!model.activeState || !model.activeState.getActive() || !model.pickable) {
      return macro.VOID;
    }
    if (model._isDragging) {
      model._interactor.cancelAnimation(publicAPI);
      model._isDragging = false;
    }
    model.widgetState.deactivate();
    publicAPI.invokeEndInteractionEvent();
    return macro.EVENT_ABORT;
  };
  publicAPI.handleEvent = callData => {
    if (model.pickable && model.activeState && model.activeState.getActive()) {
      publicAPI[model.activeState.getUpdateMethodName()](callData);
      publicAPI.invokeInteractionEvent();
      return macro.EVENT_ABORT;
    }
    return macro.VOID;
  };

  // --------------------------------------------------------------------------
  // Event coordinate translation
  // --------------------------------------------------------------------------

  publicAPI.updateFromOrigin = callData => {
    model.planeManipulator.setWidgetNormal(model.widgetState.getNormal());
    const {
      worldCoords
    } = model.planeManipulator.handleEvent(callData, model._apiSpecificRenderWindow);
    if (model.widgetState.containsPoint(worldCoords)) {
      model.activeState.setOrigin(worldCoords);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.updateFromPlane = callData => {
    // Move origin along normal axis
    model.lineManipulator.setWidgetNormal(model.activeState.getNormal());
    const {
      worldCoords
    } = model.lineManipulator.handleEvent(callData, model._apiSpecificRenderWindow);
    if (model.widgetState.containsPoint(...worldCoords)) {
      model.activeState.setOrigin(worldCoords);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.updateFromNormal = callData => {
    model.trackballManipulator.setWidgetNormal(model.activeState.getNormal());
    const {
      worldCoords: newNormal
    } = model.trackballManipulator.handleEvent(callData, model._apiSpecificRenderWindow);
    model.activeState.setNormal(newNormal);
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  model.lineManipulator = vtkLineManipulator.newInstance();
  model.planeManipulator = vtkPlanePointManipulator.newInstance();
  model.trackballManipulator = vtkTrackballManipulator.newInstance();
}

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkImplicitPlaneWidget(publicAPI, model) {
  model.classHierarchy.push('vtkPlaneWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = ['representationStyle', 'sphereResolution', 'handleSizeRatio', 'axisScale', 'normalVisible', 'originVisible', 'planeVisible', 'outlineVisible'];
  publicAPI.getRepresentationsForViewType = viewType => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [{
          builder: vtkImplicitPlaneRepresentation
        }];
    }
  };
}

// ----------------------------------------------------------------------------

const defaultValues = initialValues => ({
  behavior: widgetBehavior,
  widgetState: vtkImplicitPlaneRepresentation.generateState(),
  ...initialValues
});

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  vtkImplicitPlaneWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImplicitPlaneWidget');

// ----------------------------------------------------------------------------

var vtkImplicitPlaneWidget$1 = {
  newInstance,
  extend
};

export { vtkImplicitPlaneWidget$1 as default, extend, newInstance };
