import { init as csRenderInit, } from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";
import initProviders from "./initProviders";
import initCornerstoneDICOMImageLoader from "./initCornerstoneDicomImageLoader";
import initVolumeLoader from "./initVolumeLoader";

export default async function initCornerstone() {
  // 初始化 - 元数据提供者
  initProviders();

  // 初始化 - Dicom文件加载器
  initCornerstoneDICOMImageLoader();

  // 初始化 - Volume加载器
  initVolumeLoader();

  // 初始化 - CornerStone
  await csRenderInit();

  // 初始化 - CornerStone/tool
  await csToolsInit();
}
