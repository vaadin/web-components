import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import { GridPro as _GridPro, GridProModule, type GridProProps as _GridProProps } from './generated/GridPro.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export type GridProProps<TItem> = Omit<_GridProProps<TItem>, 'rowDetailsRenderer'> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function GridPro<TItem = GridModule.GridDefaultItem>(
  props: GridProProps<TItem>,
  ref: ForwardedRef<GridProModule.GridPro<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  return (
    <_GridPro<TItem> {...props} ref={ref} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_GridPro>
  );
}

const ForwardedGridPro = forwardRef(GridPro) as <TItem = GridModule.GridDefaultItem>(
  props: GridProProps<TItem> & { ref?: ForwardedRef<GridProModule.GridPro<TItem>> },
) => ReactElement | null;

export { ForwardedGridPro as GridPro, GridProModule };
