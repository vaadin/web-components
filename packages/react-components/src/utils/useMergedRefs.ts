/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { type ForwardedRef, type RefCallback, useCallback } from 'react';

export default function useMergedRefs<T extends HTMLElement>(...refs: ReadonlyArray<ForwardedRef<T>>): RefCallback<T> {
  return useCallback((element: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (!!ref) {
        ref.current = element;
      }
    });
    // The refs array is the dependency list, so the callback updates when any ref changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
