import { ViewportProperties } from './ViewportProperties';
import { OrientationAxis } from '../enums';
declare type VolumeViewportProperties = ViewportProperties & {
    preset?: string;
    slabThickness?: number;
    orientation?: OrientationAxis;
};
export default VolumeViewportProperties;
//# sourceMappingURL=VolumeViewportProperties.d.ts.map