import { m as macro } from '../../macros2.js';

const {
  vtkErrorMacro
} = macro;
function notImplemented(method) {
  return () => vtkErrorMacro(`vtkViewport::${method} - NOT IMPLEMENTED`);
}

// ----------------------------------------------------------------------------
// vtkViewport methods
// ----------------------------------------------------------------------------

function vtkViewport(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkViewport');

  // Public API methods
  publicAPI.getViewProps = () => model.props;
  publicAPI.hasViewProp = prop => model.props.includes(prop);
  publicAPI.addViewProp = prop => {
    if (prop && !publicAPI.hasViewProp(prop)) {
      model.props.push(prop);
    }
  };
  publicAPI.removeViewProp = prop => {
    const newPropList = model.props.filter(item => item !== prop);
    if (model.props.length !== newPropList.length) {
      model.props = newPropList;
    }
  };
  publicAPI.removeAllViewProps = () => {
    model.props = [];
  };

  // this method get all the props including any nested props
  function gatherProps(prop) {
    let allProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    allProps.push(prop);
    const children = prop.getNestedProps();
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        gatherProps(children[i], allProps);
      }
    }
    return allProps;
  }
  publicAPI.getViewPropsWithNestedProps = () => {
    const allPropsArray = [];
    for (let i = 0; i < model.props.length; i++) {
      gatherProps(model.props[i], allPropsArray);
    }
    return allPropsArray;
  };
  publicAPI.addActor2D = publicAPI.addViewProp;
  publicAPI.removeActor2D = prop => {
    // VTK way: model.actors2D.RemoveItem(prop);
    publicAPI.removeViewProp(prop);
  };
  publicAPI.getActors2D = () => {
    model.actors2D = [];
    model.props.forEach(prop => {
      model.actors2D = model.actors2D.concat(prop.getActors2D());
    });
    return model.actors2D;
  };
  publicAPI.displayToView = () => vtkErrorMacro('call displayToView on your view instead');
  publicAPI.viewToDisplay = () => vtkErrorMacro('callviewtodisplay on your view instead');
  publicAPI.getSize = () => vtkErrorMacro('call getSize on your View instead');
  publicAPI.normalizedDisplayToProjection = (x, y, z) => {
    // first to normalized viewport
    const nvp = publicAPI.normalizedDisplayToNormalizedViewport(x, y, z);

    // then to view
    return publicAPI.normalizedViewportToProjection(nvp[0], nvp[1], nvp[2]);
  };
  publicAPI.normalizedDisplayToNormalizedViewport = (x, y, z) => {
    const scale = [model.viewport[2] - model.viewport[0], model.viewport[3] - model.viewport[1]];
    return [(x - model.viewport[0]) / scale[0], (y - model.viewport[1]) / scale[1], z];
  };
  publicAPI.normalizedViewportToProjection = (x, y, z) => [x * 2.0 - 1.0, y * 2.0 - 1.0, z * 2.0 - 1.0];
  publicAPI.projectionToNormalizedDisplay = (x, y, z) => {
    // first to nvp
    const nvp = publicAPI.projectionToNormalizedViewport(x, y, z);

    // then to ndp
    return publicAPI.normalizedViewportToNormalizedDisplay(nvp[0], nvp[1], nvp[2]);
  };
  publicAPI.normalizedViewportToNormalizedDisplay = (x, y, z) => {
    const scale = [model.viewport[2] - model.viewport[0], model.viewport[3] - model.viewport[1]];
    return [x * scale[0] + model.viewport[0], y * scale[1] + model.viewport[1], z];
  };
  publicAPI.projectionToNormalizedViewport = (x, y, z) => [(x + 1.0) * 0.5, (y + 1.0) * 0.5, (z + 1.0) * 0.5];
  publicAPI.PickPropFrom = notImplemented('PickPropFrom');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // _vtkWindow: null,
  background: [0, 0, 0],
  background2: [0.2, 0.2, 0.2],
  gradientBackground: false,
  viewport: [0, 0, 1, 1],
  aspect: [1, 1],
  pixelAspect: [1, 1],
  props: [],
  actors2D: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.event(publicAPI, model, 'event');
  macro.setGetArray(publicAPI, model, ['viewport'], 4);
  macro.setGetArray(publicAPI, model, ['background', 'background2'], 3);
  vtkViewport(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkViewport');

// ----------------------------------------------------------------------------

var vtkViewport$1 = {
  newInstance,
  extend
};

export { vtkViewport$1 as default, extend, newInstance };
