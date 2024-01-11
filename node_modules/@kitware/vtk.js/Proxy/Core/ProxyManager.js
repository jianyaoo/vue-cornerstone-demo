import { m as macro } from '../../macros2.js';
import addRegistrationAPI from './ProxyManager/core.js';
import addStateAPI from './ProxyManager/state.js';
import addViewHandlingAPI from './ProxyManager/view.js';
import addVPropertyHandlingAPI from './ProxyManager/properties.js';

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, {
    proxyIdMapping: {},
    proxyByGroup: {},
    proxyConfiguration: {},
    // { definitions: {}, representations: { viewName: { sourceType: representationName } } }
    sv2rMapping: {},
    // sv2rMapping[sourceId][viewId] = rep
    r2svMapping: {},
    // r2svMapping[representationId] = { sourceId, viewId }
    collapseState: {},
    lookupTables: {},
    piecewiseFunctions: {},
    animating: false
  }, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['proxyConfiguration', 'activeSource', 'activeView']);
  macro.event(publicAPI, model, 'ActiveSourceChange');
  macro.event(publicAPI, model, 'ActiveViewChange');
  macro.event(publicAPI, model, 'ProxyRegistrationChange');
  addRegistrationAPI(publicAPI, model);
  addStateAPI(publicAPI);
  addViewHandlingAPI(publicAPI, model);
  addVPropertyHandlingAPI(publicAPI, model);

  // Add proxy API
  macro.proxy(publicAPI, model);
  model.classHierarchy.push('vtkProxyManager');
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkProxyManager');

// ----------------------------------------------------------------------------

var vtkProxyManager = {
  newInstance,
  extend
};

export { vtkProxyManager as default, extend, newInstance };
