/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { GridDefaultItem, GridProps } from '@vaadin/react-components/Grid.js';
import { useModelRenderer } from '@vaadin/react-components/renderers/useModelRenderer.js';
import useDeferredColumnWidthRecalculation from '@vaadin/react-components/utils/useDeferredColumnWidthRecalculation.js';
import { GridPro as _GridPro, type GridProElement, type GridProProps as _GridProProps } from './generated/GridPro.js';

export * from './generated/GridPro.js';

export type GridProProps<TItem> = Partial<Omit<_GridProProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: GridProps<TItem>['rowDetailsRenderer'];
  }>;

function GridPro<TItem = GridDefaultItem>(
  props: GridProProps<TItem>,
  ref: ForwardedRef<GridProElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer, {
    renderMode: 'microtask',
  });

  const finalRef = useDeferredColumnWidthRecalculation(ref);

  return (
    <_GridPro<TItem> {...props} ref={finalRef} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_GridPro>
  );
}

const ForwardedGridPro = forwardRef(GridPro) as <TItem = GridDefaultItem>(
  props: GridProProps<TItem> & RefAttributes<GridProElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridPro as GridPro };
