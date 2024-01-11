import { m as macro } from '../../macros2.js';
import { x as random } from '../../Common/Core/Math/index.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';

// ----------------------------------------------------------------------------
// vtkPointSource methods
// ----------------------------------------------------------------------------

function vtkPointSource(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPointSource');
  publicAPI.requestData = (inData, outData) => {
    if (model.deleted) {
      return;
    }
    const dataset = outData[0];

    // Check input
    const pointDataType = dataset ? dataset.getPoints().getDataType() : model.pointType;
    const pd = vtkPolyData.newInstance();

    // hand create a point cloud
    const numPts = model.numberOfPoints;

    // Points
    const points = macro.newTypedArray(pointDataType, numPts * 3);
    pd.getPoints().setData(points, 3);

    // Cells
    const verts = new Uint32Array(numPts + 1);
    pd.getVerts().setData(verts, 1);
    let cosphi;
    let sinphi;
    let rho;
    let radius;
    let theta;
    for (let i = 0; i < numPts; i++) {
      cosphi = 1 - 2.0 * random();
      sinphi = Math.sqrt(1 - cosphi * cosphi);
      rho = model.radius * random() ** 0.33333333;
      radius = rho * sinphi;
      theta = 2.0 * Math.PI * random();
      points[i * 3] = model.center[0] + radius * Math.cos(theta);
      points[i * 3 + 1] = model.center[1] + radius * Math.sin(theta);
      points[i * 3 + 2] = model.center[2] + rho * cosphi;
    }

    // Generate point connectivity
    //
    verts[0] = numPts;
    for (let i = 0; i < numPts; i++) {
      verts[i + 1] = i;
    }

    // Update output
    outData[0] = pd;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  numberOfPoints: 10,
  center: [0, 0, 0],
  radius: 0.5,
  pointType: 'Float64Array'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['numberOfPoints', 'radius']);
  macro.setGetArray(publicAPI, model, ['center'], 3);
  macro.algo(publicAPI, model, 0, 1);
  vtkPointSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPointSource');

// ----------------------------------------------------------------------------

var vtkPointSource$1 = {
  newInstance,
  extend
};

export { vtkPointSource$1 as default, extend, newInstance };
