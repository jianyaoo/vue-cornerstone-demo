import { LabelmapSegmentationData, LabelmapSegmentationDataVolume } from '../../../../types/LabelmapTypes';
import { LabelmapToolOperationData, LabelmapToolOperationDataVolume } from '../../../../types';
import { Types } from '@cornerstonejs/core';
declare function isVolumeSegmentation(operationData: LabelmapToolOperationData | LabelmapSegmentationData, viewport?: Types.IViewport): operationData is LabelmapToolOperationDataVolume | LabelmapSegmentationDataVolume;
export { isVolumeSegmentation };
