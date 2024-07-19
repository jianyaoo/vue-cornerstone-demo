declare function splitImageIdsBy4DTags(imageIds: string[]): {
    imageIdsGroups: string[][];
    splittingTag: string | null;
};
export default splitImageIdsBy4DTags;
