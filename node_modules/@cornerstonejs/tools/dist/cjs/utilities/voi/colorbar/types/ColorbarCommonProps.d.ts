import { ColorbarRangeTextPosition } from '../enums/ColorbarRangeTextPosition';
import type { ColorbarImageRange, ColorbarTicksStyle, ColorbarVOIRange } from '.';
export declare type ColorbarCommonProps = {
    imageRange?: ColorbarImageRange;
    voiRange?: ColorbarVOIRange;
    ticks?: {
        position?: ColorbarRangeTextPosition;
        style?: ColorbarTicksStyle;
    };
    showFullPixelValueRange?: boolean;
};
