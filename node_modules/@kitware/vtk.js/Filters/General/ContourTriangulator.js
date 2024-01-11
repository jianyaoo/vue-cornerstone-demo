import { m as macro } from '../../macros2.js';
import vtkCellArray from '../../Common/Core/CellArray.js';
import vtkPolygon from '../../Common/DataModel/Polygon.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';
import { VtkDataTypes } from '../../Common/Core/DataArray/Constants.js';
import { vtkCCSMakePolysFromLines, vtkCCSJoinLooseEnds, vtkCCSFindTrueEdges, vtkCCSMakeHoleyPolys, vtkCCSCutHoleyPolys, vtkCCSSplitAtPinchPoints, vtkCCSTriangulate } from './ContourTriangulator/helper.js';

const {
  vtkErrorMacro
} = macro;
const TRIANGULATION_ERROR_DISPLAY = false;

//------------------------------------------------------------------------------
function triangulateContours(polyData, firstLine, numLines, polys, normal) {
  let triangulatePolys = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  let triangulationFailure = false;

  // If no cut lines were generated, there's nothing to do
  if (numLines <= 0) {
    return false;
  }
  const points = polyData.getPoints();

  // Join all the new lines into connected groups, i.e. polygons.
  // If we are lucky these will be simple, convex polygons. But
  // we can't count on that.

  const newPolys = [];
  const incompletePolys = [];
  const oriented = normal?.length < 3;
  vtkCCSMakePolysFromLines(polyData, firstLine, firstLine + numLines, oriented, newPolys, incompletePolys);

  // if no normal specified, then compute one from largest contour
  let computedNormal = normal;
  if (!oriented) {
    computedNormal = [0, 0, 1];
    let maxnorm = 0;
    const n = [];
    for (let i = 0; i < newPolys.length; i++) {
      const norm = vtkPolygon.getNormal(newPolys[i], points, n);
      if (norm > maxnorm) {
        maxnorm = norm;
        computedNormal[0] = n[0];
        computedNormal[1] = n[1];
        computedNormal[2] = n[2];
      }
    }
  }

  // Join any loose ends. If the input was a closed surface then there
  // will not be any loose ends, so this is provided as a service to users
  // who want to clip a non-closed surface.
  vtkCCSJoinLooseEnds(newPolys, incompletePolys, points, computedNormal);

  // Some points might be in the middle of straight line segments.
  // These points can be removed without changing the shape of the
  // polys, and removing them makes triangulation more stable.
  // Unfortunately removing these points also means that the polys
  // will no longer form a watertight cap over the cut.

  const polyEdges = [];
  const originalEdges = [];
  vtkCCSFindTrueEdges(newPolys, points, polyEdges, originalEdges);

  // Next we have to check for polygons with holes, i.e. polygons that
  // have other polygons inside. Each polygon is "grouped" with the
  // polygons that make up its holes.

  // Initialize each group to hold just one polygon.
  const numNewPolys = newPolys.length;
  const polyGroups = new Array(numNewPolys);
  for (let i = 0; i < numNewPolys; i++) {
    polyGroups[i] = [i];
  }

  // Find out which polys are holes in larger polys. Create a group
  // for each poly where the first member of the group is the larger
  // poly, and all other members are the holes. The number of polyGroups
  // will be the same as the number of polys, and any polys that are
  // holes will have a matching empty group.

  vtkCCSMakeHoleyPolys(newPolys, points, polyGroups, polyEdges, originalEdges, computedNormal, oriented);

  // Make cuts to create simple polygons out of the holey polys.
  // After this is done, each polyGroup will have exactly 1 polygon,
  // and no polys will be holes. This is currently the most computationally
  // expensive part of the process.

  if (!vtkCCSCutHoleyPolys(newPolys, points, polyGroups, polyEdges, computedNormal)) {
    triangulationFailure = true;
  }

  // Some polys might be self-intersecting. Split the polys at each intersection point.
  vtkCCSSplitAtPinchPoints(newPolys, points, polyGroups, polyEdges, computedNormal, oriented);

  // ------ Triangulation code ------

  // Go through all polys and triangulate them
  for (let polyId = 0; polyId < polyGroups.length; polyId++) {
    // If group is empty, then poly was a hole without a containing poly
    if (polyGroups[polyId].length === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!triangulatePolys) {
      polys.insertNextCell(originalEdges.slice(1, originalEdges.length));
    } else if (!vtkCCSTriangulate(newPolys[polyId], points, polyEdges[polyId], originalEdges, polys, computedNormal)) {
      triangulationFailure = false;
    }
  }
  return !triangulationFailure;
}

// ---------------------------------------------------
function triangulatePolygon(polygon, points, triangles) {
  const poly = [...polygon];
  const polys = [poly];
  const originalEdges = [];
  const polyEdges = [];
  vtkCCSFindTrueEdges(polys, points, polyEdges, originalEdges);
  const edges = polyEdges[0];
  let success = true;
  const normal = [];
  const norm = vtkPolygon.getNormal(poly, points, normal);
  if (norm !== 0) {
    success = vtkCCSTriangulate(poly, points, edges, originalEdges, triangles, normal);
  }
  return success;
}
const STATIC = {
  triangulateContours,
  triangulatePolygon
};
function vtkContourTriangulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkContourTriangulator');
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const input = inData[0];
    // FIXME: do not instantiate a new polydata each time the filter is executed.
    const output = vtkPolyData.newInstance();
    outData[0] = output;
    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return false;
    }
    let triangulationError = false;
    const lines = input.getLines();
    if (lines == null || lines.getNumberOfCells() === 0) {
      return true;
    }
    input.buildCells();
    const polysArray = vtkCellArray.newInstance({
      dataType: VtkDataTypes.DOUBLE,
      empty: true
    });
    output.setPolys(polysArray);
    output.setPoints(input.getPoints());
    output.getPointData().passData(input.getPointData());
    triangulationError = !triangulateContours(input, input.getNumberOfVerts(), lines.getNumberOfCells(), polysArray, null, model.triangulatePolys);
    if (triangulationError && TRIANGULATION_ERROR_DISPLAY) {
      vtkErrorMacro('Triangulation failed, output might have holes.');
    }
    return true;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  triangulatePolys: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macro.algo(publicAPI, model, 1, 1);
  macro.setGet(publicAPI, model, ['triangulatePolys']);

  // Object specific methods
  vtkContourTriangulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkContourTriangulator');

// ----------------------------------------------------------------------------

var vtkContourTriangulator$1 = {
  newInstance,
  extend,
  ...STATIC
};

export { STATIC, vtkContourTriangulator$1 as default, extend, newInstance };
