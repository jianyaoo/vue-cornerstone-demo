export const renderingEngine_id = "renderingEngineId";
export const ctVolumeId = 'ctVolumeId';
export const ptVolumeId = 'ptVolumeId';

export const toolGroupId = 'toolGroupId'

export const preType = {
	volumeVP: 'volumeVP',
	volumeDom: 'volumeDom',
	stackVP: 'stackVP',
	stackDom: 'stackDom',
}

const idPreStr = {
	[preType.stackVP]: 'stackVP',
	[preType.stackDom]: 'stackDom',
	[preType.volumeVP]: 'volumeVp',
	[preType.volumeDom]: 'volumeDom',
	vp: 'viewportId',
	element: 'element',
}

export const createIds = (type, number) => {
	const ids = [];
	for (let i = 0; i < number; i++) {
		ids.push(`${idPreStr[type]}${i + 1}`);
	}
	return ids;
};
