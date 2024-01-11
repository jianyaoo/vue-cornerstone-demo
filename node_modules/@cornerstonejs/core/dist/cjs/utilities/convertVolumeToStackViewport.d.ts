import * as Types from '../types';
declare function convertVolumeToStackViewport({ viewport, options, }: {
    viewport: Types.IVolumeViewport;
    options: {
        viewportId?: string;
        background?: Types.Point3;
    };
}): Promise<Types.IStackViewport>;
export { convertVolumeToStackViewport };
