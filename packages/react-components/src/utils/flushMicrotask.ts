import { flushSync } from 'react-dom';

let callbackQueue: Function[] = [];

export function flushMicrotask(callback: Function) {
  callbackQueue.push(callback);

  if (callbackQueue.length === 1) {
    queueMicrotask(() => {
      const queue = callbackQueue;
      callbackQueue = [];

      flushSync(() => {
        queue.forEach((callback) => callback());
      });
    });
  }
}
