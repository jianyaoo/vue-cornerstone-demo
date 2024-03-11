import vtkBoundingBox, { STATIC } from '../../../Common/DataModel/BoundingBox.js';
import vtkCubeSource from '../../../Filters/Sources/CubeSource.js';
import vtkCutter from '../../../Filters/Core/Cutter.js';
import vtkPlane from '../../../Common/DataModel/Plane.js';
import { s as subtract, l as normalize, j as cross, w as multiplyScalar, m as multiplyAccumulate, W as signedAngleBetweenVectors } from '../../../Common/Core/Math/index.js';
import vtkMatrixBuilder from '../../../Common/Core/MatrixBuilder.js';
import { viewTypeToPlaneName, planeNameToViewType, planeNames } from './Constants.js';

const EPSILON = 10e-7;

/**
 * Fit the plane defined by origin, p1, p2 onto the bounds.
 * Plane is untouched if does not intersect bounds.
 * @param {Array} bounds
 * @param {Array} origin
 * @param {Array} p1
 * @param {Array} p2
 * @return {Boolean} false if no bounds have been found, else true
 */
function boundPlane(bounds, origin, p1, p2) {
  const v1 = [];
  subtract(p1, origin, v1);
  normalize(v1);
  const v2 = [];
  subtract(p2, origin, v2);
  normalize(v2);
  const n = [0, 0, 1];
  cross(v1, v2, n);
  normalize(n);

  // Inflate bounds in order to avoid precision error when cutting cubesource
  const inflatedBounds = [...bounds];
  const eps = [...n];
  multiplyScalar(eps, EPSILON);
  vtkBoundingBox.addBounds(inflatedBounds, bounds[0] + eps[0], bounds[1] + eps[0], bounds[2] + eps[1], bounds[3] + eps[1], bounds[4] + eps[2], bounds[5] + eps[2]);
  vtkBoundingBox.addBounds(inflatedBounds, bounds[0] - eps[0], bounds[1] - eps[0], bounds[2] - eps[1], bounds[3] - eps[1], bounds[4] - eps[2], bounds[5] - eps[2]);
  const plane = vtkPlane.newInstance();
  plane.setOrigin(...origin);
  plane.setNormal(...n);
  const cubeSource = vtkCubeSource.newInstance();
  cubeSource.setBounds(inflatedBounds);
  const cutter = vtkCutter.newInstance();
  cutter.setCutFunction(plane);
  cutter.setInputConnection(cubeSource.getOutputPort());
  const cutBounds = cutter.getOutputData();
  if (cutBounds.getNumberOfPoints() === 0) {
    return false;
  }
  const localBounds = STATIC.computeLocalBounds(cutBounds.getPoints(), v1, v2, n);
  for (let i = 0; i < 3; i += 1) {
    origin[i] = localBounds[0] * v1[i] + localBounds[2] * v2[i] + localBounds[4] * n[i];
    p1[i] = localBounds[1] * v1[i] + localBounds[2] * v2[i] + localBounds[4] * n[i];
    p2[i] = localBounds[0] * v1[i] + localBounds[3] * v2[i] + localBounds[4] * n[i];
  }
  return true;
}
// Project point (inPoint) to the bounds of the image according to a plane
// defined by two vectors (v1, v2)
function boundPoint(inPoint, v1, v2, bounds) {
  const absT1 = v1.map(val => Math.abs(val));
  const absT2 = v2.map(val => Math.abs(val));
  let o1 = 0.0;
  let o2 = 0.0;
  for (let i = 0; i < 3; i++) {
    let axisOffset = 0;
    const useT1 = absT1[i] > absT2[i];
    const t = useT1 ? v1 : v2;
    const absT = useT1 ? absT1 : absT2;
    if (inPoint[i] < bounds[i * 2]) {
      axisOffset = absT[i] > EPSILON ? (bounds[2 * i] - inPoint[i]) / t[i] : 0;
    } else if (inPoint[i] > bounds[2 * i + 1]) {
      axisOffset = absT[i] > EPSILON ? (bounds[2 * i + 1] - inPoint[i]) / t[i] : 0;
    }
    if (useT1) {
      if (Math.abs(axisOffset) > Math.abs(o1)) {
        o1 = axisOffset;
      }
    } else if (Math.abs(axisOffset) > Math.abs(o2)) {
      o2 = axisOffset;
    }
  }
  const outPoint = [inPoint[0], inPoint[1], inPoint[2]];
  if (o1 !== 0.0) {
    multiplyAccumulate(outPoint, v1, o1, outPoint);
  }
  if (o2 !== 0.0) {
    multiplyAccumulate(outPoint, v2, o2, outPoint);
  }
  return outPoint;
}

