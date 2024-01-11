import { glMatrix, vec3 } from 'gl-matrix';
import { utilities as csUtils, getEnabledElement, StackViewport, VolumeViewport, cache, BaseVolumeViewport, Enums, } from '@cornerstonejs/core';
import CINE_EVENTS from './events';
import { addToolState, getToolState } from './state';
import scroll from '../scroll';
const { ViewportStatus } = Enums;
const { triggerEvent } = csUtils;
const debounced = true;
const loop = true;
const dynamicVolumesPlayingMap = new Map();
function playClip(element, playClipOptions) {
    let playClipTimeouts;
    let playClipIsTimeVarying;
    if (element === undefined) {
        throw new Error('playClip: element must not be undefined');
    }
    const enabledElement = getEnabledElement(element);
    if (!enabledElement) {
        throw new Error('playClip: element must be a valid Cornerstone enabled element');
    }
    playClipOptions.dynamicCineEnabled =
        playClipOptions.dynamicCineEnabled ?? true;
    const { viewport } = enabledElement;
    const volume = _getVolumeFromViewport(viewport);
    const playClipContext = _createCinePlayContext(viewport, playClipOptions);
    let playClipData = getToolState(element);
    const isDynamicCinePlaying = playClipOptions.dynamicCineEnabled && volume?.isDynamicVolume();
    if (isDynamicCinePlaying) {
        _stopDynamicVolumeCine(element);
    }
    if (!playClipData) {
        playClipData = {
            intervalId: undefined,
            framesPerSecond: 30,
            lastFrameTimeStamp: undefined,
            ignoreFrameTimeVector: false,
            usingFrameTimeVector: false,
            frameTimeVector: playClipOptions.frameTimeVector ?? undefined,
            speed: playClipOptions.frameTimeVectorSpeedMultiplier ?? 1,
            reverse: playClipOptions.reverse ?? false,
            loop: playClipOptions.loop ?? true,
        };
        addToolState(element, playClipData);
    }
    else {
        _stopClip(element, isDynamicCinePlaying);
    }
    playClipData.dynamicCineEnabled = playClipOptions.dynamicCineEnabled;
    if (playClipOptions.framesPerSecond < 0 ||
        playClipOptions.framesPerSecond > 0) {
        playClipData.framesPerSecond = Number(playClipOptions.framesPerSecond);
        playClipData.reverse = playClipData.framesPerSecond < 0;
        playClipData.ignoreFrameTimeVector = true;
    }
    if (playClipData.ignoreFrameTimeVector !== true &&
        playClipData.frameTimeVector &&
        playClipData.frameTimeVector.length === playClipContext.numScrollSteps &&
        playClipContext.frameTimeVectorEnabled) {
        const { timeouts, isTimeVarying } = _getPlayClipTimeouts(playClipData.frameTimeVector, playClipData.speed);
        playClipTimeouts = timeouts;
        playClipIsTimeVarying = isTimeVarying;
    }
    const playClipAction = () => {
        const { numScrollSteps, currentStepIndex } = playClipContext;
        let newStepIndex = currentStepIndex + (playClipData.reverse ? -1 : 1);
        const newStepIndexOutOfRange = newStepIndex < 0 || newStepIndex >= numScrollSteps;
        if (!loop && newStepIndexOutOfRange) {
            _stopClip(element, isDynamicCinePlaying);
            const eventDetail = { element };
            triggerEvent(element, CINE_EVENTS.CLIP_STOPPED, eventDetail);
            return;
        }
        if (newStepIndex >= numScrollSteps) {
            newStepIndex = 0;
        }
        else if (newStepIndex < 0) {
            newStepIndex = numScrollSteps - 1;
        }
        const delta = newStepIndex - currentStepIndex;
        if (delta) {
            playClipContext.scroll(delta);
        }
    };
    if (isDynamicCinePlaying) {
        dynamicVolumesPlayingMap.set(volume.volumeId, element);
    }
    if (playClipTimeouts &&
        playClipTimeouts.length > 0 &&
        playClipIsTimeVarying) {
        playClipData.usingFrameTimeVector = true;
        playClipData.intervalId = window.setTimeout(function playClipTimeoutHandler() {
            playClipData.intervalId = window.setTimeout(playClipTimeoutHandler, playClipTimeouts[playClipContext.currentStepIndex]);
            playClipAction();
        }, 0);
    }
    else {
        playClipData.usingFrameTimeVector = false;
        playClipData.intervalId = window.setInterval(playClipAction, 1000 / Math.abs(playClipData.framesPerSecond));
    }
    const eventDetail = {
        element,
    };
    triggerEvent(element, CINE_EVENTS.CLIP_STARTED, eventDetail);
}
function stopClip(element) {
    _stopClip(element, true);
}
function _stopClip(element, stopDynamicCine) {
    const enabledElement = getEnabledElement(element);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    const cineToolData = getToolState(viewport.element);
    if (cineToolData) {
        _stopClipWithData(cineToolData);
    }
    if (stopDynamicCine && viewport instanceof BaseVolumeViewport) {
        _stopDynamicVolumeCine(element);
    }
}
function _stopDynamicVolumeCine(element) {
    const { viewport } = getEnabledElement(element);
    const volume = _getVolumeFromViewport(viewport);
    if (volume?.isDynamicVolume()) {
        const dynamicCineElement = dynamicVolumesPlayingMap.get(volume.volumeId);
        dynamicVolumesPlayingMap.delete(volume.volumeId);
        if (dynamicCineElement && dynamicCineElement !== element) {
            stopClip(dynamicCineElement);
        }
    }
}
function _getPlayClipTimeouts(vector, speed) {
    let i;
    let sample;
    let delay;
    let sum = 0;
    const limit = vector.length;
    const timeouts = [];
    let isTimeVarying = false;
    if (typeof speed !== 'number' || speed <= 0) {
        speed = 1;
    }
    for (i = 1; i < limit; i++) {
        delay = (Number(vector[i]) / speed) | 0;
        timeouts.push(delay);
        if (i === 1) {
            sample = delay;
        }
        else if (delay !== sample) {
            isTimeVarying = true;
        }
        sum += delay;
    }
    if (timeouts.length > 0) {
        if (isTimeVarying) {
            delay = (sum / timeouts.length) | 0;
        }
        else {
            delay = timeouts[0];
        }
        timeouts.push(delay);
    }
    return { timeouts, isTimeVarying };
}
function _stopClipWithData(playClipData) {
    const id = playClipData.intervalId;
    if (typeof id !== 'undefined') {
        playClipData.intervalId = undefined;
        if (playClipData.usingFrameTimeVector) {
            clearTimeout(id);
        }
        else {
            clearInterval(id);
        }
    }
}
function _getVolumesFromViewport(viewport) {
    return viewport
        .getActors()
        .map((actor) => cache.getVolume(actor.uid))
        .filter((volume) => !!volume);
}
function _getVolumeFromViewport(viewport) {
    const volumes = _getVolumesFromViewport(viewport);
    const dynamicVolume = volumes.find((volume) => volume.isDynamicVolume());
    return dynamicVolume ?? volumes[0];
}
function _createStackViewportCinePlayContext(viewport, waitForRendered) {
    const imageIds = viewport.getImageIds();
    return {
        get numScrollSteps() {
            return imageIds.length;
        },
        get currentStepIndex() {
            return viewport.getTargetImageIdIndex();
        },
        get frameTimeVectorEnabled() {
            return true;
        },
        waitForRenderedCount: 0,
        scroll(delta) {
            if (this.waitForRenderedCount <= waitForRendered &&
                viewport.viewportStatus !== ViewportStatus.RENDERED) {
                this.waitForRenderedCount++;
                return;
            }
            this.waitForRenderedCount = 0;
            scroll(viewport, { delta, debounceLoading: debounced });
        },
    };
}
function _createVolumeViewportCinePlayContext(viewport, volume) {
    const { volumeId } = volume;
    const cachedScrollInfo = {
        viewPlaneNormal: vec3.create(),
        scrollInfo: null,
    };
    const getScrollInfo = () => {
        const camera = viewport.getCamera();
        const updateCache = !cachedScrollInfo.scrollInfo ||
            !vec3.equals(camera.viewPlaneNormal, cachedScrollInfo.viewPlaneNormal);
        if (updateCache) {
            const scrollInfo = csUtils.getVolumeViewportScrollInfo(viewport, volumeId);
            cachedScrollInfo.viewPlaneNormal = camera.viewPlaneNormal;
            cachedScrollInfo.scrollInfo = scrollInfo;
        }
        return cachedScrollInfo.scrollInfo;
    };
    return {
        get numScrollSteps() {
            return getScrollInfo().numScrollSteps;
        },
        get currentStepIndex() {
            return getScrollInfo().currentStepIndex;
        },
        get frameTimeVectorEnabled() {
            const camera = viewport.getCamera();
            const volumeViewPlaneNormal = volume.direction
                .slice(6, 9)
                .map((x) => -x);
            const dot = vec3.dot(volumeViewPlaneNormal, camera.viewPlaneNormal);
            return glMatrix.equals(dot, 1);
        },
        scroll(delta) {
            getScrollInfo().currentStepIndex += delta;
            scroll(viewport, { delta });
        },
    };
}
function _createDynamicVolumeViewportCinePlayContext(volume) {
    return {
        get numScrollSteps() {
            return volume.numTimePoints;
        },
        get currentStepIndex() {
            return volume.timePointIndex;
        },
        get frameTimeVectorEnabled() {
            return false;
        },
        scroll(delta) {
            volume.timePointIndex += delta;
        },
    };
}
function _createCinePlayContext(viewport, playClipOptions) {
    if (viewport instanceof StackViewport) {
        return _createStackViewportCinePlayContext(viewport, playClipOptions.waitForRendered ?? 30);
    }
    if (viewport instanceof VolumeViewport) {
        const volume = _getVolumeFromViewport(viewport);
        if (playClipOptions.dynamicCineEnabled && volume?.isDynamicVolume()) {
            return _createDynamicVolumeViewportCinePlayContext(volume);
        }
        return _createVolumeViewportCinePlayContext(viewport, volume);
    }
    throw new Error('Unknown viewport type');
}
export { playClip, stopClip };
//# sourceMappingURL=playClip.js.map