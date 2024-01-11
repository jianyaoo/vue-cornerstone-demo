import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import type Point3 from './Point3';
import type Metadata from './Metadata';
import Mat3 from './Mat3';
import { PixelDataTypedArray } from './PixelDataTypedArray';
interface VolumeProps {
    volumeId: string;
    metadata: Metadata;
    dimensions: Point3;
    spacing: Point3;
    origin: Point3;
    direction: Mat3;
    imageData?: vtkImageData;
    scalarData: PixelDataTypedArray | Array<PixelDataTypedArray>;
    sizeInBytes?: number;
    additionalDetails?: Record<string, any>;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
    referencedVolumeId?: string;
}
export { VolumeProps };
//# sourceMappingURL=VolumeProps.d.ts.map