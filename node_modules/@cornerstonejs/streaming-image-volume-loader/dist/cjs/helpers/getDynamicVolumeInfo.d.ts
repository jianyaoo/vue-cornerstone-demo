declare function getDynamicVolumeInfo(imageIds: any): {
    isDynamicVolume: boolean;
    timePoints: string[][];
    splittingTag: string;
};
export default getDynamicVolumeInfo;