// Compute the intersection between p1 and p2 on bounds
function boundPointOnPlane(p1, p2, bounds) {
  const dir12 = [0, 0, 0];
  subtract(p2, p1, dir12);
  const out = [0, 0, 0];
  const tolerance = [0, 0, 0];
  vtkBoundingBox.intersectBox(bounds, p1, dir12, out, tolerance);
  return out;
}

/**
 * Rotates a vector around another.
 * @param {vec3} vectorToBeRotated Vector to rate
 * @param {vec3} axis Axis to rotate around
 * @param {Number} angle Angle in radian
 * @returns The rotated vector
 */
function rotateVector(vectorToBeRotated, axis, angle) {
  const rotatedVector = [...vectorToBeRotated];
  vtkMatrixBuilder.buildFromRadian().rotate(angle, axis).apply(rotatedVector);
  return rotatedVector;
}

/**
 * Return ['X', 'Y'] if there are only 2 planes defined in the widget state.
 * Return ['X', 'Y', 'Z'] if there are 3 planes defined in the widget state.
 * @param {object} widgetState the state of the widget
 * @returns An array of plane names
 */
function getPlaneNames(widgetState) {
  return Object.keys(widgetState.getPlanes()).map(viewType => viewTypeToPlaneName[viewType]);
}

/**
 * Return X if lineName == XinY|XinZ, Y if lineName == YinX|YinZ and Z otherwise
 * @param {string} lineName name of the line (YinX, ZinX, XinY, ZinY, XinZ, YinZ)
 */
function getLinePlaneName(lineName) {
  return lineName[0];
}
/**
 * Return X if lineName == YinX|ZinX, Y if lineName == XinY|ZinY and Z otherwise
 * @param {string} lineName name of the line (YinX, ZinX, XinY, ZinY, XinZ, YinZ)
 */
function getLineInPlaneName(lineName) {
  return lineName[3];
}

/**
 * Returns ['XinY', 'YinX'] if planes == ['X', 'Y']
 * ['XinY', 'XinZ', 'YinX', 'YinZ', 'ZinX', 'ZinY'] if planes == ['X', 'Y', 'Z']
 * @param {string} planes name of the planes (e.g. ['X', 'Y'])
 */
function getPlanesLineNames() {
  let planes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : planeNames;
  const lines = [];
  planes.forEach(plane => {
    planes.forEach(inPlane => {
      if (plane !== inPlane) {
        lines.push(`${plane}in${inPlane}`);
      }
    });
  });
  return lines;
}
function getLineNames(widgetState) {
  const planes = Object.keys(widgetState.getPlanes()).map(viewType => viewTypeToPlaneName[viewType]);
  return getPlanesLineNames(planes);
}

/**
 * Return ZinX if lineName == YinX, YinX if lineName == ZinX, ZinY if lineName == XinY...
 * @param {string} lineName name of the line (YinX, ZinX, XinY, ZinY, XinZ, YinZ)
 */
function getOtherLineName(widgetState, lineName) {
  const linePlaneName = getLinePlaneName(lineName);
  const lineInPlaneName = getLineInPlaneName(lineName);
  const otherLineName = getPlaneNames(widgetState).find(planeName => planeName !== linePlaneName && planeName !== lineInPlaneName);
  return `${otherLineName}in${lineInPlaneName}`;
}

// Compute the offset of the rotation handle origin
function computeRotationHandleOriginOffset(axis, rotationHandlePosition, volumeDiagonalLength, scaleInPixels) {
  // FIXME: p1 and p2 could be placed on the exact boundaries of the volume.
  return multiplyScalar([...axis], rotationHandlePosition * (scaleInPixels ? 1 : volumeDiagonalLength) / 2);
}

