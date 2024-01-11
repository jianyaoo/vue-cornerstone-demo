import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import vtkAbstractRepresentationProxy from '../Core/AbstractRepresentationProxy.js';

const PROPERTIES_STATE = {
  representation: {
    'Surface with edges': {
      property: {
        edgeVisibility: true,
        representation: 2
      }
    },
    Surface: {
      property: {
        edgeVisibility: false,
        representation: 2
      }
    },
    Wireframe: {
      property: {
        edgeVisibility: false,
        representation: 1
      }
    },
    Points: {
      property: {
        edgeVisibility: false,
        representation: 0
      }
    }
  }
};
const PROPERTIES_DEFAULT = {
  representation: 'Surface'
};

// ----------------------------------------------------------------------------
// vtkGeometryRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkGeometryRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGeometryRepresentationProxy');

  // Internals
  model.mapper = vtkMapper.newInstance({
    interpolateScalarsBeforeMapping: true,
    useLookupTableScalarRange: true,
    scalarVisibility: false
  });
  model.actor = vtkActor.newInstance();
  model.property = model.actor.getProperty();

  // Auto connect mappers
  model.sourceDependencies.push(model.mapper);
  // connect rendering pipeline
  model.actor.setMapper(model.mapper);
  model.actors.push(model.actor);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  representation: 'Surface'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkGeometryRepresentationProxy(publicAPI, model);

  // Map proxy properties
  macro.proxyPropertyState(publicAPI, model, PROPERTIES_STATE, PROPERTIES_DEFAULT);
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
    interpolateScalarsBeforeMapping: {
      modelKey: 'mapper',
      property: 'interpolateScalarsBeforeMapping'
    },
    pointSize: {
      modelKey: 'property',
      property: 'pointSize'
    },
    useShadow: {
      modelKey: 'property',
      property: 'lighting'
    },
    lineWidth: {
      modelKey: 'property',
      property: 'lineWidth'
    },
    useBounds: {
      modelKey: 'actor',
      property: 'useBounds'
    }
  });
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkGeometryRepresentationProxy');

// ----------------------------------------------------------------------------

var vtkGeometryRepresentationProxy$1 = {
  newInstance,
  extend
};

export { vtkGeometryRepresentationProxy$1 as default, extend, newInstance };
