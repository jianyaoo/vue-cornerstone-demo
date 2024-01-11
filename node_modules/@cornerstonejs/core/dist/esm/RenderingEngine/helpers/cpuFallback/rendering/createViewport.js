import { state } from './setDefaultViewport';
function createDefaultDisplayedArea() {
    return {
        tlhc: {
            x: 1,
            y: 1,
        },
        brhc: {
            x: 1,
            y: 1,
        },
        rowPixelSpacing: 1,
        columnPixelSpacing: 1,
        presentationSizeMode: 'NONE',
    };
}
export default function createViewport() {
    const displayedArea = createDefaultDisplayedArea();
    const initialDefaultViewport = {
        scale: 1,
        translation: {
            x: 0,
            y: 0,
        },
        voi: {
            windowWidth: undefined,
            windowCenter: undefined,
        },
        invert: false,
        pixelReplication: false,
        rotation: 0,
        hflip: false,
        vflip: false,
        modalityLUT: undefined,
        voiLUT: undefined,
        colormap: undefined,
        labelmap: false,
        displayedArea,
    };
    return Object.assign({}, initialDefaultViewport, state.viewport);
}
//# sourceMappingURL=createViewport.js.map