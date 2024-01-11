import { q as capitalize } from '../../../macros2.js';
import vtkActor from '../../Core/Actor.js';
import vtkCamera from '../../Core/Camera.js';
import vtkColorTransferFunction from '../../Core/ColorTransferFunction.js';
import vtkDataArray from '../../../Common/Core/DataArray.js';
import vtkPoints from '../../../Common/Core/Points.js';
import vtkCellArray from '../../../Common/Core/CellArray.js';
import vtkGlyph3DMapper from '../../Core/Glyph3DMapper.js';
import vtkLight from '../../Core/Light.js';
import vtkLookupTable from '../../../Common/Core/LookupTable.js';
import vtkMapper from '../../Core/Mapper.js';
import vtkPolyData from '../../../Common/DataModel/PolyData.js';
import vtkImageData from '../../../Common/DataModel/ImageData.js';
import vtkProperty from '../../Core/Property.js';
import vtkRenderer from '../../Core/Renderer.js';
import vtkRenderWindow from '../../Core/RenderWindow.js';
import vtkTexture from '../../Core/Texture.js';
import vtkVolume from '../../Core/Volume.js';
import vtkVolumeMapper from '../../Core/VolumeMapper.js';
import vtkVolumeProperty from '../../Core/VolumeProperty.js';
import vtkImageSlice from '../../Core/ImageSlice.js';
import vtkImageMapper from '../../Core/ImageMapper.js';
import vtkImageProperty from '../../Core/ImageProperty.js';
import vtkPiecewiseFunction from '../../../Common/DataModel/PiecewiseFunction.js';
import vtkCubeAxesActor from '../../Core/CubeAxesActor.js';
import vtkScalarBarActor from '../../Core/ScalarBarActor.js';
import vtkAxesActor from '../../Core/AxesActor.js';
import BehaviorManager from './BehaviorManager.js';

// ----------------------------------------------------------------------------
// Some internal, module-level variables and methods
// ----------------------------------------------------------------------------

const TYPE_HANDLERS = {};
const WRAPPED_ID_RE = /instance:\${([^}]+)}/;
const WRAP_ID = id => `instance:$\{${id}}`;
const ONE_TIME_INSTANCE_TRACKERS = {};
const SKIPPED_INSTANCE_IDS = [];
const EXCLUDE_INSTANCE_MAP = {};
const DATA_ARRAY_MAPPER = {
  vtkPoints,
  vtkCellArray,
  vtkDataArray
};

// ----------------------------------------------------------------------------

function extractCallArgs(synchronizerContext, argList) {
  return argList.map(arg => {
    const m = WRAPPED_ID_RE.exec(arg);
    if (m) {
      return synchronizerContext.getInstance(m[1]);
    }
    return arg;
  });
}

// ----------------------------------------------------------------------------

function extractInstanceIds(argList) {
  return argList.map(arg => WRAPPED_ID_RE.exec(arg)).filter(m => m).map(m => m[1]);
}

// ----------------------------------------------------------------------------

function extractDependencyIds(state) {
  let depList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (state.dependencies) {
    state.dependencies.forEach(childState => {
      depList.push(childState.id);
      extractDependencyIds(childState, depList);
    });
  }
  return depList;
}

// ----------------------------------------------------------------------------

function bindArrays(arraysToBind) {
  while (arraysToBind.length) {
    const [fn, args] = arraysToBind.shift();
    fn(...args);
  }
}

// ----------------------------------------------------------------------------

function createNewArrayHandler(instance, arrayMetadata, arraysToBind) {
  return values => {
    const regMethod = arrayMetadata.registration ? arrayMetadata.registration : 'addArray';
    const location = arrayMetadata.location ? instance.getReferenceByName(arrayMetadata.location) : instance;

    // Try to prevent unncessary modified
    let previousArray = null;
    if (arrayMetadata.location) {
      previousArray = instance.getReferenceByName(arrayMetadata.location).getArray(arrayMetadata.name);
    } else {
      previousArray = instance[`get${regMethod.substring(3)}`]();
    }
    if (previousArray) {
      if (previousArray.getData() !== values) {
        arraysToBind.push([previousArray.setData, [values, arrayMetadata.numberOfComponents]]);
      }
      return previousArray;
    }
    const vtkClass = arrayMetadata.vtkClass ? arrayMetadata.vtkClass : 'vtkDataArray';
    const array = DATA_ARRAY_MAPPER[vtkClass].newInstance({
      ...arrayMetadata,
      values
    });
    arraysToBind.push([location[regMethod], [array]]);
    return array;
  };
}

// ----------------------------------------------------------------------------
// Static methods for export
// ----------------------------------------------------------------------------

