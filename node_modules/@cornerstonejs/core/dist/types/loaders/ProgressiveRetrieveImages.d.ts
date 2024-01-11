import { IRetrieveConfiguration, IImagesLoader, RetrieveStage, ImageLoadListener, RetrieveOptions } from '../types';
import singleRetrieveStages from './configuration/singleRetrieve';
import sequentialRetrieveStages from './configuration/sequentialRetrieve';
import interleavedRetrieveStages from './configuration/interleavedRetrieve';
import { ImageQualityStatus } from '../enums';
export { sequentialRetrieveStages, interleavedRetrieveStages, singleRetrieveStages, };
export declare type NearbyRequest = {
    itemId: string;
    linearId?: string;
    imageQualityStatus: ImageQualityStatus;
};
export declare type ProgressiveRequest = {
    imageId: string;
    stage: RetrieveStage;
    next?: ProgressiveRequest;
    nearbyRequests?: NearbyRequest[];
};
export declare class ProgressiveRetrieveImages implements IImagesLoader, IRetrieveConfiguration {
    static createProgressive: typeof createProgressive;
    static interleavedRetrieveStages: {
        stages: RetrieveStage[];
    };
    static singleRetrieveStages: {
        stages: RetrieveStage[];
    };
    static sequentialRetrieveStages: {
        stages: RetrieveStage[];
    };
    stages: RetrieveStage[];
    retrieveOptions: Record<string, RetrieveOptions>;
    constructor(imageRetrieveConfiguration: IRetrieveConfiguration);
    loadImages(imageIds: string[], listener: ImageLoadListener): Promise<any>;
}
export declare function createProgressive(configuration: IRetrieveConfiguration): ProgressiveRetrieveImages;
export default ProgressiveRetrieveImages;
//# sourceMappingURL=ProgressiveRetrieveImages.d.ts.map