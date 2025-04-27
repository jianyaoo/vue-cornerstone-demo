import { volumeLoader } from "@cornerstonejs/core";
import {
  cornerstoneStreamingImageVolumeLoader,
  cornerstoneStreamingDynamicImageVolumeLoader,
} from "@cornerstonejs/streaming-image-volume-loader";

export default function initVolumeLoader() {
  // 注册体积加载器 => 当 CornerstoneJS 需要加载一个未知类型的体积数据时，它将会使用这个加载器
  volumeLoader.registerUnknownVolumeLoader(
    cornerstoneStreamingImageVolumeLoader
  );
  // 注册体积加载器 => 当 CornerstoneJS 需要加载一个类型为 'cornerstoneStreamingImageVolume' 的体积数据时，它将会使用这个加载器。
  volumeLoader.registerVolumeLoader(
    "cornerstoneStreamingImageVolume",
    cornerstoneStreamingImageVolumeLoader
  );
  // 注册体积加载器 => 当 CornerstoneJS 需要加载一个类型为 'cornerstoneStreamingDynamicImageVolume' 的体积数据时，它将会使用这个加载器。
  volumeLoader.registerVolumeLoader(
    "cornerstoneStreamingDynamicImageVolume",
    cornerstoneStreamingDynamicImageVolumeLoader
  );
}
