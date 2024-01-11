import { VolumeProps } from '.';
interface ImageVolumeProps extends VolumeProps {
    imageIds: Array<string>;
    referencedImageIds?: Array<string>;
}
export { ImageVolumeProps };
