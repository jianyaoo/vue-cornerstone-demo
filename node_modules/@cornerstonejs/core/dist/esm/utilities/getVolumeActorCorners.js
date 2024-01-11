export default function getVolumeActorCorners(volumeActor) {
    const imageData = volumeActor.getMapper().getInputData();
    const bounds = imageData.extentToBounds(imageData.getExtent());
    return [
        [bounds[0], bounds[2], bounds[4]],
        [bounds[0], bounds[2], bounds[5]],
        [bounds[0], bounds[3], bounds[4]],
        [bounds[0], bounds[3], bounds[5]],
        [bounds[1], bounds[2], bounds[4]],
        [bounds[1], bounds[2], bounds[5]],
        [bounds[1], bounds[3], bounds[4]],
        [bounds[1], bounds[3], bounds[5]],
    ];
}
//# sourceMappingURL=getVolumeActorCorners.js.map