function update(type, instance, props, context) {
  if (!instance) {
    return Promise.reject(new Error(`No instance provided.`));
  }
  const handler = TYPE_HANDLERS[type];
  if (handler && handler.update) {
    return handler.update(instance, props, context);
  }
  return Promise.reject(new Error(`No updater for ${type}`));
}

// ----------------------------------------------------------------------------

function build(type) {
  let initialProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const handler = TYPE_HANDLERS[type];
  if (handler && handler.build) {
    // DEBUG console.log(`new ${type} - ${initialProps.managedInstanceId}`);
    return handler.build(initialProps);
  }
  console.log('No builder for', type);
  return null;
}

// ----------------------------------------------------------------------------

function excludeInstance(type, propertyName, propertyValue) {
  EXCLUDE_INSTANCE_MAP[type] = {
    key: propertyName,
    value: propertyValue
  };
}

// ----------------------------------------------------------------------------

function getSupportedTypes() {
  return Object.keys(TYPE_HANDLERS);
}

// ----------------------------------------------------------------------------

function clearTypeMapping() {
  Object.keys(TYPE_HANDLERS).forEach(key => {
    delete TYPE_HANDLERS[key];
  });
}

// ----------------------------------------------------------------------------

function updateRenderWindow(instance, props, context) {
  return update('vtkRenderWindow', instance, props, context);
}

// ----------------------------------------------------------------------------

function clearAllOneTimeUpdaters() {
  Object.keys(ONE_TIME_INSTANCE_TRACKERS).forEach(key => {
    delete ONE_TIME_INSTANCE_TRACKERS[key];
  });
}

// ----------------------------------------------------------------------------

function clearOneTimeUpdaters() {
  for (var _len = arguments.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
    ids[_key] = arguments[_key];
  }
  if (ids.length === 0) {
    return clearAllOneTimeUpdaters();
  }
  let array = ids;
  // allow an array passed as a single arg.
  if (array.length === 1 && Array.isArray(array[0])) {
    array = array[0];
  }
  array.forEach(instanceId => {
    delete ONE_TIME_INSTANCE_TRACKERS[instanceId];
  });
  return array;
}

// ----------------------------------------------------------------------------

function notSkippedInstance(call) {
  if (call[1].length === 1) {
    return SKIPPED_INSTANCE_IDS.indexOf(call[1][0]) === -1;
  }
  let keep = false;
  for (let i = 0; i < call[1].length; i++) {
    keep = keep || SKIPPED_INSTANCE_IDS.indexOf(call[1][i]) === -1;
  }
  return keep;
}

// ----------------------------------------------------------------------------
// Updater functions
// ----------------------------------------------------------------------------

function genericUpdater(instance, state, context) {
  context.start(); // -> start(generic-updater)

  // First update our own properties
  instance.set(state.properties);

  // Now handle dependencies
  if (state.dependencies) {
    state.dependencies.forEach(childState => {
      const {
        id,
        type
      } = childState;
      if (EXCLUDE_INSTANCE_MAP[type]) {
        const {
          key,
          value
        } = EXCLUDE_INSTANCE_MAP[type];
        if (!key || childState.properties[key] === value) {
          SKIPPED_INSTANCE_IDS.push(WRAP_ID(id));
          return;
        }
      }
      let childInstance = context.getInstance(id);
      if (!childInstance) {
        childInstance = build(type, {
          managedInstanceId: id
        });
        context.registerInstance(id, childInstance);
      }
      update(type, childInstance, childState, context);
    });
  }
  if (state.calls) {
    state.calls.filter(notSkippedInstance).forEach(call => {
      // DEBUG console.log('==>', call[0], extractCallArgs(context, call[1]));
      instance[call[0]].apply(null, extractCallArgs(context, call[1]));
    });
  }

  // if some arrays need to be be fetch
  const dependencies = [];
  if (state.arrays) {
    const arraysToBind = [];
    const promises = Object.values(state.arrays).map(arrayMetadata => {
      context.start(); // -> start(arrays)
      return context.getArray(arrayMetadata.hash, arrayMetadata.dataType, context).then(createNewArrayHandler(instance, arrayMetadata, arraysToBind)).catch(error => {
        console.log('Error fetching array', JSON.stringify(arrayMetadata), error);
      }).finally(context.end); // -> end(arrays)
    });

    context.start(); // -> start(arraysToBind)
    dependencies.push(Promise.all(promises).then(() => {
      // Since some arrays are getting updated, we should modify our dataset
      if (arraysToBind.length) {
        instance.modified();
      }
      bindArrays(arraysToBind);
      return true;
    }).catch(error => {
      console.error('Error in array handling for state', JSON.stringify(state), error);
    }).finally(context.end) // -> end(arraysToBind)
    );
  }

  context.end(); // -> end(generic-updater)
  return Promise.all(dependencies);
}

