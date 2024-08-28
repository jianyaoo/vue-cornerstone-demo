import {
  Enums as csEnums,
  RenderingEngine,
  volumeLoader,
  setVolumesForViewports, getRenderingEngine,
} from "@cornerstonejs/core";
import {
  createIds,
  ctVolumeId,
  ptVolumeId,
  renderingEngine_id
} from "@/enums/cs";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import getTestImageId from "@/cornerstone/helper/getTestImageId";
import getTestPTImageId from "@/cornerstone/helper/getTestPTImageId";

const viewportIds = createIds("volumeVP", 3);
const elementIds = createIds("volumeDom", 3);

export default async function useInitVolumeCS({
  isRecon,
  beforeRenderHook = () => {}
}) {
  const renderingEngine = getRenderingEngine(renderingEngine_id);

  const viewportInputArray = createMPRViewports();
  renderingEngine.setViewports(viewportInputArray);

  const imageIds = await getTestImageId();

  const volumeInputs = [];

  const volume = await volumeLoader.createAndCacheVolume(ctVolumeId, {
    imageIds
  });
  volume.load();
  volumeInputs.push({
    volumeId: ctVolumeId
  });

  if (isRecon) {
    const PTImageIds = await getTestPTImageId();
    const ptVolume = await volumeLoader.createAndCacheVolume(
      ptVolumeId,
      {
        imageIds: PTImageIds
      }
    );
    ptVolume.load();
    volumeInputs.push({
      volumeId: ptVolumeId
    });
  }

  await setVolumesForViewports(
    renderingEngine,
    volumeInputs,
    viewportIds
  );

  console.log(beforeRenderHook)

  beforeRenderHook();

  renderingEngine.renderViewports(viewportIds);
}

function createMPRViewports() {
  return ["AXIAL", "SAGITTAL", "CORONAL"].map((item, index) => {
    return {
      viewportId: viewportIds[index],
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector(`#${elementIds[index]}`),
      defaultOptions: {
        orientation: csEnums.OrientationAxis[item]
      }
    };
  });
}
