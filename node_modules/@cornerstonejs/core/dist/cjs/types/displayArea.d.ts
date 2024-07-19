import InterpolationType from '../enums/InterpolationType';
declare type DisplayArea = {
    type?: 'SCALE' | 'FIT';
    scale?: number;
    interpolationType?: InterpolationType;
    imageArea?: [number, number];
    imageCanvasPoint?: {
        imagePoint: [number, number];
        canvasPoint?: [number, number];
    };
    storeAsInitialCamera?: boolean;
};
export default DisplayArea;
