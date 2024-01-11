import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkSphereMapper from '../../Rendering/Core/SphereMapper.js';
import vtkStickMapper from '../../Rendering/Core/StickMapper.js';
import vtkMoleculeToRepresentation from '../../Filters/General/MoleculeToRepresentation.js';
import vtkAbstractRepresentationProxy from '../Core/AbstractRepresentationProxy.js';

// ----------------------------------------------------------------------------
// vtkMoleculeRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkMoleculeRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkMoleculeRepresentationProxy');

  // Internals
  model.filter = vtkMoleculeToRepresentation.newInstance();
  model.sphereMapper = vtkSphereMapper.newInstance();
  model.stickMapper = vtkStickMapper.newInstance();
  model.sphereActor = vtkActor.newInstance();
  model.stickActor = vtkActor.newInstance();
  model.sourceDependencies.push(model.filter);

  // render sphere
  model.sphereMapper.setInputConnection(model.filter.getOutputPort(0));
  model.sphereMapper.setScaleArray(model.filter.getSphereScaleArrayName());
  model.sphereActor.setMapper(model.sphereMapper);

  // render sticks
  model.stickMapper.setInputConnection(model.filter.getOutputPort(1));
  model.stickMapper.setScaleArray('stickScales');
  model.stickMapper.setOrientationArray('orientation');
  model.stickActor.setMapper(model.stickMapper);

  // Add actors
  model.actors.push(model.sphereActor);
  model.actors.push(model.stickActor);

  // API ----------------------------------------------------------------------

  publicAPI.setColorBy = () => {};
  publicAPI.getColorBy = () => [];
  publicAPI.listDataArrays = () => [];
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
  vtkMoleculeRepresentationProxy(publicAPI, model);
  macro.proxyPropertyMapping(publicAPI, model, {
    tolerance: {
      modelKey: 'filter',
      property: 'tolerance'
    },
    atomicRadiusScaleFactor: {
      modelKey: 'filter',
      property: 'atomicRadiusScaleFactor'
    },
    bondRadius: {
      modelKey: 'filter',
      property: 'bondRadius'
    },
    deltaBondFactor: {
      modelKey: 'filter',
      property: 'deltaBondFactor'
    },
    radiusType: {
      modelKey: 'filter',
      property: 'radiusType'
    },
    hideElements: {
      modelKey: 'filter',
      property: 'hideElements'
    }
  });
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkMoleculeRepresentationProxy');

// ----------------------------------------------------------------------------

var vtkMoleculeRepresentationProxy$1 = {
  newInstance,
  extend
};

export { vtkMoleculeRepresentationProxy$1 as default, extend, newInstance };
