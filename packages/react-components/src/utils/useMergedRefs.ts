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
  }, refs);
}
