"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setDefaultViewport_1 = require("./setDefaultViewport");
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
function createViewport() {
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
    return Object.assign({}, initialDefaultViewport, setDefaultViewport_1.state.viewport);
}
exports.default = createViewport;
//# sourceMappingURL=createViewport.js.map