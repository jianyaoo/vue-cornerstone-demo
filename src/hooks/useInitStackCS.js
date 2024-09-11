import getTestImageId from '@/cornerstone/helper/getTestImageId'
import { createIds, renderingEngine_id } from '@/enums/cs'
import { Enums as csEnums, getRenderingEngine } from '@cornerstonejs/core'

const viewportIds = createIds("stackVP", 1);
const elementIds = createIds("stackDom", 1);
export default async  function useInitStackCS({
	beforeRenderHook = () => {}
}){
	const renderingEngine = getRenderingEngine(renderingEngine_id);

	const imageIds = await getTestImageId();

	const viewportInput = {
		viewportId: viewportIds[0],
		element: document.querySelector(`#${elementIds[0]}`),
		type: csEnums.ViewportType.STACK
	};
	renderingEngine.enableElement(viewportInput);

	const viewport = renderingEngine.getViewport(viewportIds[0]);
	viewport.setStack(imageIds, 60);
	beforeRenderHook();
	viewport.render();
}
