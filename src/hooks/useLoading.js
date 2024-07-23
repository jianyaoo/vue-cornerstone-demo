import { Enums, eventTarget } from "@cornerstonejs/core";

export default function useLoading(type = "volume") {
  const loading = ref(false);

  const eventMap = {
    stack: Enums.Events.IMAGE_LOADED
  };

  eventTarget.addEventListener(Enums.Events.ELEMENT_ENABLED, () => {
    loading.value = true;
  });

  eventTarget.addEventListener(eventMap[type], () => {
    console.log("成功加载影像");
    loading.value = false;
  });

  return {
    loading
  };
}
