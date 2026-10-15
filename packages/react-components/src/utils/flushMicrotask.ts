/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
