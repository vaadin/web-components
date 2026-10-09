/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { type ForwardedRef, type RefCallback, useCallback } from 'react';
import type { GridElement } from '../generated/Grid.js';
import useMergedRefs from './useMergedRefs.js';

/**
 * Defers `recalculateColumnWidths()` into a microtask so that the React renderer
 * portals have content before the column widths are measured.
 * Returns the ref to pass to the grid element.
 */
export default function useDeferredColumnWidthRecalculation<T extends GridElement<any>>(
  ref: ForwardedRef<T>,
): RefCallback<T> {
  const patchRef = useCallback((element: T | null) => {
    if (element) {
      element.recalculateColumnWidths = function (...args) {
        // Wait for column content to finish rendering before recalculating widths.
        queueMicrotask(() => {
          Object.getPrototypeOf(this).recalculateColumnWidths.call(this, ...args);
        });
      };
    }
  }, []);

  return useMergedRefs(patchRef, ref);
}
