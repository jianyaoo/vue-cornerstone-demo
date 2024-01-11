import triggerSegmentationRender from '../../utilities/segmentation/triggerSegmentationRender';
const segmentationRepresentationRemovedEventListener = function (evt) {
    const { toolGroupId, segmentationRepresentationUID } = evt.detail;
    triggerSegmentationRender(toolGroupId);
};
export default segmentationRepresentationRemovedEventListener;
//# sourceMappingURL=segmentationRepresentationRemovedEventListener.js.map