import { vec3, quat, mat4 } from 'gl-matrix';

// Labels used to encode handle position in the handle state's name property
const AXES = ['-', '=', '+'];

// ----------------------------------------------------------------------------

function transformVec3(ain, transform) {
  const vout = new Float64Array(3);
  vec3.transformMat4(vout, ain, transform);
  return vout;
}

// ----------------------------------------------------------------------------

function rotateVec3(vec, transform) {
  // transform is a mat4
  const out = vec3.create();
  const q = quat.create();
  mat4.getRotation(q, transform);
  vec3.transformQuat(out, vec, q);
  return out;
}

// ----------------------------------------------------------------------------

function handleTypeFromName(name) {
  const [i, j, k] = name.split('').map(l => AXES.indexOf(l) - 1);
  if (i * j * k !== 0) {
    return 'corners';
  }
  if (i * j !== 0 || j * k !== 0 || k * i !== 0) {
    return 'edges';
  }
  return 'faces';
}

export { AXES, handleTypeFromName, rotateVec3, transformVec3 };
