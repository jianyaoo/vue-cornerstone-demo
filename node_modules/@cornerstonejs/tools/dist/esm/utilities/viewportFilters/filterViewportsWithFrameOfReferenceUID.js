export default function filterViewportsWithFrameOfReferenceUID(viewports, FrameOfReferenceUID) {
    const numViewports = viewports.length;
    const viewportsWithFrameOfReferenceUID = [];
    for (let vp = 0; vp < numViewports; vp++) {
        const viewport = viewports[vp];
        if (viewport.getFrameOfReferenceUID() === FrameOfReferenceUID) {
            viewportsWithFrameOfReferenceUID.push(viewport);
        }
    }
    return viewportsWithFrameOfReferenceUID;
}
//# sourceMappingURL=filterViewportsWithFrameOfReferenceUID.js.map