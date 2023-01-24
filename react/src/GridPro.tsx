import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import { GridPro as _GridPro, type GridProElement, type GridProProps as _GridProProps } from './generated/GridPro.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/GridPro.js';

export type GridProProps<TItem> = Partial<Omit<_GridProProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function GridPro<TItem = GridDefaultItem>(
  props: GridProProps<TItem>,
  ref: ForwardedRef<GridProElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  return (
    <_GridPro<TItem> {...props} ref={ref} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_GridPro>
  );
}

const ForwardedGridPro = forwardRef(GridPro) as <TItem = GridDefaultItem>(
  props: GridProProps<TItem> & RefAttributes<GridProElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridPro as GridPro };
