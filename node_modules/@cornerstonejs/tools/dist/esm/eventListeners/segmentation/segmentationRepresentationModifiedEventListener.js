import triggerSegmentationRender from '../../utilities/segmentation/triggerSegmentationRender';
const segmentationRepresentationModifiedListener = function (evt) {
    const { toolGroupId } = evt.detail;
    triggerSegmentationRender(toolGroupId);
};
export default segmentationRepresentationModifiedListener;
//# sourceMappingURL=segmentationRepresentationModifiedEventListener.js.map