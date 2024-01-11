import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkGlyphRepresentation from './GlyphRepresentation.js';
import vtkPixelSpaceCallbackMapper from '../../Rendering/Core/PixelSpaceCallbackMapper.js';
import vtkCylinderSource from '../../Filters/Sources/CylinderSource.js';
import { allocateArray } from './WidgetRepresentation.js';

const INFINITE_RATIO = 100000;

// ----------------------------------------------------------------------------
// vtkLineHandleRepresentation methods
// ----------------------------------------------------------------------------

function vtkLineHandleRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLineHandleRepresentation');

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  /*
   * displayActors and displayMappers are used to render objects in HTML, allowing objects
   * to be 'rendered' internally in a VTK scene without being visible on the final output
   */

  model.displayMapper = vtkPixelSpaceCallbackMapper.newInstance();
  model.displayActor = vtkActor.newInstance({
    parentProp: publicAPI
  });
  // model.displayActor.getProperty().setOpacity(0); // don't show in 3D
  model.displayActor.setMapper(model.displayMapper);
  model.displayMapper.setInputConnection(publicAPI.getOutputPort());
  publicAPI.addActor(model.displayActor);
  model.alwaysVisibleActors = [model.displayActor];

  // --------------------------------------------------------------------------

  publicAPI.setGlyphResolution = macro.chain(publicAPI.setGlyphResolution, model._pipeline.glyph.setThetaResolution, model._pipeline.glyph.setPhiResolution);

  // --------------------------------------------------------------------------

  function callbackProxy(coords) {
    if (model.displayCallback) {
      const filteredList = [];
      const states = publicAPI.getRepresentationStates();
      for (let i = 0; i < states.length; i++) {
        if (states[i].getActive()) {
          filteredList.push(coords[i]);
        }
      }
      if (filteredList.length) {
        model.displayCallback(filteredList);
        return;
      }
    }
    model.displayCallback();
  }
  publicAPI.setDisplayCallback = callback => {
    model.displayCallback = callback;
    model.displayMapper.setCallback(callback ? callbackProxy : null);
  };

  /**
   * Overwrite scale3 to optionally make lines infinite
   */
  const superScale3 = publicAPI.getScale3();
  publicAPI.setScale3((polyData, states) => {
    superScale3(polyData, states);
    if (model.infiniteLine) {
      const scales = allocateArray(polyData, 'scale', states.length, 'Float32Array', 3).getData();
      for (let i = 0; i < states.length; ++i) {
        scales[3 * i + 2] = INFINITE_RATIO;
      }
    }
  });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    infiniteLine: true,
    glyphResolution: 4,
    _pipeline: {
      glyph: vtkCylinderSource.newInstance({
        resolution: initialValues.glyphResolution ?? 4,
        initAngle: initialValues.glyphAngle ?? Math.PI / 4,
        direction: [0, 0, 1]
      })
    },
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkGlyphRepresentation.extend(publicAPI, model, defaultValues(initialValues));
  macro.setGet(publicAPI, model, ['infiniteLine', 'glyphResolution']);

  // Object specific methods
  vtkLineHandleRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkLineHandleRepresentation');

// ----------------------------------------------------------------------------

var vtkLineHandleRepresentation$1 = {
  newInstance,
  extend
};

export { vtkLineHandleRepresentation$1 as default, extend, newInstance };