// ----------------------------------------------------------------------------

function oneTimeGenericUpdater(instance, state, context) {
  if (!ONE_TIME_INSTANCE_TRACKERS[state.id]) {
    genericUpdater(instance, state, context);
  }
  ONE_TIME_INSTANCE_TRACKERS[state.id] = true;
}

// ----------------------------------------------------------------------------

function rendererUpdater(instance, state, context) {
  // Don't do start/end on the context here because we don't need to hold up
  // rendering for the book-keeping we do after the genericUpdater finishes.

  // First allow generic update process to happen as usual
  genericUpdater(instance, state, context);

  // Any view props that were removed in the previous phase, genericUpdater(...),
  // may have left orphaned children in our instance cache.  Below is where those
  // refs can be tracked in the first place, and then later removed as necessary
  // to allow garbage collection.

  // In some cases, seemingly with 'vtkColorTransferFunction', the server side
  // object id may be conserved even though the actor and mapper containing or
  // using it were deleted.  In this case we must not unregister an instance
  // which is depended upon by an incoming actor just because it was also
  // depended upon by an outgoing one.
  const allActorsDeps = new Set();

  // Here we gather the list of dependencies (instance ids) for each view prop and
  // store them on the instance, in case that view prop is later removed.
  if (state.dependencies) {
    state.dependencies.forEach(childState => {
      const viewPropInstance = context.getInstance(childState.id);
      if (viewPropInstance) {
        const flattenedDepIds = extractDependencyIds(childState);
        viewPropInstance.set({
          flattenedDepIds
        }, true);
        flattenedDepIds.forEach(depId => allActorsDeps.add(depId));
      }
    });
  }

  // Look for 'removeViewProp' calls and clean up references to dependencies of
  // those view props.
  const unregisterCandidates = new Set();
  if (state.calls) {
    state.calls.filter(notSkippedInstance).filter(call => call[0] === 'removeViewProp').forEach(call => {
      // extract any ids associated with a 'removeViewProp' call (though really there
      // should just be a single one), and use them to build a flat list of all
      // representation dependency ids which we can then use our synchronizer context
      // to unregister
      extractInstanceIds(call[1]).forEach(vpId => {
        const deps = context.getInstance(vpId).get('flattenedDepIds').flattenedDepIds;
        if (deps) {
          // Consider each dependency for un-registering
          deps.forEach(depId => unregisterCandidates.add(depId));
        }
        // Consider the viewProp itself for un-registering
        unregisterCandidates.add(vpId);
      });
    });
  }

  // Now unregister any instances that are no longer needed
  const idsToUnregister = [...unregisterCandidates].filter(depId => !allActorsDeps.has(depId));
  idsToUnregister.forEach(depId => context.unregisterInstance(depId));
}

// ----------------------------------------------------------------------------

function vtkRenderWindowUpdater(instance, state, context) {
  // For each renderer we may be removing from this render window, we should first
  // remove all of the renderer's view props, then have the render window re-render
  // itself.  This will clear the screen, at which point we can go about the normal
  // updater process.
  if (state.calls) {
    state.calls.filter(notSkippedInstance).filter(call => call[0] === 'removeRenderer').forEach(call => {
      extractInstanceIds(call[1]).forEach(renId => {
        const renderer = context.getInstance(renId);
        // Take brief detour through the view props to unregister the dependencies
        // of each one
        const viewProps = renderer.getViewProps();
        viewProps.forEach(viewProp => {
          const deps = viewProp.get('flattenedDepIds').flattenedDepIds;
          if (deps) {
            deps.forEach(depId => context.unregisterInstance(depId));
          }
          context.unregisterInstance(context.getInstanceId(viewProp));
        });
      });
    });
  }
  instance.render();

  // Now just do normal update process
  genericUpdater(instance, state, context);

  // Manage any associated behaviors
  BehaviorManager.applyBehaviors(instance, state, context);
}

// ----------------------------------------------------------------------------

function colorTransferFunctionUpdater(instance, state, context) {
  context.start(); // -> start(colorTransferFunctionUpdater)
  if (!state.properties.nodes) {
    instance.set(state.properties);
  } else {
    const nodes = state.properties.nodes.map(_ref => {
      let [x, r, g, b, midpoint, sharpness] = _ref;
      return {
        x,
        r,
        g,
        b,
        midpoint,
        sharpness
      };
    });
    instance.set({
      ...state.properties,
      nodes
    }, true);
  }
  context.end(); // -> end(colorTransferFunctionUpdater)
}

