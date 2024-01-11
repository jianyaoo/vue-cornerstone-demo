import { m as macro } from '../../macros2.js';
import vtkRenderer from '../Core/Renderer.js';
import vtkRenderWindow from '../Core/RenderWindow.js';
import vtkRenderWindowInteractor from '../Core/RenderWindowInteractor.js';
import vtkInteractorStyleTrackballCamera from '../../Interaction/Style/InteractorStyleTrackballCamera.js';
import vtkURLExtract from '../../Common/Core/URLExtract.js';
import '../../Common/Core/Points.js';
import '../../Common/Core/DataArray.js';
import '../../Common/DataModel/PolyData.js';
import '../Core/Actor.js';
import '../Core/Mapper.js';
import '../OpenGL/RenderWindow.js';
import '../WebGPU/RenderWindow.js';

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();
function vtkGenericRenderWindow(publicAPI, model) {
  // Capture resize trigger method to remove from publicAPI
  const invokeResize = publicAPI.invokeResize;
  delete publicAPI.invokeResize;

  // VTK renderWindow/renderer
  model.renderWindow = vtkRenderWindow.newInstance();
  model.renderer = vtkRenderer.newInstance();
  model.renderWindow.addRenderer(model.renderer);

  // OpenGLRenderWindow
  model._apiSpecificRenderWindow = model.renderWindow.newAPISpecificView(userParams.viewAPI ?? model.defaultViewAPI);
  model.renderWindow.addView(model._apiSpecificRenderWindow);

  // Interactor
  model.interactor = vtkRenderWindowInteractor.newInstance();
  model.interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
  model.interactor.setView(model._apiSpecificRenderWindow);
  model.interactor.initialize();

  // Expose background
  publicAPI.setBackground = model.renderer.setBackground;

  // Update BG color
  publicAPI.setBackground(...model.background);

  // Handle window resize
  publicAPI.resize = () => {
    if (model.container) {
      const dims = model.container.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      model._apiSpecificRenderWindow.setSize(Math.floor(dims.width * devicePixelRatio), Math.floor(dims.height * devicePixelRatio));
      invokeResize();
      model.renderWindow.render();
    }
  };

  // Handle DOM container relocation
  publicAPI.setContainer = el => {
    if (model.container) {
      model.interactor.unbindEvents(model.container);
    }

    // Switch container
    model.container = el;
    model._apiSpecificRenderWindow.setContainer(model.container);

    // Bind to new container
    if (model.container) {
      model.interactor.bindEvents(model.container);
    }
  };

  // Properly release GL context
  publicAPI.delete = macro.chain(publicAPI.setContainer, model._apiSpecificRenderWindow.delete, publicAPI.delete);

  // Handle size
  if (model.listenWindowResize) {
    window.addEventListener('resize', publicAPI.resize);
  }
  publicAPI.resize();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  background: [0.32, 0.34, 0.43],
  listenWindowResize: true,
  container: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['renderWindow', 'renderer', '_apiSpecificRenderWindow', 'interactor', 'container']);
  macro.moveToProtected(publicAPI, model, ['_apiSpecificRenderWindow']);
  macro.event(publicAPI, model, 'resize');

  // Object specific methods
  vtkGenericRenderWindow(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

var vtkGenericRenderWindow$1 = {
  newInstance,
  extend
};

export { vtkGenericRenderWindow$1 as default, extend, newInstance };
