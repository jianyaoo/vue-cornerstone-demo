import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkCutter from '../../Filters/Core/Cutter.js';
import vtkImageMapper from '../../Rendering/Core/ImageMapper.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import vtkPlane from '../../Common/DataModel/Plane.js';
import vtkAbstractRepresentationProxy from '../Core/AbstractRepresentationProxy.js';

// ----------------------------------------------------------------------------
// vtkSlicedGeometryRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkSlicedGeometryRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSlicedGeometryRepresentationProxy');

  // Internals
  model.plane = vtkPlane.newInstance();
  model.cutter = vtkCutter.newInstance();
  model.cutter.setCutFunction(model.plane);
  model.mapper = vtkMapper.newInstance();
  model.actor = vtkActor.newInstance();
  model.property = model.actor.getProperty();
  model.property.setLighting(false);

  // connect rendering pipeline
  model.mapper.setInputConnection(model.cutter.getOutputPort());
  model.actor.setMapper(model.mapper);
  model.actors.push(model.actor);

  // Keep things updated
  model.sourceDependencies.push(model.cutter);

  // API ----------------------------------------------------------------------
  publicAPI.setSlice = function () {
    let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const stateModified = model.slice !== slice;
    model.slice = slice;
    const n = model.plane.getNormal();
    const planeModified = model.plane.setOrigin(n[0] * slice, n[1] * slice, n[2] * slice);
    if (planeModified || stateModified) {
      publicAPI.modified();
      return true;
    }
    return false;
  };
  publicAPI.setOffset = function () {
    let offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const stateModified = model.offset !== offset;
    model.offset = offset;
    const normal = model.plane.getNormal();
    const actorModified = model.actor.setPosition(offset * normal[0], offset * normal[1], offset * normal[2]);
    if (actorModified || stateModified) {
      publicAPI.modified();
      return true;
    }
    return false;
  };
  publicAPI.setSlicingMode = mode => {
    if (model.slicingMode === mode || !mode) {
      console.log('skip setSlicingMode', mode);
      return;
    }
    model.slicingMode = mode;
    switch (vtkImageMapper.SlicingMode[mode]) {
      case vtkImageMapper.SlicingMode.X:
        model.plane.setNormal(1, 0, 0);
        break;
      case vtkImageMapper.SlicingMode.Y:
        model.plane.setNormal(0, 1, 0);
        break;
      case vtkImageMapper.SlicingMode.Z:
        model.plane.setNormal(0, 0, 1);
        break;
      default:
        return;
    }
    // Reslice properly along that new axis
    let alreadyModified = publicAPI.setSlice(model.slice);
    alreadyModified = publicAPI.setOffset(model.offset) || alreadyModified;

    // Update pipeline
    if (!alreadyModified) {
      publicAPI.modified();
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  slicingMode: vtkImageMapper.SlicingMode.NONE,
  slice: 0,
  offset: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['slicingMode', 'slice', 'offset']);

  // Object specific methods
  vtkSlicedGeometryRepresentationProxy(publicAPI, model);

  // Map proxy properties
  macro.proxyPropertyState(publicAPI, model);
  macro.proxyPropertyMapping(publicAPI, model, {
    opacity: {
      modelKey: 'property',
      property: 'opacity'
    },
    visibility: {
      modelKey: 'actor',
      property: 'visibility'
    },
    color: {
      modelKey: 'property',
      property: 'diffuseColor'
    },
    useShadow: {
      modelKey: 'property',
      property: 'lighting'
    },
    useBounds: {
      modelKey: 'actor',
      property: 'useBounds'
    }
  });
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSlicedGeometryRepresentationProxy');

// ----------------------------------------------------------------------------

var vtkSlicedGeometryRepresentationProxy$1 = {
  newInstance,
  extend
};

export { vtkSlicedGeometryRepresentationProxy$1 as default, extend, newInstance };
