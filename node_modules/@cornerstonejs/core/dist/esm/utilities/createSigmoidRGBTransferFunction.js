import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import * as windowLevelUtil from './windowLevel';
export default function createSigmoidRGBTransferFunction(voiRange, approximationNodes = 1024) {
    const { windowWidth, windowCenter } = windowLevelUtil.toWindowLevel(voiRange.lower, voiRange.upper);
    const sigmoid = (x, wc, ww) => {
        return 1 / (1 + Math.exp((-4 * (x - wc)) / ww));
    };
    const logit = (y, wc, ww) => {
        return wc - (ww / 4) * Math.log((1 - y) / y);
    };
    const range = [...Array(approximationNodes + 2).keys()]
        .map((v) => v / (approximationNodes + 2))
        .slice(1, -1);
    const table = range.reduce((res, y) => {
        const x = logit(y, windowCenter, windowWidth);
        return res.concat(x, y, y, y, 0.5, 0.0);
    }, []);
    const cfun = vtkColorTransferFunction.newInstance();
    cfun.buildFunctionFromArray(vtkDataArray.newInstance({ values: table, numberOfComponents: 6 }));
    return cfun;
}
//# sourceMappingURL=createSigmoidRGBTransferFunction.js.map