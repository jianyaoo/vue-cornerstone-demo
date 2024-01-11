import { m as macro } from '../../macros2.js';
import vtkSkybox from '../../Rendering/Core/Skybox.js';
import vtkAbstractRepresentationProxy from '../Core/AbstractRepresentationProxy.js';

// ----------------------------------------------------------------------------
// vtkSkyboxRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkSkyboxRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSkyboxRepresentationProxy');
  model.actor = vtkSkybox.newInstance();
  model.actors.push(model.actor);
  function updateTexture(texture) {
    model.actor.removeAllTextures();
    model.actor.addTexture(texture);

    // Update domain
    const values = model.input.getAlgo().getPositions();
    publicAPI.updateProxyProperty('position', {
      values
    });
  }
  model.sourceDependencies.push({
    setInputData: updateTexture
  });

  // API ----------------------------------------------------------------------

  publicAPI.setColorBy = () => {};
  publicAPI.getColorBy = () => [];
  publicAPI.listDataArrays = () => [];
  publicAPI.setPosition = value => {
    model.input.getAlgo().setPosition(value);
  };
  publicAPI.getPosition = () => model.input.getAlgo().getPosition();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkSkyboxRepresentationProxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSkyboxRepresentationProxy');

// ----------------------------------------------------------------------------

var vtkSkyboxRepresentationProxy$1 = {
  newInstance,
  extend
};

export { vtkSkyboxRepresentationProxy$1 as default, extend, newInstance };
