import { IImageVolume, PixelDataTypedArray } from '../types';
interface IDynamicImageVolume extends IImageVolume {
    get timePointIndex(): number;
    set timePointIndex(newTimePointIndex: number);
    get numTimePoints(): number;
    getScalarDataArrays(): PixelDataTypedArray[];
}
export default IDynamicImageVolume;
