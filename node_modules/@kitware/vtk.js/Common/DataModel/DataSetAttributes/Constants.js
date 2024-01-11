const AttributeTypes = {
  SCALARS: 0,
  VECTORS: 1,
  NORMALS: 2,
  TCOORDS: 3,
  TENSORS: 4,
  GLOBALIDS: 5,
  PEDIGREEIDS: 6,
  EDGEFLAG: 7,
  NUM_ATTRIBUTES: 8
};
const AttributeLimitTypes = {
  MAX: 0,
  EXACT: 1,
  NOLIMIT: 2
};
const CellGhostTypes = {
  DUPLICATECELL: 1,
  // the cell is present on multiple processors
  HIGHCONNECTIVITYCELL: 2,
  // the cell has more neighbors than in a regular mesh
  LOWCONNECTIVITYCELL: 4,
  // the cell has less neighbors than in a regular mesh
  REFINEDCELL: 8,
  // other cells are present that refines it.
  EXTERIORCELL: 16,
  // the cell is on the exterior of the data set
  HIDDENCELL: 32 // the cell is needed to maintain connectivity, but the data values should be ignored.
};

const PointGhostTypes = {
  DUPLICATEPOINT: 1,
  // the cell is present on multiple processors
  HIDDENPOINT: 2 // the point is needed to maintain connectivity, but the data values should be ignored.
};

const AttributeCopyOperations = {
  COPYTUPLE: 0,
  INTERPOLATE: 1,
  PASSDATA: 2,
  ALLCOPY: 3 // all of the above
};

const ghostArrayName = 'vtkGhostType';
const DesiredOutputPrecision = {
  DEFAULT: 0,
  // use the point type that does not truncate any data
  SINGLE: 1,
  // use Float32Array
  DOUBLE: 2 // use Float64Array
};

var Constants = {
  AttributeCopyOperations,
  AttributeLimitTypes,
  AttributeTypes,
  CellGhostTypes,
  DesiredOutputPrecision,
  PointGhostTypes,
  ghostArrayName
};

export { AttributeCopyOperations, AttributeLimitTypes, AttributeTypes, CellGhostTypes, DesiredOutputPrecision, PointGhostTypes, Constants as default, ghostArrayName };
