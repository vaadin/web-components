import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  Grid as _Grid,
  type GridDefaultItem,
  type GridElement,
  type GridProps as _GridProps,
} from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import useMergedRefs from './utils/useMergedRefs.js';

export * from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer, {
    renderMode: 'microtask',
  });

  const innerRef = useRef<GridElement>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  useLayoutEffect(() => {
    innerRef.current!.recalculateColumnWidths = function (...args) {
      // Wait for column content to finish rendering before recalculating widths.
      queueMicrotask(() => {
        Object.getPrototypeOf(this).recalculateColumnWidths.call(this, ...args);
      });
    };
  }, []);

  return (
    <_Grid<TItem> {...props} ref={finalRef} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_Grid>
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = GridDefaultItem>(
  props: GridProps<TItem> & RefAttributes<GridElement<TItem>>,
) => ReactElement | null;

export { ForwardedGrid as Grid };
