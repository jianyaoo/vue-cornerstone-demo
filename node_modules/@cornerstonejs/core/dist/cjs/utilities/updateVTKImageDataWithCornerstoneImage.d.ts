import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { IImage } from '../types';
declare function updateVTKImageDataWithCornerstoneImage(sourceImageData: vtkImageData, image: IImage): void;
export { updateVTKImageDataWithCornerstoneImage };
