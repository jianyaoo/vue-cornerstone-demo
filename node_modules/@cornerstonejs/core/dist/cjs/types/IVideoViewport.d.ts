import { IViewport } from './IViewport';
import VideoViewportProperties from './VideoViewportProperties';
export default interface IVideoViewport extends IViewport {
    resize: () => void;
    setProperties(props: VideoViewportProperties, suppressEvents?: boolean): void;
    getProperties: () => VideoViewportProperties;
    setVideo: (imageIds: string, imageIdIndex?: number) => Promise<unknown>;
    setVideoURL: (url: string) => void;
    play: () => void;
    pause: () => void;
    resetProperties(): void;
    getCurrentImageId(): string;
    getFrameNumber(): number;
    setFrameNumber(frameNo: number): any;
    setTime(time: number): any;
    setFrameRange(range?: [number, number]): any;
    getFrameRange(): [number, number];
    resetCamera(resetPan?: boolean, resetZoom?: boolean): boolean;
}
