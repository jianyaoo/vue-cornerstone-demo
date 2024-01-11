import type { FloodFillResult, FloodFillGetter, FloodFillOptions } from '../../types';
import { Types } from '@cornerstonejs/core';
declare function floodFill(getter: FloodFillGetter, seed: Types.Point2 | Types.Point3, options?: FloodFillOptions): FloodFillResult;
export default floodFill;
