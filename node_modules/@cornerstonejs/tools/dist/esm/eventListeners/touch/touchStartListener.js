import { getEnabledElement, triggerEvent } from '@cornerstonejs/core';
import Events from '../../enums/Events';
import { Swipe } from '../../enums/Touch';
import getTouchEventPoints from './getTouchEventPoints';
import { copyPoints, copyPointsList, getDeltaDistanceBetweenIPoints, getDeltaDistance, getDeltaPoints, getMeanTouchPoints, } from '../../utilities/touch';
import { Settings } from '@cornerstonejs/core';
const runtimeSettings = Settings.getRuntimeSettings();
const { TOUCH_START, TOUCH_START_ACTIVATE, TOUCH_PRESS, TOUCH_DRAG, TOUCH_END, TOUCH_TAP, TOUCH_SWIPE, } = Events;
const zeroIPoint = {
    page: [0, 0],
    client: [0, 0],
    canvas: [0, 0],
    world: [0, 0, 0],
};
const zeroIDistance = {
    page: 0,
    client: 0,
    canvas: 0,
    world: 0,
};
const defaultState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    element: null,
    startPointsList: [
        {
            ...zeroIPoint,
            touch: null,
        },
    ],
    lastPointsList: [
        {
            ...zeroIPoint,
            touch: null,
        },
    ],
    isTouchStart: false,
    startTime: null,
    pressTimeout: null,
    pressDelay: 700,
    pressMaxDistance: 5,
    accumulatedDistance: zeroIDistance,
    swipeDistanceThreshold: 48,
    swiped: false,
    swipeToleranceMs: 300,
};
const defaultTapState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    element: null,
    startPointsList: [
        {
            ...zeroIPoint,
            touch: null,
        },
    ],
    taps: 0,
    tapTimeout: null,
    tapMaxDistance: 24,
    tapToleranceMs: 300,
};
let state = JSON.parse(JSON.stringify(defaultState));
let tapState = JSON.parse(JSON.stringify(defaultTapState));
function triggerEventCallback(ele, name, eventDetail) {
    return triggerEvent(ele, name, eventDetail);
}
function touchStartListener(evt) {
    state.element = evt.currentTarget;
    const enabledElement = getEnabledElement(state.element);
    const { renderingEngineId, viewportId } = enabledElement;
    state.renderingEngineId = renderingEngineId;
    state.viewportId = viewportId;
    if (state.isTouchStart) {
        return;
    }
    clearTimeout(state.pressTimeout);
    state.pressTimeout = setTimeout(() => _onTouchPress(evt), state.pressDelay);
    _onTouchStart(evt);
    document.addEventListener('touchmove', _onTouchDrag);
    document.addEventListener('touchend', _onTouchEnd);
}
function _onTouchPress(evt) {
    const totalDistance = state.accumulatedDistance.canvas;
    if (totalDistance > state.pressMaxDistance) {
        return;
    }
    const eventDetail = {
        event: evt,
        eventName: TOUCH_PRESS,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPointsList: copyPointsList(state.startPointsList),
        lastPointsList: copyPointsList(state.lastPointsList),
        startPoints: copyPoints(getMeanTouchPoints(state.startPointsList)),
        lastPoints: copyPoints(getMeanTouchPoints(state.lastPointsList)),
    };
    triggerEventCallback(eventDetail.element, TOUCH_PRESS, eventDetail);
}
function _onTouchStart(evt) {
    state.isTouchStart = true;
    state.startTime = new Date();
    const startPointsList = getTouchEventPoints(evt, state.element);
    const startPoints = getMeanTouchPoints(startPointsList);
    const deltaPoints = zeroIPoint;
    const deltaDistance = zeroIDistance;
    const eventDetail = {
        event: evt,
        eventName: TOUCH_START,
        element: state.element,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPointsList: startPointsList,
        lastPointsList: startPointsList,
        currentPointsList: startPointsList,
        startPoints: startPoints,
        lastPoints: startPoints,
        currentPoints: startPoints,
        deltaPoints,
        deltaDistance,
    };
    state.startPointsList = copyPointsList(eventDetail.startPointsList);
    state.lastPointsList = copyPointsList(eventDetail.lastPointsList);
    const eventDidPropagate = triggerEventCallback(eventDetail.element, TOUCH_START, eventDetail);
    if (eventDidPropagate) {
        triggerEventCallback(eventDetail.element, TOUCH_START_ACTIVATE, eventDetail);
    }
}
function _onTouchDrag(evt) {
    const currentPointsList = getTouchEventPoints(evt, state.element);
    const lastPointsList = _updateTouchEventsLastPoints(state.element, state.lastPointsList);
    const deltaPoints = currentPointsList.length === lastPointsList.length
        ? getDeltaPoints(currentPointsList, lastPointsList)
        : zeroIPoint;
    const deltaDistance = currentPointsList.length === lastPointsList.length
        ? getDeltaDistanceBetweenIPoints(currentPointsList, lastPointsList)
        : zeroIDistance;
    const totalDistance = currentPointsList.length === lastPointsList.length
        ? getDeltaDistance(currentPointsList, state.lastPointsList)
        : zeroIDistance;
    state.accumulatedDistance = {
        page: state.accumulatedDistance.page + totalDistance.page,
        client: state.accumulatedDistance.client + totalDistance.client,
        canvas: state.accumulatedDistance.canvas + totalDistance.canvas,
        world: state.accumulatedDistance.world + totalDistance.world,
    };
    const eventDetail = {
        event: evt,
        eventName: TOUCH_DRAG,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPoints: getMeanTouchPoints(state.startPointsList),
        lastPoints: getMeanTouchPoints(lastPointsList),
        currentPoints: getMeanTouchPoints(currentPointsList),
        startPointsList: copyPointsList(state.startPointsList),
        lastPointsList: copyPointsList(lastPointsList),
        currentPointsList,
        deltaPoints: deltaPoints,
        deltaDistance: deltaDistance,
    };
    triggerEventCallback(state.element, TOUCH_DRAG, eventDetail);
    _checkTouchSwipe(evt, deltaPoints);
    state.lastPointsList = copyPointsList(currentPointsList);
}
function _onTouchEnd(evt) {
    clearTimeout(state.pressTimeout);
    const currentPointsList = getTouchEventPoints(evt, state.element);
    const lastPointsList = _updateTouchEventsLastPoints(state.element, state.lastPointsList);
    const deltaPoints = currentPointsList.length === lastPointsList.length
        ? getDeltaPoints(currentPointsList, lastPointsList)
        : getDeltaPoints(currentPointsList, currentPointsList);
    const deltaDistance = currentPointsList.length === lastPointsList.length
        ? getDeltaDistanceBetweenIPoints(currentPointsList, lastPointsList)
        : getDeltaDistanceBetweenIPoints(currentPointsList, currentPointsList);
    const eventDetail = {
        event: evt,
        eventName: TOUCH_END,
        element: state.element,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPointsList: copyPointsList(state.startPointsList),
        lastPointsList: copyPointsList(lastPointsList),
        currentPointsList,
        startPoints: getMeanTouchPoints(state.startPointsList),
        lastPoints: getMeanTouchPoints(lastPointsList),
        currentPoints: getMeanTouchPoints(currentPointsList),
        deltaPoints,
        deltaDistance,
    };
    triggerEventCallback(eventDetail.element, TOUCH_END, eventDetail);
    _checkTouchTap(evt);
    state = JSON.parse(JSON.stringify(defaultState));
    document.removeEventListener('touchmove', _onTouchDrag);
    document.removeEventListener('touchend', _onTouchEnd);
}
function _checkTouchTap(evt) {
    const currentTime = new Date().getTime();
    const startTime = state.startTime.getTime();
    if (currentTime - startTime > tapState.tapToleranceMs) {
        return;
    }
    if (tapState.taps === 0) {
        tapState.element = state.element;
        tapState.renderingEngineId = state.renderingEngineId;
        tapState.viewportId = state.viewportId;
        tapState.startPointsList = state.startPointsList;
    }
    if (tapState.taps > 0 &&
        !(tapState.element == state.element &&
            tapState.renderingEngineId == state.renderingEngineId &&
            tapState.viewportId == state.viewportId)) {
        return;
    }
    const currentPointsList = getTouchEventPoints(evt, tapState.element);
    const distanceFromStart = getDeltaDistance(currentPointsList, tapState.startPointsList).canvas;
    if (distanceFromStart > tapState.tapMaxDistance) {
        return;
    }
    clearTimeout(tapState.tapTimeout);
    tapState.taps += 1;
    tapState.tapTimeout = setTimeout(() => {
        const eventDetail = {
            event: evt,
            eventName: TOUCH_TAP,
            element: tapState.element,
            renderingEngineId: tapState.renderingEngineId,
            viewportId: tapState.viewportId,
            camera: {},
            currentPointsList,
            currentPoints: getMeanTouchPoints(currentPointsList),
            taps: tapState.taps,
        };
        triggerEventCallback(eventDetail.element, TOUCH_TAP, eventDetail);
        tapState = JSON.parse(JSON.stringify(defaultTapState));
    }, tapState.tapToleranceMs);
}
function _checkTouchSwipe(evt, deltaPoints) {
    const currentTime = new Date().getTime();
    const startTime = state.startTime.getTime();
    if (state.swiped || currentTime - startTime > state.swipeToleranceMs) {
        return;
    }
    const [x, y] = deltaPoints.canvas;
    const eventDetail = {
        event: evt,
        eventName: TOUCH_SWIPE,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        swipe: null,
    };
    if (Math.abs(x) > state.swipeDistanceThreshold) {
        eventDetail.swipe = x > 0 ? Swipe.RIGHT : Swipe.LEFT;
        triggerEventCallback(eventDetail.element, TOUCH_SWIPE, eventDetail);
        state.swiped = true;
    }
    if (Math.abs(y) > state.swipeDistanceThreshold) {
        eventDetail.swipe = y > 0 ? Swipe.DOWN : Swipe.UP;
        triggerEventCallback(eventDetail.element, TOUCH_SWIPE, eventDetail);
        state.swiped = true;
    }
}
function _updateTouchEventsLastPoints(element, lastPoints) {
    const { viewport } = getEnabledElement(element);
    return lastPoints.map((lp) => {
        const world = viewport.canvasToWorld(lp.canvas);
        return {
            page: lp.page,
            client: lp.client,
            canvas: lp.canvas,
            world,
            touch: lp.touch,
        };
    });
}
export default touchStartListener;
//# sourceMappingURL=touchStartListener.js.map