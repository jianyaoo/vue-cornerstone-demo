function createMethods(session) {
  return {
    subscribeToImageStream: callback => session.subscribe('viewport.image.push.subscription', callback),
    unsubscribeToImageStream: subscription => session.unsubscribe(subscription),
    registerView: viewId => session.call('viewport.image.push.observer.add', [viewId]),
    unregisterView: viewId => session.call('viewport.image.push.observer.remove', [viewId]),
    enableView: (viewId, enabled) => session.call('viewport.image.push.enabled', [viewId, enabled]),
    render: function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        size: [400, 400],
        view: -1
      };
      return session.call('viewport.image.push', [options]);
    },
    resetCamera: function () {
      let view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      return session.call('viewport.camera.reset', [view]);
    },
    invalidateCache: viewId => session.call('viewport.image.push.invalidate.cache', [viewId]),
    setQuality: function (viewId, quality) {
      let ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return session.call('viewport.image.push.quality', [viewId, quality, ratio]);
    },
    setSize: function (viewId) {
      let width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
      let height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
      return session.call('viewport.image.push.original.size', [viewId, width, height]);
    },
    setServerAnimationFPS: function () {
      let fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
      return session.call('viewport.image.animation.fps.max', [fps]);
    },
    getServerAnimationFPS: () => session.call('viewport.image.animation.fps.get', []),
    startAnimation: function () {
      let viewId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      return session.call('viewport.image.animation.start', [viewId]);
    },
    stopAnimation: function () {
      let viewId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      return session.call('viewport.image.animation.stop', [viewId]);
    },
    updateCamera: function (viewId, focalPoint, viewUp, position) {
      let forceUpdate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      return session.call('viewport.camera.update', [viewId ?? -1, focalPoint, viewUp, position, forceUpdate]);
    },
    updateCameraParameters: function () {
      let viewId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      let parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let forceUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return session.call('viewport.camera.update.params', [viewId, parameters, forceUpdate]);
    }
  };
}

export { createMethods as default };
