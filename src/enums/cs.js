export const renderingEngine_id = "renderingEngineId";
export const ctVolumeId = 'ctVolumeId';
export const ptVolumeId = 'ptVolumeId';


const idPreStr = {
  vp: 'viewportId',
  element: 'element'
}

export const createIds = (type, number) => {
  const ids = [];
  for (let i = 0; i < number; i++) {
    ids.push(`${idPreStr[type]}${i + 1}`);
  }
  return ids;
};
