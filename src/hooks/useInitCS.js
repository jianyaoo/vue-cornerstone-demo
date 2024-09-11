import { isCornerstoneInitialized, RenderingEngine } from '@cornerstonejs/core'
import initCornerstone from '@/cornerstone/helper/initCornerstone'
import { renderingEngine_id } from '@/enums/cs'
import useInitStackCS from '@/hooks/useInitStackCS'
import useInitVolumeCS from '@/hooks/useInitVolumeCS'

export default async function useInitCS(
 type = ['volume', 'stack'],
 volumeConfig = {},
 stackConfig = {},
 afterInitRender = () => {}
) {
	await initCornerstone();

	new RenderingEngine(renderingEngine_id);

	afterInitRender();

	if (type.includes('volume')) {
		await useInitVolumeCS(volumeConfig)
	}

	if (type.includes('stack')) {
		await useInitStackCS(stackConfig)
	}
}
