import { m as macro } from '../../macros2.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkCutter from '../../Filters/Core/Cutter.js';
import vtkImageDataOutlineFilter from '../../Filters/General/ImageDataOutlineFilter.js';
import vtkImageSlice from '../../Rendering/Core/ImageSlice.js';
import vtkImageResliceMapper from '../../Rendering/Core/ImageResliceMapper.js';
import vtkMapper from '../../Rendering/Core/Mapper.js';
import { SlabTypes } from '../../Rendering/Core/ImageResliceMapper/Constants.js';
import vtkPlane from '../../Common/DataModel/Plane.js';
import vtkAbstractRepresentationProxy from '../Core/AbstractRepresentationProxy.js';

// ----------------------------------------------------------------------------

function sum(a, b) {
  return a + b;
}

// ----------------------------------------------------------------------------

function mean() {
  for (var _len = arguments.length, array = new Array(_len), _key = 0; _key < _len; _key++) {
    array[_key] = arguments[_key];
  }
  return array.reduce(sum, 0) / array.length;
}

// ----------------------------------------------------------------------------

function updateDomains(dataset, dataArray, model, updateProp) {
  const dataRange = dataArray.getRange();
  const propToUpdate = {
    windowWidth: {
      domain: {
        min: 0,
        max: dataRange[1] - dataRange[0],
        step: 'any'
      }
    },
    windowLevel: {
      domain: {
        min: dataRange[0],
        max: dataRange[1],
        step: 'any'
      }
    }
  };
  updateProp('windowWidth', propToUpdate.windowWidth);
  updateProp('windowLevel', propToUpdate.windowLevel);
  return {
    windowWidth: propToUpdate.windowWidth.domain.max,
    windowLevel: Math.floor(mean(propToUpdate.windowLevel.domain.min, propToUpdate.windowLevel.domain.max))
  };
}

// ----------------------------------------------------------------------------
// vtkResliceRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkResliceRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkResliceRepresentationProxy');
  model.mapper = vtkImageResliceMapper.newInstance();
  model.actor = vtkImageSlice.newInstance();
  model.property = model.actor.getProperty();

  // set slicing plane
  model.slicePlane = vtkPlane.newInstance();
  model.slicePlane.setNormal(0, 1, 0);
  model.mapper.setSlicePlane(model.slicePlane);
  model.mapper.setSlabType(SlabTypes.MAX);

  // for the slice polygon outline
  model.outline = {
    iof: vtkImageDataOutlineFilter.newInstance(),
    sof: vtkCutter.newInstance({
      cutFunction: model.slicePlane
    }),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({
      visibility: false
    })
  };
  model.outline.sof.setInputConnection(model.outline.iof.getOutputPort());
  model.outline.mapper.setInputConnection(model.outline.sof.getOutputPort());

  // connect rendering pipeline
  model.actor.setMapper(model.mapper);
  model.actors.push(model.actor);
  model.outline.actor.setMapper(model.outline.mapper);
  model.actors.push(model.outline.actor);
  function setInputData(inputDataset) {
    const state = updateDomains(inputDataset, publicAPI.getDataArray(), model, publicAPI.updateProxyProperty);
    publicAPI.set(state);
    model.slicePlane.setOrigin(inputDataset.getCenter());
  }

  // Keep things updated
  model.sourceDependencies.push(model.mapper);
  model.sourceDependencies.push({
    setInputData
  });
  model.sourceDependencies.push(model.outline.iof);

  // API ----------------------------------------------------------------------

  const parentSetColorBy = publicAPI.setColorBy;
  publicAPI.setColorBy = function (arrayName, arrayLocation) {
    let componentIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    if (arrayName === null) {
      model.property.setRGBTransferFunction(null);
      model.property.setPiecewiseFunction(null);
    } else {
      parentSetColorBy(arrayName, arrayLocation, componentIndex);
      const lutProxy = publicAPI.getLookupTableProxy(arrayName);
      const pwfProxy = publicAPI.getPiecewiseFunctionProxy(arrayName);
      model.property.setRGBTransferFunction(lutProxy.getLookupTable());
      model.property.setPiecewiseFunction(pwfProxy.getPiecewiseFunction());
    }
  };
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
  macro.get(publicAPI, model, ['slicePlane']);

  // Object specific methods
  vtkResliceRepresentationProxy(publicAPI, model);

  // Proxyfy
  model.outlineActor = model.outline.actor;
  model.outlineProperty = model.outline.actor.getProperty();
  macro.proxyPropertyMapping(publicAPI, model, {
    visibility: {
      modelKey: 'actor',
      property: 'visibility'
    },
    windowWidth: {
      modelKey: 'property',
      property: 'colorWindow'
    },
    windowLevel: {
      modelKey: 'property',
      property: 'colorLevel'
    },
    interpolationType: {
      modelKey: 'property',
      property: 'interpolationType'
    },
    slicePlane: {
      modelKey: 'mapper',
      property: 'slicePlane'
    },
    slicePolyData: {
      modelKey: 'mapper',
      property: 'slicePolyData'
    },
    slabType: {
      modelKey: 'mapper',
      property: 'slabType'
    },
    slabThickness: {
      modelKey: 'mapper',
      property: 'slabThickness'
    },
    slabTrapezoidIntegration: {
      modelKey: 'mapper',
      property: 'slabTrapezoidIntegration'
    },
    outlineVisibility: {
      modelKey: 'outlineActor',
      property: 'visibility'
    },
    outlineColor: {
      modelKey: 'outlineProperty',
      property: 'color'
    },
    outlineLineWidth: {
      modelKey: 'outlineProperty',
      property: 'lineWidth'
    }
  });
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkResliceRepresentationProxy');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

export { index as default, extend, newInstance };
