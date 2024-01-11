let resolveCoincidentTopologyPolygonOffsetFaces = 1;
let resolveCoincidentTopology = 0;
const RESOLVE_COINCIDENT_TOPOLOGY_MODE = ['VTK_RESOLVE_OFF', 'VTK_RESOLVE_POLYGON_OFFSET'];
function getResolveCoincidentTopologyPolygonOffsetFaces() {
  return resolveCoincidentTopologyPolygonOffsetFaces;
}
function setResolveCoincidentTopologyPolygonOffsetFaces(value) {
  resolveCoincidentTopologyPolygonOffsetFaces = value;
}
function getResolveCoincidentTopology() {
  return resolveCoincidentTopology;
}
function setResolveCoincidentTopology() {
  let mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  resolveCoincidentTopology = mode;
}
function setResolveCoincidentTopologyToDefault() {
  setResolveCoincidentTopology(0); // VTK_RESOLVE_OFF
}

function setResolveCoincidentTopologyToOff() {
  setResolveCoincidentTopology(0); // VTK_RESOLVE_OFF
}

function setResolveCoincidentTopologyToPolygonOffset() {
  setResolveCoincidentTopology(1); // VTK_RESOLVE_POLYGON_OFFSET
}

function getResolveCoincidentTopologyAsString() {
  return RESOLVE_COINCIDENT_TOPOLOGY_MODE[resolveCoincidentTopology];
}
var otherStaticMethods = {
  getResolveCoincidentTopologyAsString,
  getResolveCoincidentTopologyPolygonOffsetFaces,
  getResolveCoincidentTopology,
  setResolveCoincidentTopology,
  setResolveCoincidentTopologyPolygonOffsetFaces,
  setResolveCoincidentTopologyToDefault,
  setResolveCoincidentTopologyToOff,
  setResolveCoincidentTopologyToPolygonOffset
};

export { RESOLVE_COINCIDENT_TOPOLOGY_MODE, otherStaticMethods as default, getResolveCoincidentTopology, getResolveCoincidentTopologyAsString, getResolveCoincidentTopologyPolygonOffsetFaces, setResolveCoincidentTopology, setResolveCoincidentTopologyPolygonOffsetFaces, setResolveCoincidentTopologyToDefault, setResolveCoincidentTopologyToOff, setResolveCoincidentTopologyToPolygonOffset };
