import * as cornerstone from "@cornerstonejs/core";
import ptScalingMetaDataProvider from "./ptScalingMetaDataProvider";

const { calibratedPixelSpacingMetadataProvider } = cornerstone.utilities;

export default function initProviders() {
  // 获取图像URI
  cornerstone.metaData.addProvider(
    ptScalingMetaDataProvider.get.bind(ptScalingMetaDataProvider),
    10000
  );

  // 获取图像的像素间距
  cornerstone.metaData.addProvider(
    calibratedPixelSpacingMetadataProvider.get.bind(
      calibratedPixelSpacingMetadataProvider
    ),
    11000
  );
}
