import { OrientationAxis } from '../enums';
import OrientationVectors from './OrientationVectors';
import DisplayArea from './displayArea';
import RGB from './RGB';
declare type ViewportInputOptions = {
    background?: RGB;
    orientation?: OrientationAxis | OrientationVectors;
    displayArea?: DisplayArea;
    suppressEvents?: boolean;
    parallelProjection?: boolean;
};
export default ViewportInputOptions;
