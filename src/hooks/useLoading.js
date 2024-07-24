import { Enums, eventTarget } from "@cornerstonejs/core";

export default function useLoading(type = "volume") {
  const loading = ref(false);

  const eventMap = {
    stack: Enums.Events.IMAGE_LOADED,
    volume: Enums.Events.IMAGE_VOLUME_LOADING_COMPLETED
  };

  onMounted(()=>{
    loading.value = true;
  })
  eventTarget.addEventListener(eventMap[type], () => {
    loading.value = false;
  });

  return {
    loading
  };
}
