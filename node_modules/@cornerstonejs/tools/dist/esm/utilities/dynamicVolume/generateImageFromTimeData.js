import { Enums } from '@cornerstonejs/core';
function generateImageFromTimeData(dynamicVolume, operation, frameNumbers) {
    const frames = frameNumbers || [...Array(dynamicVolume.numTimePoints).keys()];
    const numFrames = frames.length;
    if (frames.length <= 1) {
        throw new Error('Please provide two or more time points');
    }
    const typedArrays = dynamicVolume.getScalarDataArrays();
    const arrayLength = typedArrays[0].length;
    const finalArray = new Float32Array(arrayLength);
    if (operation === Enums.DynamicOperatorType.SUM) {
        for (let i = 0; i < numFrames; i++) {
            const currentArray = typedArrays[frames[i]];
            for (let j = 0; j < arrayLength; j++) {
                finalArray[j] += currentArray[j];
            }
        }
        return finalArray;
    }
    if (operation === Enums.DynamicOperatorType.SUBTRACT) {
        if (frames.length > 2) {
            throw new Error('Please provide only 2 time points for subtraction.');
        }
        for (let j = 0; j < arrayLength; j++) {
            finalArray[j] += typedArrays[frames[0]][j] - typedArrays[frames[1]][j];
        }
        return finalArray;
    }
    if (operation === Enums.DynamicOperatorType.AVERAGE) {
        for (let i = 0; i < numFrames; i++) {
            const currentArray = typedArrays[frames[i]];
            for (let j = 0; j < arrayLength; j++) {
                finalArray[j] += currentArray[j];
            }
        }
        for (let k = 0; k < arrayLength; k++) {
            finalArray[k] = finalArray[k] / numFrames;
        }
        return finalArray;
    }
}
export default generateImageFromTimeData;
//# sourceMappingURL=generateImageFromTimeData.js.map