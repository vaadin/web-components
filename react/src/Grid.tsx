import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Grid as _Grid, type GridProps as _GridProps, WebComponentModule } from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/Grid.js';

export type GridProps<TItem> = Omit<_GridProps<TItem>, 'rowDetailsRenderer'> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function Grid<TItem = WebComponentModule.GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<WebComponentModule.Grid<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  return (
    <_Grid<TItem> {...props} ref={ref} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_Grid>
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = WebComponentModule.GridDefaultItem>(
  props: GridProps<TItem> & { ref?: ForwardedRef<WebComponentModule.Grid<TItem>> },
) => ReactElement | null;

export { ForwardedGrid as Grid, WebComponentModule };