function piecewiseFunctionUpdater(instance, state, context) {
  context.start(); // -> start(piecewiseFunctionUpdater)
  if (!state.properties.nodes) {
    instance.set(state.properties);
  } else {
    const nodes = state.properties.nodes.map(_ref2 => {
      let [x, y, midpoint, sharpness] = _ref2;
      return {
        x,
        y,
        midpoint,
        sharpness
      };
    });
    instance.set({
      ...state.properties,
      nodes
    }, true);
    instance.sortAndUpdateRange();
  }
  // instance.modified();
  context.end(); // -> end(piecewiseFunctionUpdater)
}

// ----------------------------------------------------------------------------

function removeUnavailableArrays(fields, availableNames) {
  const namesToDelete = [];
  const size = fields.getNumberOfArrays();
  for (let i = 0; i < size; i++) {
    const array = fields.getArray(i);
    const name = array.getName();
    if (!availableNames.has(name)) {
      namesToDelete.push(name);
    }
  }
  for (let i = 0; i < namesToDelete.length; i++) {
    fields.removeArray(namesToDelete[i]);
  }
}
/**
 * Get a unique string suitable for use as state.arrays key.
 * @param {object} arrayMeta
 * @returns {string} array key
 */
function getArrayKey(arrayMeta) {
  // Two arrays can have exactly the same hash so try to distinquish with name.
  const namePart = arrayMeta.name ? `_${arrayMeta.name}` : '';
  return `${arrayMeta.hash}_${arrayMeta.dataType}${namePart}`;
}
function createDataSetUpdate() {
  let piecesToFetch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (instance, state, context) => {
    context.start(); // -> start(dataset-update)

    // Make sure we provide container for std arrays
    const localProperties = {
      ...state.properties
    };
    if (!state.arrays) {
      state.arrays = {};
    }

    // Array members
    // => convert old format to generic state.arrays
    for (let i = 0; i < piecesToFetch.length; i++) {
      const key = piecesToFetch[i];
      if (state.properties[key]) {
        const arrayMeta = state.properties[key];
        arrayMeta.registration = `set${capitalize(key)}`;
        const arrayKey = getArrayKey(arrayMeta);
        state.arrays[arrayKey] = arrayMeta;
        delete localProperties[key];
      }
    }

    // Extract dataset fields
    const fieldsArrays = state.properties.fields || [];
    for (let i = 0; i < fieldsArrays.length; i++) {
      const arrayMeta = fieldsArrays[i];
      const arrayKey = getArrayKey(arrayMeta);
      state.arrays[arrayKey] = arrayMeta;
    }
    delete localProperties.fields;

    // Reset any pre-existing fields array
    const arrayToKeep = {
      pointData: new Set(),
      cellData: new Set(),
      fieldData: new Set()
    };
    fieldsArrays.forEach(_ref3 => {
      let {
        location,
        name
      } = _ref3;
      arrayToKeep[location].add(name);
    });
    removeUnavailableArrays(instance.getPointData(), arrayToKeep.pointData);
    removeUnavailableArrays(instance.getCellData(), arrayToKeep.cellData);

    // Generic handling
    const cleanState = {
      ...state
    };
    cleanState.properties = localProperties;
    const res = genericUpdater(instance, cleanState, context);

    // Finish what we started
    context.end(); // -> end(dataset-update)
    return res;
  };
}
const polydataUpdater = createDataSetUpdate(['points', 'polys', 'verts', 'lines', 'strips']);
const imageDataUpdater = createDataSetUpdate([]);

// ----------------------------------------------------------------------------
// Construct the type mapping
// ----------------------------------------------------------------------------

function setTypeMapping(type) {
  let buildFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let updateFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : genericUpdater;
  if (!build && !update) {
    delete TYPE_HANDLERS[type];
    return;
  }
  TYPE_HANDLERS[type] = {
    build: buildFn,
    update: updateFn
  };
}

// ----------------------------------------------------------------------------

const DEFAULT_ALIASES = {
  vtkMapper: ['vtkOpenGLPolyDataMapper', 'vtkCompositePolyDataMapper2', 'vtkDataSetMapper'],
  vtkProperty: ['vtkOpenGLProperty'],
  vtkRenderer: ['vtkOpenGLRenderer'],
  vtkCamera: ['vtkOpenGLCamera'],
  vtkColorTransferFunction: ['vtkPVDiscretizableColorTransferFunction'],
  vtkActor: ['vtkOpenGLActor', 'vtkPVLODActor'],
  vtkLight: ['vtkOpenGLLight', 'vtkPVLight'],
  vtkTexture: ['vtkOpenGLTexture'],
  vtkImageMapper: ['vtkOpenGLImageSliceMapper'],
  vtkVolumeMapper: ['vtkFixedPointVolumeRayCastMapper']
};

