import sinon from 'sinon';

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    sinon.replace(object, functionName, (...args) => {
      sinon.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the ResizeObserver in BoardRow has processed a resize.
 */
export async function onceResized(boardRow) {
  await onceInvoked(boardRow, '_onResize');
}