// Update the reslice cursor state according to the three planes normals and the origin
function updateState(widgetState, scaleInPixels, rotationHandlePosition) {
  const planes = Object.keys(widgetState.getPlanes()).map(viewType => viewTypeToPlaneName[viewType]);
  // Generates an object as such:
  // axes = {'XY': cross(X, Y), 'YX': cross(X, Y), 'YZ': cross(Y, Z)...}
  const axes = planes.reduce((res, plane) => {
    planes.filter(otherPlane => plane !== otherPlane).forEach(otherPlane => {
      const cross$1 = cross(widgetState.getPlanes()[planeNameToViewType[plane]].normal, widgetState.getPlanes()[planeNameToViewType[otherPlane]].normal, []);
      res[`${plane}${otherPlane}`] = cross$1;
      res[`${otherPlane}${plane}`] = cross$1;
    });
    return res;
  }, {});
  const bounds = widgetState.getImage().getBounds();
  const center = widgetState.getCenter();

  // Length of the principal diagonal.
  const pdLength = vtkBoundingBox.getDiagonalLength(bounds);
  widgetState.getCenterHandle().setOrigin(center);
  getPlanesLineNames(planes).forEach(lineName => {
    const planeName = getLinePlaneName(lineName);
    const inPlaneName = getLineInPlaneName(lineName);
    const direction = axes[`${planeName}${inPlaneName}`];
    widgetState[`getRotationHandle${lineName}0`]().setOrigin(center);
    widgetState[`getRotationHandle${lineName}0`]().getManipulator()?.setHandleOrigin(center);
    widgetState[`getRotationHandle${lineName}0`]().getManipulator()?.setHandleNormal(widgetState.getPlanes()[planeNameToViewType[planeName]].normal);
    widgetState[`getRotationHandle${lineName}0`]().setOffset(computeRotationHandleOriginOffset(direction, rotationHandlePosition, pdLength, scaleInPixels));
    widgetState[`getRotationHandle${lineName}1`]().setOrigin(center);
    widgetState[`getRotationHandle${lineName}1`]().getManipulator()?.setHandleOrigin(center);
    widgetState[`getRotationHandle${lineName}1`]().getManipulator()?.setHandleNormal(widgetState.getPlanes()[planeNameToViewType[planeName]].normal);
    widgetState[`getRotationHandle${lineName}1`]().setOffset(computeRotationHandleOriginOffset(direction, -rotationHandlePosition, pdLength, scaleInPixels));
    const lineHandle = widgetState[`getAxis${lineName}`]();
    lineHandle.setOrigin(center);
    lineHandle.getManipulator()?.setHandleOrigin(center);
    lineHandle.getManipulator()?.setHandleNormal(widgetState.getPlanes()[planeNameToViewType[planeName]].normal);
    const scale = normalize(direction);
    const scale3 = lineHandle.getScale3();
    scale3[2] = 2 * scale;
    lineHandle.setScale3(scale3);
    const right = widgetState.getPlanes()[planeNameToViewType[inPlaneName]].normal;
    const up = cross(direction, right, []);
    lineHandle.setRight(right);
    lineHandle.setUp(up);
    lineHandle.setDirection(direction);
  });
}

/**
 * First rotate planeToTransform to match targetPlane normal.
 * Then rotate around targetNormal to enforce targetViewUp "up" vector (i.e. Origin->p2 ).
 * There is an infinite number of options to rotate a plane normal to another. Here we attempt to
 * preserve Origin, P1 and P2 when rotating around targetPlane.
 * @param {vtkPlaneSource} planeToTransform
 * @param {vec3} targetOrigin Center of the plane
 * @param {vec3} targetNormal Normal to state to the plane
 * @param {vec3} viewType Vector that enforces view up
 */
function transformPlane(planeToTransform, targetCenter, targetNormal, targetViewUp) {
  planeToTransform.setNormal(targetNormal);
  const viewUp = subtract(planeToTransform.getPoint2(), planeToTransform.getOrigin(), []);
  const angle = signedAngleBetweenVectors(viewUp, targetViewUp, targetNormal);
  planeToTransform.rotate(angle, targetNormal);
  planeToTransform.setCenter(targetCenter);
}

export { boundPlane, boundPoint, boundPointOnPlane, getLineInPlaneName, getLineNames, getLinePlaneName, getOtherLineName, getPlaneNames, getPlanesLineNames, rotateVector, transformPlane, updateState };
