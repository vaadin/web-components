import { flushSync } from 'react-dom';

const callbackQueue: Function[] = [];

export function flushMicrotask(callback: Function) {
  callbackQueue.push(callback);

  if (callbackQueue.length === 1) {
    queueMicrotask(() => {
      flushSync(() => {
        callbackQueue.splice(0).forEach((callback) => callback());
      });
    });
  }
}