// ----------------------------------------------------------------------------

const DEFAULT_MAPPING = {
  vtkAxesActor: {
    build: vtkAxesActor.newInstance,
    update: genericUpdater
  },
  vtkRenderWindow: {
    build: vtkRenderWindow.newInstance,
    update: vtkRenderWindowUpdater
  },
  vtkRenderer: {
    build: vtkRenderer.newInstance,
    update: rendererUpdater
  },
  vtkLookupTable: {
    build: vtkLookupTable.newInstance,
    update: genericUpdater
  },
  vtkCamera: {
    build: vtkCamera.newInstance,
    update: oneTimeGenericUpdater
  },
  vtkPolyData: {
    build: vtkPolyData.newInstance,
    update: polydataUpdater
  },
  vtkImageData: {
    build: vtkImageData.newInstance,
    update: imageDataUpdater
  },
  vtkMapper: {
    build: vtkMapper.newInstance,
    update: genericUpdater
  },
  vtkGlyph3DMapper: {
    build: vtkGlyph3DMapper.newInstance,
    update: genericUpdater
  },
  vtkProperty: {
    build: vtkProperty.newInstance,
    update: genericUpdater
  },
  vtkActor: {
    build: vtkActor.newInstance,
    update: genericUpdater
  },
  vtkLight: {
    build: vtkLight.newInstance,
    update: genericUpdater
  },
  vtkColorTransferFunction: {
    build: vtkColorTransferFunction.newInstance,
    update: colorTransferFunctionUpdater
  },
  vtkTexture: {
    build: vtkTexture.newInstance,
    update: genericUpdater
  },
  vtkVolume: {
    build: vtkVolume.newInstance,
    update: genericUpdater
  },
  vtkVolumeMapper: {
    build: vtkVolumeMapper.newInstance,
    update: genericUpdater
  },
  vtkVolumeProperty: {
    build: vtkVolumeProperty.newInstance,
    update: genericUpdater
  },
  vtkImageSlice: {
    build: vtkImageSlice.newInstance,
    update: genericUpdater
  },
  vtkImageMapper: {
    build: vtkImageMapper.newInstance,
    update: genericUpdater
  },
  vtkImageProperty: {
    build: vtkImageProperty.newInstance,
    update: genericUpdater
  },
  vtkPiecewiseFunction: {
    build: vtkPiecewiseFunction.newInstance,
    update: piecewiseFunctionUpdater
  },
  vtkCubeAxesActor: {
    build: vtkCubeAxesActor.newInstance,
    update: genericUpdater
  },
  vtkScalarBarActor: {
    build: vtkScalarBarActor.newInstance,
    update: genericUpdater
  }
};

// ----------------------------------------------------------------------------

function setDefaultMapping() {
  let reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (reset) {
    clearTypeMapping();
  }
  Object.keys(DEFAULT_MAPPING).forEach(type => {
    const mapping = DEFAULT_MAPPING[type];
    setTypeMapping(type, mapping.build, mapping.update);
  });
}

// ----------------------------------------------------------------------------

function applyDefaultAliases() {
  // Add aliases
  Object.keys(DEFAULT_ALIASES).forEach(name => {
    const aliases = DEFAULT_ALIASES[name];
    aliases.forEach(alias => {
      TYPE_HANDLERS[alias] = TYPE_HANDLERS[name];
    });
  });
}

// ----------------------------------------------------------------------------

function alwaysUpdateCamera() {
  setTypeMapping('vtkCamera', vtkCamera.newInstance);
  applyDefaultAliases();
}

// ----------------------------------------------------------------------------
setDefaultMapping();
applyDefaultAliases();
// ----------------------------------------------------------------------------

// Avoid handling any lights at the moment
// => vtk seems fine and PV could be fine as well but not tested so keeping PV exclude
EXCLUDE_INSTANCE_MAP.vtkPVLight = {};

// ----------------------------------------------------------------------------
// Publicly exposed methods
// ----------------------------------------------------------------------------

var vtkObjectManager = {
  build,
  update,
  genericUpdater,
  oneTimeGenericUpdater,
  setTypeMapping,
  clearTypeMapping,
  getSupportedTypes,
  clearOneTimeUpdaters,
  updateRenderWindow,
  excludeInstance,
  setDefaultMapping,
  applyDefaultAliases,
  alwaysUpdateCamera
};

export { vtkObjectManager as default };
