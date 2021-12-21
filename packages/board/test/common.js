import sinon from 'sinon';

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    const stub = sinon.stub(object, functionName).callsFake((...args) => {
      stub.restore();
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

/**
 * Resolves once the ResizeObserver in all the BoardRows has processed a resize.
 */
export function allResized(boardRows) {
  return Promise.all(boardRows.map((boardRow) => onceResized(boardRow)));
}
