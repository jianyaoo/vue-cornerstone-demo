import * as cornerstone from '@cornerstonejs/core';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

export default function initProvidersCustom() {
  cornerstone.metaData.addProvider((type, imageId) => {
    const dicomData = cornerstoneDICOMImageLoader.wadouri.metaData.metaDataProvider(
      type,
      imageId
    );

    if (dicomData) {
      if (type === 'imagePlaneModule') {
        return {
          ...dicomData,
          imagePositionPatient: dicomData.imagePositionPatient || [0, 0, 0],
          imageOrientationPatient: dicomData.imageOrientationPatient || [1, 0, 0, 0, 1, 0],
          rowCosines: dicomData.rowCosines || [1, 0, 0],
          columnCosines: dicomData.columnCosines || [0, 1, 0],
          rowPixelSpacing: dicomData.rowPixelSpacing || 1,
          columnPixelSpacing: dicomData.columnPixelSpacing || 1,
          sliceThickness: dicomData.sliceThickness || 1,
          sliceLocation: dicomData.sliceLocation || 0,
        };
      }
      return dicomData;
    }

    // Provide fallback values for volume rendering
    let fallbackData;
    switch (type) {
      case 'imagePlaneModule':
        fallbackData = {
          imagePositionPatient: [0, 0, 0],
          imageOrientationPatient: [1, 0, 0, 0, 1, 0],
          rowCosines: [1, 0, 0],
          columnCosines: [0, 1, 0],
          rowPixelSpacing: 1,
          columnPixelSpacing: 1,
          sliceThickness: 1,
          sliceLocation: 0,
        };
        break;
      case 'pixelSpacing':
        fallbackData = [1, 1];
        break;
      case 'columnPixelSpacing':
      case 'rowPixelSpacing':
        fallbackData = 1;
        break;
      case 'sliceThickness':
        fallbackData = 1;
        break;
      case 'sliceLocation':
        fallbackData = 0;
        break;
      default:
        fallbackData = undefined;
    }

    return fallbackData;
  }, 8000);
}
