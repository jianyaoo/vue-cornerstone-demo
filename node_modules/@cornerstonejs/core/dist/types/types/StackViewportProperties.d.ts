import InterpolationType from '../enums/InterpolationType';
import { ViewportProperties } from './ViewportProperties';
declare type StackViewportProperties = ViewportProperties & {
    interpolationType?: InterpolationType;
    rotation?: number;
    suppressEvents?: boolean;
    isComputedVOI?: boolean;
};
export default StackViewportProperties;
//# sourceMappingURL=StackViewportProperties.d.ts.map